import { isUnaryTag } from '@/shared/dom';
import type { ParseHTMLOptionsType, MatchType, ASTElement, ASTElementAttrs } from './type';

// export const makeAttrsMap = (attrs: Record<string, any>[]): Record<string, any> => {
//   const map = Object.create(null);
//   attrs.forEach(item => {
//     map[item.name] = item.value;
//   });
//   return map;
// };

// export const createASTElement = (tag: string, attrs: ASTElementAttrs, parent: ASTElement | void) => {
//   return {
//     type: 1 as const,
//     tag,
//     attrsList: attrs,
//     attrsMap: makeAttrsMap(attrs),
//     rawAttrsMap: {},
//     parent,
//     children: []
//   };
// };

// // 禁用的标签
// export const isForbiddenTag = (el: ASTElement): boolean => {
//   return el.tag === 'style' 
//     || 
//   ( el.tag === 'script' 
//       &&
//     !el.attrsMap.type || el.attrsMap.type === 'text/javascript'
//   );
// };



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

// export const parseOptions = {
//   start(tag: string, attrs: ASTElementAttrs, start: number, end?: number, unary?: boolean) {},
//   end(tag: string, start: number, end: number) { }, 
//   chars(text: string) { },
//   comment(text: string, start: number, end: number) {}
// };


export const parseOptions = {
  start(tag: string, attrs: ASTElementAttrs, start: number, end?: number, unary?: boolean) {},
  end(tag: string, start: number, end: number) { }, 
  chars(text: string, start: number, end: number) { 
  
  },
  comment(text: string, start: number, end: number) {}
};
/**
 * 解析HTML 
 * @param html 模板
 * @param options 
 */
export default class ParseHTML {
  public html: string;
  public options: ParseHTMLOptionsType;
  private index: number;
  // private stack: ASTElement[];
  constructor(html: string, options: ParseHTMLOptionsType) {
    this.html = html;
    this.options = options;
    this.index = 0;
    // 存储双标签，非一元标签
    const stack: ASTElement[] = [];
    // 栈最顶层标签
    let lastTag: string | undefined = undefined;
    while(this.html) {
      let textEnd = this.html.indexOf('<');
      
      if(textEnd === 0) {
        // 进一步判断标签的开始 <
        const startTagMatch = this.parseStartTag();
        if(startTagMatch) {
          if(!startTagMatch.unary) {
            this.handleStartTag(startTagMatch);
            stack.push(startTagMatch);
            lastTag = startTagMatch.tag;
          }
          if(options.start) {
            const { tag, attrs, unary, start, end } = startTagMatch;
            options.start(tag, attrs, start, end, unary);
          }

          continue;
        }
        // 也有可能是标签的结束 <
        const end = this.html.match(endTag);
        if(end) {
          const current = this.index;
          this.advance(end[0].length);
          this.parseEndTag(end[1], current, this.index);
          continue;
        }
      }

      // 那就是文本
      let rest, next, text;
      if(textEnd >= 0) {
        // 返回一个新的字符串，不会改变原来的字符串
        rest = this.html.slice(textEnd);
        // 新的字符串是否开始是否是标签开始
        while(!endTag.test(rest) && !startTagOpen.test(rest)) {
          // 解决字符串中含有多个<
          next = rest.indexOf('<', 1);
          if(next === -1) break;
          textEnd += next;
          rest = this.html.slice(textEnd);
        }
        text = this.html.substring(0, textEnd);
      }
      // 如果模板中找不到，那么整个都是文本
      if(textEnd < 0) text = this.html;
      if(text) {
        // 移动光标，裁切
        this.advance(text.length); 
        if(options.chars) {
          options.chars(text, this.index - text.length, this.index);
        }
      }
    }
  }
  advance(n: number) {
    this.index += n;
    this.html = this.html.substring(n);
  }
  // 解析标签开始
  parseStartTag() {
    const start = this.html.match(startTagOpen);
    if(start) {
      const match: ASTElement = {
        type: 1,
        tag: start[1],
        attrs: [],
        dynamicAttrs: [],
        start: this.index,
      };
      this.advance(start[0].length);
      let end, attr;
      while(
        !(end = this.html.match(startTagClose))
        &&
        (attr = this.html.match(dynamicArgAttribute) || this.html.match(attribute))
      ) {
        this.advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
      }
      // 匹配结束标签
      if(end) {
        // 自闭合标识，是：'/', 否: ''
        match.unary = isUnaryTag(start[1]) || !!end[1];
        this.advance(end[0].length);
        match.end = this.index;
        return match;
      }
    }
  }
  // 用来处理parseStartTag 的结果
  handleStartTag(match: ASTElement) {
    // match.attrs.forEach(attrItem => {
    //   attr
    // })
  }
  // 解析标签结束
  parseEndTag(tag: string, start: number, end: number) {

  }
}
// export function parseHTML(html: string, options: ParseHTMLOptionsType) {
//   let index = 0;
//   const stack: {
//     tag: string,
//     lowerCaseTag: string,
//     end: number
//     start: number
//     attrs: { value: string, name: string }[]
//   }[] = [];

