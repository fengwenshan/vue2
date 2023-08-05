(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.compiler = global.compiler || {}, global.compiler.js = {})));
})(this, (function (exports) { 'use strict';

  /*
    a-zA-Z: 匹配所有小写和大写字母。
    \u00B7: 匹配Unicode编码为\u00B7的中间点（·）。
    \u00C0-\u00D6: 匹配Unicode编码范围在\u00C0到\u00D6之间的字符。
    \u00D8-\u00F6: 匹配Unicode编码范围在\u00D8到\u00F6之间的字符。
    \u00F8-\u037D: 匹配Unicode编码范围在\u00F8到\u037D之间的字符。
    \u037F-\u1FFF: 匹配Unicode编码范围在\u037F到\u1FFF之间的字符。
    \u200C-\u200D: 匹配Unicode编码范围在\u200C到\u200D之间的字符。
    \u203F-\u2040: 匹配Unicode编码范围在\u203F到\u2040之间的字符。
    \u2070-\u218F: 匹配Unicode编码范围在\u2070到\u218F之间的字符。
    \u2C00-\u2FEF: 匹配Unicode编码范围在\u2C00到\u2FEF之间的字符。
    \u3001-\uD7FF: 匹配Unicode编码范围在\u3001到\uD7FF之间的字符。
    \uF900-\uFDCF: 匹配Unicode编码范围在\uF900到\uFDCF之间的字符。
    \uFDF0-\uFFFD: 匹配Unicode编码范围在\uFDF0到\uFFFD之间的字符。
  */
  /**
   * @description 逗号分隔，映射
   */
  const makeMap = (str, expectsLowerCase) => {
      const map = Object.create(null);
      str.split(',').forEach(key => { map[key] = true; });
      return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
  };

  const isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
      'link,meta,param,source,track,wbr');

  const makeAttrsMap = (attrs) => {
      const map = Object.create(null);
      attrs.forEach(item => {
          map[item.name] = item.value;
      });
      return map;
  };
  const createASTElement = (tag, attrs, parent) => {
      return {
          type: 1,
          tag,
          attrsList: attrs,
          attrsMap: makeAttrsMap(attrs),
          rawAttrsMap: {},
          parent,
          children: []
      };
  };
  // 注释标签正则
  // const comment = /^<!\--/;
  // <![if !IE]> 
  // <!--[if !IE]--> 
  // const conditionalComment = /^<!\[/;
  // 用于匹配 Unicode 字符集范围内的字符。这个正则表达式包含了多个 Unicode 范围，以支持匹配不同语言的字符
  const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  // 用于匹配 XML 或 HTML 中的名称（Name）标识符。这个正则表达式使用了 unicodeRegExp 作为子表达式，以支持更广泛的字符范围，并且名称必须以字母或下划线开头，后面可以包含字母、数字、下划线、连字符和其他支持的 Unicode 字符。
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
  // 用于匹配 XML 或 HTML 中的限定名（Qualified Name）。这个正则表达式使用了 ncname 作为子表达式，以匹配标签名称（带有命名空间前缀，例如 namespace:tag 格式）
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  // 用于匹配 XML 或 HTML 中的开始标签的开头部分。这个正则表达式使用了 qnameCapture 作为子表达式，以匹配标签的名称。
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  // 标签匹配右半部分
  const startTagClose = /^\s*(\/?)>/;
  // 是用于处理 Vue 模板编译时动态绑定属性的正则表达式
  const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // 标签中的 属性
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  // 结束标签
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
  /**
   * 解析HTML
   * @param html 模板
   * @param options
   */
  function parseHTML(html, options) {
      let index = 0;
      const stack = [];
      // 移动光标截取字符串串
      const advance = (n) => {
          index += n;
          html = html.substring(n);
      };
      // 解析开始标签
      const startTagOpenMatch = () => {
          const start = html.match(startTagOpen);
          if (start) {
              const match = {
                  tagName: start[1],
                  attrs: [],
                  start: index,
                  end: index
              };
              advance(start[0].length);
              // 分割属性
              let end = null, attr = null;
              while (!(end = html.match(startTagClose))
                  &&
                      (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
                  advance(attr[0].length);
                  html = html.substring(attr[0].length);
                  match.attrs.push(attr);
              }
              // 匹配结束标签
              if (end) {
                  // 自闭合标识，是：'/', 否: ''
                  match.unarySlash = end[1];
                  advance(end[0].length);
                  match.end = index;
                  return match;
              }
          }
      };
      // 处理解析后的开始标签对象
      const handleStartTag = (match) => {
          const { tagName, start, end } = match;
          // 判断标签是否是自闭合标签
          const unary = isUnaryTag(match.tagName) || !!match.unarySlash;
          // 处理标签属性
          const attrs = new Array(match.attrs.length);
          match.attrs.forEach((item, index) => {
              attrs[index] = {
                  name: item[1],
                  value: item[3] || item[4] || item[5]
              };
          });
          // HTML规范中，是双标签的进入判断
          if (!unary) {
              stack.push({
                  tag: tagName,
                  lowerCaseTag: tagName.toLowerCase(),
                  attrs,
                  start,
                  end: end
              });
          }
          if (options.start) {
              options.start(tagName, attrs, unary, start, end);
          }
      };
      while (html) {
          let textEnd = html.indexOf('<');
          if (textEnd === 0) {
              // 判断是否是开始标签
              const startMatch = startTagOpenMatch();
              if (startMatch) {
                  handleStartTag(startMatch);
                  continue;
              }
              // 判断是否是结束标签
              const end = html.match(endTag);
              if (end) {
                  advance(end[0].length);
                  continue;
              }
          }
          // 既不是开始标签，也不是结束标签，那就是文本
          let rest, next, text;
          if (textEnd >= 0) {
              // 返回一个新的字符串，不会改变原来的字符串
              rest = html.slice(textEnd);
              // 新的字符串是否开始是否是标签开始
              while (!endTag.test(rest) && !startTagOpen.test(rest)) {
                  // 解决字符串中含有多个<
                  next = rest.indexOf('<', 1);
                  if (next === -1)
                      break;
                  textEnd += next;
                  rest = html.slice(textEnd);
              }
              text = html.substring(0, textEnd);
          }
          // 如果模板中找不到，那么整个都是文本
          if (textEnd < 0)
              text = html;
          if (text) {
              // 移动光标，裁切
              advance(text.length);
          }
      }
      return html;
  }

  const template = `
  <div>
    <p>{{ count }}</p>
  </div>
`;
  // 用于匹配指令、事件绑定和属性绑定等在模板中以 v-、@、:、.、# 开头的字符串
  const dirRE = /^v-|^@|^:|^\.|^#/;
  // 匹配v-bind
  const bindRE = /^:|^\.|^v-bind:/;
  function closeElement(element) {
      const processElement = new ProcessElement(element);
      return processElement.element;
  }
  class ProcessElement {
      constructor(element) {
          this.element = element;
          this.modifiers = null;
          this.key();
          this.ref();
          this.slotContent();
          this.slotOutlet();
          this.component();
          this.attrs();
      }
      ref() { }
      key() { }
      slotContent() { }
      slotOutlet() { }
      component() { }
      attrs() {
          this.element.attrsList.forEach(attrList => {
              const { name, value } = attrList;
              // 判断是否是指令
              if (dirRE.test(name)) {
                  // 做个标记，这个标签必定不是动态属性
                  this.element.hasBindings = true;
              }
          });
      }
  }
  const parse = (template) => {
      const stack = [];
      parseHTML(template, {
          /**
           * 解析到标签开始，触发该函数
           * @param tag 标签属性
           * @param attrs 标签属性
           * @param unary 是否自闭合
           */
          start(tag, attrs, unary) {
              const element = createASTElement(tag, attrs);
              if (!unary) {
                  stack.push(element);
              }
          },
          /**
           * 解析到标签结束，触发该函数
           *
           */
          end(tag, start, end) {
              const element = stack[stack.length - 1];
              stack.length -= 1;
              closeElement(element);
          },
          /**
           * 解析到文本，触发该函数
           */
          chars(text) {
          },
          // 解析到注释，触发该函数
          comment(text, start, end) {
          }
      });
  };
  parse(template.trim());

  exports.bindRE = bindRE;
  exports.dirRE = dirRE;

}));
//# sourceMappingURL=compiler.js.map
