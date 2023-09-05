const alias = require('rollup-plugin-alias');
const path = require('path');
const { default: commonjs } = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const ts = require('rollup-plugin-typescript2');

const resolve = (p) => {
  return path.resolve(__dirname, '../',p);
};
const builds = {
  'runtime-cjs-dev': {
    entry: resolve('src/vue.ts'),
    dest: resolve('dist/vue.runtime.common.dev.js'),
    format: 'cjs',
    env: 'development',
    external: []
  },
  'runtime-cjs-prod': {
    entry: resolve('src/vue.ts'),
    dest: resolve('dist/vue.runtime.common.prod.js'),
    format: 'cjs',
    env: 'production',
    external: []
  },
  'runtime-esm-prod': {
    entry: resolve('src/vue.ts'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    external: []
  },
  'runtime-umd-prod':  {
    entry: resolve('src/vue.ts'),
    dest: resolve('dist/vue.runtime.browser.prod.js'),
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
      babel({
        exclude: 'node_modules/**'
      }),
      alias({
        entry: {
          'src': resolve('src')
        }
      }),
      ts({
        tsconfig: './tsconfig.json'
      })
    ].concat(opts.plugins, []),
    output: {
      file: opts.dest,
      format: opts.format,
      name: 'Vue',
      sourcemap: true
    }
  };
  return config;
};

module.exports = {
  resolve,
  builds,
  getConfig
};