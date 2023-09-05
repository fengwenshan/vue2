const HtmlWebpackPlugin = require('html-webpack-plugin');

class MyHtmlInsertWebpackPlugin {
  constructor(options) {
    this.options = options;
  }
  // webpack 还要求这个对象提供一个名为 apply 的函数
  apply(compiler) {
    const pluginName = 'MyHtmlInsertWebpackPlugin';
    compiler.hooks.compilation.tap(pluginName, compilation => {
      /**
       * beforeAssetTagGeneration hook  开始生成HTML之前勾子
       * alterAssetTags hook 添加资源处理HTML勾子
       * alterAssetTagGroups hook
       * afterTemplateExecution hook
       * beforeEmit hook
       * afterEmit hook 勾子任务处理完毕发送事件时
       */
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(pluginName, (data, callback) => {
        this.options.forEach(src => {
          data.bodyTags.push({
            tagName: 'script',
            voidTag: false,
            meta: { plugin: 'html-webpack-plugin' },
            attributes: { defer: false, type: 'text/javascript', src}
          });
        });
        data.bodyTags[0].attributes.type = 'text/javascript';
        
        callback(null, data);
      });
    });
    

  }
}

module.exports = MyHtmlInsertWebpackPlugin;
