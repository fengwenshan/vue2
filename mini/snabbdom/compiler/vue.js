import { compile, compileToFunctions } from './compile.js';
class Vue {
  constructor(options) {
    this.$options = options;
    const { el } = options;
    // el 实例挂载
    // 这里有个问题，如果根组件挂载我使用$mount不用el那怎么办?
    // 如果没有el就不会进入这个判断，那么他就会调用Vue实例上的上面的$mount
    el && this.$mount(el);

  }
  $mount(el) {
    const app = document.querySelector(el);
    let { template, render } = this.$options;
    if(render) {

    } else {
      // - options.template 字符串标签模板
      // - options.template: '#temp' 在template 拥有id属性temp的元素中
      // - options.template: '#temp' 在script 拥有 type="text/x-template" id="xxx"的元素中
      if(template) {
        if(template.charAt(0) === '#') {
          template = document.querySelector(template);
        } else if(template.nodeType) {
          // 可能是dom节点
          template = template.innerHTML;
        } else {
          throw new Error('没有找到相应节点');
        }
      } else if(el) {
        // el 指dom元素， 没有模板就使用el
        template = el.outerHTML;
      }
      if(template) {
        const { render, staticRenderFns } = compileToFunctions(template, {}, this);
        this.$options.render = render;
        this.$options.staticRenderFns = staticRenderFns;
      }
    }
    // return mount.call(this, el);
  }
}

export default  Vue;

if (template) {
  if (typeof template === 'string') {

  } else if (template.nodeType) {
    template = template.innerHTML;
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn('invalid template option:' + template, this);
    }
    return this;
  }
} else if (el) {
  template = getOuterHTML(el);
}
