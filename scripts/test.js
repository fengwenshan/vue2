
const { rollup } = require('rollup');
// 工程使用第三方模块,把源码打包进入
const nodeResolve = require('@rollup/plugin-node-resolve');
// 如果第三方库没有default, 则需要配合这个插件
const commonjs = require('@rollup/plugin-commonjs');
/**
 * 转译es代码，就需要用到babel,官方做了一个@rollup/plugin-babel
 *  pnpm install 
 *      @rollup/plugin-babel 
 *      @babel/core   babel核心代码 
 *      @babel/preset-env  语法转换
 * -D
 */
const babel = require('rollup-plugin-babel');
// 处理json
const json = require('@rollup/plugin-json');
// 处理ts  rollup-plugin-typescript2 typescript
const ts = require('rollup-plugin-typescript2');

const inputOptions = {
  input: './src/demo/index.ts',
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      // 解析拓展名为ts的文件
      extensions: ['.ts', '.js'],
    }),
    json(),
    // ts()
  ],
  // 该包不进行打包，使用外部引入
  external: ['lodash-es']
};

const outputOptions = [
  {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'demo',
    // 给lodash-es提供别名， '-'
    globals: {
      'lodash-es': '_'
    }
  }
];

(async function () {
  try {
    const bundle = await rollup(inputOptions);
    for(const outputItem of outputOptions) {
      // 在内存中生产特定于输出的代码
      // 可以对同一个bundle对象多次调用次函数
      // 将bundle.generate替换为bundle.write以直接写入磁盘
      // const { output } = await bundle.generate(outputItem);
      await bundle.write(outputItem);
      console.log('1231231');
    }
    
  } catch (err) {
    console.error(err);
  }
})();
