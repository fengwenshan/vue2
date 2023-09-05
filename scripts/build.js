// import { rollup } from 'rollup';
// import ts from 'rollup-plugin-typescript2';
// import alias from '@rollup/plugin-alias';
// import babel from 'rollup-plugin-babel';
// import serve from 'rollup-plugin-serve';
// import RollupPluginHtml from '@rollup/plugin-html';

// // const { rollup } = require('rollup');
// // const ts = require('rollup-plugin-typescript2');
// // const alias = require('@rollup/plugin-alias');
// // const babel = require('rollup-plugin-babel');
// // const serve = require('rollup-plugin-serve');
// // const RollupPluginHtml= require('@rollup/plugin-html');


// // 文档地址：https://rollupjs.org/javascript-api/
// const multiConfig = [
//   { // 模板编译
//     inputOptions: {
//       input: './src/compiler/index.ts'
//     },
//     outputOptions: {
//       file: './examples/compiler/compiler.js',
//       format: 'umd',
//       sourcemap: true,
//       name: 'compiler.js'
//     }
//   },
// ];

// const otherConfig = {
//   plugins: [
//     ts(),
//     alias({
//       entries: [
//         { find: '@', replacement: './src' },
//       ]
//     }),
//     babel({
//       exclude: 'node_modules/**'
//     }),
//     process.env.ENV === 'development' ? serve({
//       open: true,
//       openPage: '/public/index.html',
//       port: 3000,
//       contentBase: ''
//     }) : null,
//     RollupPluginHtml({
//       publicPath: './'
//     })
//   ]
// };

// const build = async (config) => {
//   const bundle = await rollup(config.inputOptions);
//   // for (const output of config.outputOptions) {
//   //   await bundle.write(output);
//   // }
//   await bundle.write(config.outputOptions);
// };

// multiConfig.forEach(config => {
//   Object.assign(config.inputOptions, otherConfig);
//   console.log(config, '999');
//   build(config);
// });