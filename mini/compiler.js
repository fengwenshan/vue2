
/**
 * 负责编译模板，解析指令 / 差值表达式
 * 负责页面的首次渲染
 * 当数据发生变化后，重新渲染
 */
import Watcher from './watcher.js';
class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.compile(this.vm.$el.childNodes);
  }
  compile(childNodes) {
    Array.from(childNodes).forEach(node => {
      if(this.isTextNode(node)) {
        this.compileText(node);
      } else if(this.isElementNode(node)) {
        this.compileElement(node);
      }
      if(node.childNodes?.length) {
        this.compile(node.childNodes);
      }
    });
  }
  compileElement(node) {
    Array.from(node.attributes).forEach(attrName => {
      if(this.isDirective(attrName.name)) {
        this.updater(node, RegExp.$1, attrName.value); 
        // 删除指令属性
        node.attributes.removeNamedItem(attrName.name);
      }
    });
  }
  updater(node, method, value) {
    this[method + 'Updater']?.call(this, node, value);
  }
  textUpdater(node, value) {
    node.textContent =  this.vm[value];
    new Watcher(this.vm, value, newValue => {
      node.textContent = newValue;
    });
  }
  modelUpdater(node, value) {
    node.value = this.vm[value];
    
    new Watcher(this.vm, value, newValue => {
      node.value = newValue;
    });
    // 注册input事件
    node.addEventListener('input', () => {
      this.vm[value] = node.value;
    });
  }
  compileText(node) {
    // 匹配文本中的差值表达式
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

    if(defaultTagRE.test(node.textContent)) {
      const key = RegExp.$1?.trim();
      node.textContent = node.textContent.replace(defaultTagRE, this.vm[key]);
      // 一个数据一个watcher对象
      new Watcher(this.vm, key, (newVal) => {
        node.textContent = newVal;
      });
    }
  }
  isDirective(attrName) {
    return /^v-(.*)/.test(attrName);
  }
  isTextNode(node) {
    return node.nodeType === 3;
  }
  isElementNode(node) {
    return node.nodeType === 1; 
  }
}

export default Compiler;