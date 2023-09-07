const esbuild = require('esbuild');
const path = require('path');

// https://blog.csdn.net/heroboyluck/article/details/130418161
// https://github.com/esbuild/community-plugins 插件列表

(async () => {
  const context = await esbuild.context({
    entryPoints: ['./src/vue.ts'],
    sourcemap: true,
    bundle: true,
    outdir: 'build', 
    // outfile: 'vue.js',
  });
  // 使用上下文开始监听
  await context.watch();
  // 开启服务
  const { host, port } = await context.serve({
    servedir: 'build',
    port: 8080,
    // host: true,
    // open: true
  });
  console.log(`${host}:${port}`);
})();





// // esbuild ./src/vue.ts --bundle --outfile=vue.js
// const devServer = require('esbuild-plugin-dev-server');
// // fs-extra添加了原生fs模块中不包含的文件系统方法，并为fs方法添加了promise支持。它还使用了graceful-fs来防止EMFILE错误。它应该是fs的替代品。
// const fs = require('fs-extra');

// // esbuild-plugin-dev-server
// esbuild.build({
//   // 入口
//   entryPoints: ['./src/vue.ts'],
//   sourcemap: true,
//   // 打包
//   bundle: true, 
//   //输出文件
//   outfile: 'build/vue.js',
//   watch: {
//     onRebuild(error, result) {
//       if(error) {
//         console.error(error);
//       } else {
//         // 这里来自动打开浏览器并且更新浏览器
//         console.log('\x1B[36m%s\x1B[39m', 'watch build succeeded');
//       }
//     }
//   }
// }).then(res => {
//   const fileName = path.join(__dirname + '../public/index.html');
//   // 判断文件是否存在，不在就生成，在不做任何处理
//   fs.ensureFileSync(fileName);
// });