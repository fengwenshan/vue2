import { rollup } from 'rollup';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import ts from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import html from '@rollup/plugin-html';
// 如果第三方库没有default, 则需要配合这个插件
const commonjs = require('@rollup/plugin-commonjs');
// http://www.zlprogram.com/Show/37/37759.shtml

// 文档 https://www.rollupjs.com/guide/big-list-of-options
// export default {
//   input: './src/vue.ts',
//   output: {
//     file: './dist/vue.js',
//     name: 'Vue',
//     format: 'umd', // esm, iife, cjs, amd, umd, system 
//     sourcemap: true
//   },
//   plugins: [
//     babel({
//       exclude: 'node_modules/**' // 排除node_modules所有文件
//     }),
//     html({
//       lang: 'zh-cn',
//       publicPath: './'
//     }),
//     ts({
//       tsconfig: './tsconfig.json'
//     }),
//     // process.env.ENV === 'development' ? serve({
//     //   open: true,
//     //   openPage: 'public/index.html',
//     //   port: 3000,
//     //   contentBase: ''
//     // }) : null
//   ]
// };
const resolve = (p) => {
  return path.resolve(dirname(fileURLToPath(import.meta.url)), p);
};
const builds = {
  'runtime-cjs-prod': {
    entry: resolve('src/index.ts'),
    dest: name => `dist/${name}.js`,
    format: 'cjs',
    env: 'production',
    external: []
  },
  'runtime-esm-prd': {
    entry: resolve('src/index.ts'),
    dest: name => `dist/${name}.js`,
    format: 'esm',
    env: 'production',
    external: []
  },
  'runtime-umd-prd': {
    entry: resolve('src/index.ts'),
    dest: name => `dist/${name}.js`,
    format: 'umd',
    env: 'production',
    external: []
  }
};

const getConfig = (name) => {
  const opts = builds[name];
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      commonjs(),
      babel(),
      // 设置全局路径别名
      alias({
        entries: {
          'src': resolve('src'),
        }
      }),
      ts({
        tsconfig: resolve('./tsconfig.json')
      })
    ].concat(opts.plugins, []),
    output: {
      file: opts.dest(name),
      format: opts.format,
      name: opts.name || 'Nice_utils',
    }
  };
  return config;
};


export default Object.keys(builds).map(getConfig);