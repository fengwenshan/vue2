import ts from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/vue.js',
    name: 'Vue',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    ts(),
    alias({
      entries: [
        { find: '@', replacement: './src' },
      ]
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: '/public/index.html',
      port: 3000,
      contentBase: ''
    }) : null
  ],
};