import { createASTElement, parseHTML } from './parse-html';
import { ASTElement, ASTElementAttrs } from './type';

const template = `
  <div>
    <p>{{ count }}</p>
  </div>
`;
// 用于匹配指令、事件绑定和属性绑定等在模板中以 v-、@、:、.、# 开头的字符串
export const dirRE = /^v-|^@|^:|^\.|^#/;
// 匹配v-bind
export const bindRE = /^:|^\.|^v-bind:/;

function closeElement(element: ASTElement) {
  const processElement = new ProcessElement(element);
  return processElement.element;
}


class ProcessElement {
  public element: ASTElement;
  public modifiers: null;
  constructor(element: ASTElement) {
    this.element = element;
    this.modifiers = null;
    this.key();
    this.ref();
    this.slotContent();
    this.slotOutlet();
    this.component();
    this.attrs();
    
  }
  ref() {}
  key() {}
  slotContent() {}
  slotOutlet() {}
  component() {}
  attrs() {
    this.element.attrsList.forEach(attrList => {
      const { name, value } = attrList;
      // 判断是否是指令
      if(dirRE.test(name)) {
        // 做个标记，这个标签必定不是动态属性
        this.element.hasBindings = true;
        // 匹配name就是v-bind
        if(bindRE.test(name)) {
          // ...
        }

      }
    });
  }
}

const parse = (template: string) => {
  const stack: ASTElement[] = [];
  
  
  parseHTML(template, {
    /**
     * 解析到标签开始，触发该函数
     * @param tag 标签属性
     * @param attrs 标签属性
     * @param unary 是否自闭合
     */
    start(tag: string, attrs: ASTElementAttrs, unary: boolean) {
      const element: ASTElement = createASTElement(tag, attrs);
      
      let root;
      // processFor(element);
      // processIf(element);
      // processOnce(element);
      if (!root) root = element;

      if (!unary) {
        stack.push(element);
      } else {
        // 自闭合标签
        // closeElement(element);
      }
    },
    /**
     * 解析到标签结束，触发该函数
     * 
     */
    end(tag: string, start: number, end: number) {
      const element = stack[stack.length - 1];
      stack.length -= 1;
      closeElement(element);
    },
    /**
     * 解析到文本，触发该函数
     */
    chars(text: string) {

    },
    // 解析到注释，触发该函数
    comment(text: string, start: number, end: number) {
      const child = {
        type: 3,
        text,
        isComment: true
      };
    }
  });
};

const ast = parse(template.trim());

