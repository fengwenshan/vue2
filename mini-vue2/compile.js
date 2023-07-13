/**
 * 编译器
 * 递归遍历dom树
 * 判断节点类型，如果是文本节点，则判断是否是差值表达式
 * 如果是元素
 */
import { Watcher } from './dep';
export class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    this.$el && this.compile(this.$el);
  }
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // 判断是否是元素
      if(this.isElement(node)) {
        console.log('编译元素');
      } else if(this.isInter(node)) {
        this.compileText(node);
        console.log('编译插值绑定');
      }

      // 递归子节点
      if(node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  isInter(node) {
    // 文本标签，内容是差值表达式
    return node.nodeType === 3 && /\{\{\(.*)\}\}/.test(node.textContent);
  }
  compileText(node) {
    this.update(node, RegExp.$1, 'text');
  }
  compileElement(node) {
    const nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach(attr => {
      // v-on:click="handleClick"
      const attrsName = attr.name;
      const attrValue = attr.value;
      if(this.isDirective(attrsName)) {
        const dir = attrsName.substring(2);
        this[dir] && this[dir](node, attrValue);
      }
    });
  }
  isDirective(attr) {
    return attr.indexOf('v-') === 0;
  }

  update(node, value, dirName/* 指令名称 */) {
    const fn = this[dirName + 'Updater'];
    fn && fn(node, this.$vm[value]);
    // 更新处理, 封装一个更新函数，可以更新对应dom元素
    new Watcher(this.$vm, value, function(val) {
      fn && fn(node, val);
    });
  }
  textUpdater(node, value) {
    node.textContent = value;
  }
  text(node, value) {
    // node.textContent = this.$vm[value];
    this.update(node, value, 'text');

  }
  htmlUpdater(node, value) {
    node.innerHTML = value;
  }
  html(node, value) {
    // node.innerHTML = this.$vm[value];
    this.update(node, value, 'html');
  }
}