// 使用 Virtual total 检测安装包否存在病毒告警
//（以下是包文件大于 32M 时的上传和查看结果方式）
// API 详见：https://developers.virustotal.com/v3.0/reference#file
const gulp = require("gulp");
const fs = require("fs-extra");
const fetch = require("node-fetch");
const path = require("path");
const FormData = require("form-data");
const crypto = require("crypto");
const logger = require("./logger");

// 安装包所处文件
const defaultPath = "./release";

// 大于 32M 的文件需要先使用这个地址获取上传地址。
const getUploadUrl = "https://www.virustotal.com/api/v3/files/upload_url";
const getAnalyseUrl = (id) =>
  `https://www.virustotal.com/api/v3/analyses/${id}`;
// 需要使用 virus 账号生成 api key，然后方可使用接口上传文件进行检测
const virusAPIKey = "********";

const fileHashAlgorithm = 'sha256';

function isStatsCanPass(analyseStats) {
  const { malicious, suspicious } = analyseStats;
  return !malicious && !suspicious;
}

function getFileHash(path) {
  const buffer = fs.readFileSync(path);
  const fsHash = crypto.createHash(fileHashAlgorithm);
  fsHash.update(buffer);
  const sha256hash = fsHash.digest('hex');
  return sha256hash;
}

function virusCheckSuccessLog() {
  logger.setVirusCheckResult("\n【病毒检测】通过");
  console.log(`【${new Date().toLocaleString()}】病毒检测已通过`);
}

function virusCheckErrorLog(error) {
  logger.setVirusCheckResult(`\n【病毒检测】失败或未通过，错误信息：${error.message || error}`);
  console.log(
    `【${new Date().toLocaleString()}】病毒检测失败或未通过，错误信息：`,
    error.message || error
  );
}

function uploadAnalyse(file) {
  console.log(`【${new Date().toLocaleString()}】病毒检测开始...`);
  console.log("检测文件地址：", file);
  // 获取 upload_url fetch
  return fetch(getUploadUrl, {
    method: "GET",
    headers: { "x-apikey": virusAPIKey },
  })
    .then((res) => res.json())
    .then((result) => {
      console.log("已获取到上传地址，开始上传...");
      let uploadAnalyseUrl = result.data;
      const form = new FormData();
      form.append("file", fs.createReadStream(file));
      // 上传安装包 fetch
      return fetch(uploadAnalyseUrl, {
        method: "POST",
        body: form,
        headers: { "x-apikey": virusAPIKey },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(`...virus analyseId fetched...`);
          const analyseId = result.data.id;
          // 获取包的 analyse 数据 fetch
          console.log("远端解析文件中，请稍等...");
          let timer;
          return new Promise((resolve, reject) => {
            timer = setInterval(() => {
              fetch(getAnalyseUrl(analyseId), {
                method: "GET",
                headers: { "x-apikey": virusAPIKey },
              })
                .then((res) => res.json())
                .then((result) => {
                  const {
                    attributes: { status, stats },
                  } = result.data;
                  if (status === "completed") {
                    if (!isStatsCanPass(stats)) {
                      const fileHash = getFileHash(file);
                      reject(`[安装包存在风险项，请检查安装包: https://www.virustotal.com/gui/file/${fileHash}/detection]，analyseId：${analyseId}`);
                    } else {
                      resolve();
                    }
                  } else if (status === 'failed')  {
                    reject('文件解析失败，请重新检测')
                  }
                })
                .catch((error) => {
                  reject(error);
                })
            }, 5000);
          })
          .then(() => {
            virusCheckSuccessLog();
          })
          .catch((error) => {
            virusCheckErrorLog(error);
          })
          .finally(() => {
            clearInterval(timer);
          })
        })
    })
    .catch((error) => {
      virusCheckErrorLog(error);
    });
}

// 在目录 dir 下实用 filter 条件寻找 file
function findFile(dir, filter) {
  return fs.readdirSync(dir)
  .find(file => {
    let filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      return false
    }
    return path.extname(file) === filter;
  })
}

function upload(filter, dir = defaultPath) {
  return function upload() {
    // 留一个可以跳过的入口
    if (String(process.env.SKIP_CHECK) === '1') {
      console.log("自动跳过病毒检测");
      return new Promise(function (resolve) {
        resolve();
      });
    } else {
      let releaseDir = path.join(__dirname, dir);
      var file = findFile(releaseDir, filter);
      return uploadAnalyse(path.resolve(releaseDir, file));
    }
  };
}

gulp.task("virusCheck", gulp.series(upload(".exe", defaultPath)));
