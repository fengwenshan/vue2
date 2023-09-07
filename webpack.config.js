const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MyHtmlInsertWebpackPlugin = require('./scripts/my-html-insert-webpack-plugin.js');

module.exports = {
  entry: './src/vue.ts',
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'vue.js',
    library: 'Vue',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    //添加“.ts”和“.tsx”作为可解析的扩展名。
    extensions: ['.ts', '.tsx', '.js'],
    // 添加对TypeScripts完全限定ESM导入的支持。
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts']
    }
  },
  devServer: {
    compress: true,
    port: 9000,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      scriptLoading: 'blocking',
    }),
    new MyHtmlInsertWebpackPlugin([
      'options.js'
    ])
  ],
};