import {Component, Options} from '@/type/component';
import { initState } from './state';



// let _uid = 0;
export function initMixin(Vue: typeof Component) {
  Vue.prototype._init = function(options: Options) {
    this.$options = options;
    this.$data = typeof options.data === 'function' ? options.data.call(this) : options.data;
    initState(this);
  };
}



