/**
 * auther  : liuyuqi <LiuYQEmily@163.com>
 * usage   : 用来将编译好的代码拷贝至对应的 service 目录下
 * example : 例如在开发 xxx-service 时，执行的命令为：`npm run build:dev; gulp dynalink`
 * addons  : 配置 addons 字段可以同时拷贝 @my-package 需要依赖的其他库
 */

const gulp = require('gulp');
const fs = require('fs');

const configs = JSON.parse(fs.readFileSync('./dynaLink.json'));

const currentService = process.argv[2];

const config = configs[currentService];

console.log('current service config is: ', config);

const { origin, linkto, addons } = config;

gulp.task(currentService, function(callback) {
  console.log('currentService is', currentService)
  gulp.src(origin).pipe(gulp.dest(linkto));
  callback()
  if (addons) {
    addons.forEach(function(addon) {
      const { origin, linkto } = addon;
      gulp.src(origin).pipe(gulp.dest(linkto));
    });
  }
});

// 动态监视
// const watcher = gulp.watch(origin, [currentService]);
// watcher.on('change', function(event) {
//   console.log(
//     'File ' + event.path + ' was ' + event.type + ', running tasks...',
//   );
// });