//   // 移动光标截取字符串串
//   const advance = (n: number) => {
//     index += n;
//     html = html.substring(n);
//   };
//   // 解析开始标签
//   const startTagOpenMatch = () => {
//     const start = html.match(startTagOpen);
//     if(start) {
//       const match: MatchType = {
//         tagName: start[1],
//         attrs: [],
//         start: index,
//         end: index
//       };
//       advance(start[0].length);
//       // 分割属性
//       let end: null | RegExpMatchArray = null, 
//         attr: string[] & { start?: number, end?: number } | null = null;
//       while(
//         !(end = html.match(startTagClose))
//         &&
//         (attr = html.match(dynamicArgAttribute) || html.match(attribute))
//       ) {
//         advance(attr[0].length);
//         match.attrs.push(attr);
//       }
//       // 匹配结束标签
//       if(end) {
//         // 自闭合标识，是：'/', 否: ''
//         match.unarySlash = end[1];
//         advance(end[0].length);
//         match.end = index;
//         return match;
//       }
//     }
//   };
//   // 处理解析后的开始标签对象
//   const handleStartTag = (match: MatchType) => {
//     const { tagName, start, end } = match;
//     // 判断标签是否是自闭合标签
//     const unary = isUnaryTag(match.tagName) || !!match.unarySlash;
//     // 处理标签属性
//     const attrs: { value: string, name: string }[] = new Array(match.attrs.length);
//     match.attrs.forEach((item, index) => {
//       attrs[index] = {
//         name: item[1],
//         value: item[3] || item[4] || item[5]
//       };
//     });
//     // HTML规范中，是双标签的进入判断
//     if(!unary) {
//       stack.push({
//         tag: tagName,
//         lowerCaseTag: tagName.toLowerCase(),
//         attrs,
//         start,
//         end: end!
//       });
//     }
//     if(options.start) {
//       options.start(tagName, attrs, unary, start, end!);
//     }
//   };

//   // while(html) {
//   //   let textEnd = html.indexOf('<');
//   //   if(textEnd === 0) {
//   //     // 判断是否是开始标签
//   //     const startMatch = startTagOpenMatch();
//   //     if(startMatch) {
//   //       handleStartTag(startMatch);
//   //       continue;
//   //     }
//   //     // 判断是否是结束标签
//   //     const end = html.match(endTag);
//   //     if(end) {
//   //       advance(end[0].length);
//   //       continue;
//   //     }
//   //   }
  
//   //   // 既不是开始标签，也不是结束标签，那就是文本
//   //   let rest, next, text;
//   //   if(textEnd >= 0) {
//   //     // 返回一个新的字符串，不会改变原来的字符串
//   //     rest = html.slice(textEnd);
//   //     // 新的字符串是否开始是否是标签开始
//   //     while (!endTag.test(rest) && !startTagOpen.test(rest)) {
//   //       // 解决字符串中含有多个<
//   //       next = rest.indexOf('<', 1);
//   //       if(next === -1) break;
//   //       textEnd += next;
//   //       rest = html.slice(textEnd);
//   //     }
//   //     text = html.substring(0, textEnd);
//   //   }
//   //   // 如果模板中找不到，那么整个都是文本
//   //   if(textEnd < 0) text = html;
//   //   if(text) {
//   //     // 移动光标，裁切
//   //     advance(text.length); 
//   //   }
//   // }
// }