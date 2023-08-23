
import Observer from './observer.js';
import Compiler from './compiler.js';

class Vue {
  constructor(options) {
    this.$options = options;
    const { data, el, } = options;
    this.$data = typeof options.data === 'function' ? data() : data;
    this.$el = typeof el === 'string' ? document.querySelector(el) : el /* dom */;
    // data数据进行代理 
    this.proxy();
    new Observer(this.$data);
    new Compiler(this);
  }
  proxy() {
    Object.keys(this.$data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return this.$data[key];
        },
        set(val) {
          if(this.$data[key] === val) return;
          this.$data[key] = val;
        }
      });
    });
  }
}

export default Vue;