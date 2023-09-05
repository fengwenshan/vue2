const browserSync = require('browser-sync');
const gulp = require('gulp');
const { rollup } = require('rollup');
const { builds, getConfig } = require('./rollup.config.js');
const { resolve } = require('path');

const buildTask = (keyName) => {
  gulp.task('build', () => {
    const { input, output, plugins } = getConfig(keyName);
    return rollup({
      input,
      plugins
    }).then(bundle => bundle.write({ ...output, sourcemap: true })); 
  });
};

const devServer = () => {
  const server = browserSync.create();
  gulp.task('server', () => {
    server.init({
      port: '8080',
      open: true,
      files: '../src/*', // 当dist文件下有改动时，会自动刷新页面
      server: {
        baseDir: resolve(__dirname, '../', 'dist') // 基于当前根目录
      },
      serveStatic: ['.', './dist'],
    });
  });
};

const start = async () => {
  const keys = Object.keys(builds)[3]; // 输出umd模式
  const mode = {
    server: devServer(),
    build: buildTask(keys)
  };
  await mode[process.argv[2]]?.();
};

start();