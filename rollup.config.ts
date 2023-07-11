import ts from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/my-library.js',
      format: 'esm',
    },
    {
      file: 'dist/my-library.cjs.js',
      format: 'cjs',
    },
  ],
  plugins: [
    ts(),
    alias({
      entries: [
        { find: '@', replacement: './src' },
      ]
    })
  ],
};