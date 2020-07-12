// 使用 Virtual total 检测安装包否存在病毒告警
//（以下是包文件大于 32M 时的上传和查看结果方式）
// API 详见：https://developers.virustotal.com/v3.0/reference#file
const gulp = require("gulp");
const fs = require("fs-extra");
const fetch = require("node-fetch");
const path = require("path");
const FormData = require("form-data");

// 安装包所处文件
const defaultPath = "./release";

// 大于 32M 的文件需要先使用这个地址获取上传地址。
const getUploadUrl = "https://www.virustotal.com/api/v3/files/upload_url";
const getAnalyseUrl = (id) =>
  `https://www.virustotal.com/api/v3/analyses/${id}`;
// 需要 virus 账号生成 api key 后方可使用接口上传文件进行检测
const virusAPIKey = "********";

function isStatsCanPass(analyseStats) {
  const { malicious, suspicious } = analyseStats;
  return !malicious && !suspicious;
}

function uploadAnalyse(file) {
  console.log("file path:", file);
  // 获取 upload_url fetch
  return fetch(getUploadUrl, {
    method: "GET",
    headers: { "x-apikey": virusAPIKey },
  })
    .then((res) => res.text())
    .then((result) => {
      console.log("fetch upload_url: ", JSON.parse(result).data);
      let uploadAnalyseUrl = JSON.parse(result).data;
      const form = new FormData();
      form.append("file", fs.createReadStream(file));
      // 上传安装包 fetch
      fetch(uploadAnalyseUrl, {
        method: "POST",
        body: form,
        headers: { "x-apikey": virusAPIKey },
      })
        .then((res) => res.text())
        .then((result) => {
          console.log(`virus analyseId: `, JSON.parse(result).data);
          const analyseId = JSON.parse(result).data.id;
          // 获取包的 analyse 数据 fetch
          fetch(getAnalyseUrl(analyseId), {
            method: "GET",
            headers: { "x-apikey": virusAPIKey },
          })
            .then((res) => res.text())
            .then((result) => {
              console.log(`virus analyse result: `, JSON.parse(result).data);
              const {
                attributes: { status, stats },
              } = JSON.parse(result).data;
              // 可能是分析没完成的状态，此时需要定时(5s)检查结果
              if (status !== "completed") {
                console.log("... analyse incompleted, retry...");
                const timer = setInterval(() => {
                  fetch(getAnalyseUrl(analyseId), {
                    method: "GET",
                    headers: { "x-apikey": virusAPIKey },
                  })
                    .then((res) => res.text())
                    .then((result) => {
                      console.log(
                        `virus analyse result: `,
                        JSON.parse(result).data
                      );
                      const {
                        attributes: { status, stats },
                      } = JSON.parse(result).data;
                      if (status === "completed") {
                        clearInterval(timer);
                        if (!isStatsCanPass(stats)) {
                          throw new Error(
                            `病毒检测未通过，请检查安装包。病毒检测地址：https://www.virustotal.com/gui/home/upload`
                          );
                        }
                      }
                    });
                }, 5000);
              } else {
                if (!isStatsCanPass(stats)) {
                  throw new Error(
                    `病毒检测未通过，请检查安装包。病毒检测地址：https://www.virustotal.com/gui/home/upload`
                  );
                }
              }
            })
            .catch((error) => {
              console.log(`get virus analyse error: `, error);
              throw new Error(`get virus analyse error`);
            });
          // console.log(`virus check pass: file(${file})`);
        })
        .catch((error) => {
          console.log(`Virus Check upload error:`, error);
          throw new Error(`Virus Check upload error`);
        });
    })
    .catch((e) => {
      console.log(`Virus check error:`, error);
      return new Promise(function (_resolve, reject) {
        reject(new Error(`Virus check error: ${e}`));
      });
    });
}

// 在目录 dir 下实用 filter 条件寻找 file
function findFile(dir, filter) {
  return fs.readdirSync(dir).find((file) => {
    let filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      return false;
    }
    return path.extname(file) === filter;
  });
}

function upload(filter, dir = defaultPath) {
  return function upload() {
    let releaseDir = path.join(__dirname, dir);
    var file = findFile(releaseDir, filter);
    return uploadAnalyse(path.resolve(releaseDir, file));
  };
}

gulp.task("virusCheck", gulp.series(upload(".exe", defaultPath)));
