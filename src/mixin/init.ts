import {Component, Options} from '@/type/component';
import { initState } from './state';



// let _uid = 0;
export function initMixin(Vue: typeof Component) {
  Vue.prototype._init = function(options: Options) {
    // 1. 把data数据代理到vm实例上面
    // 2. 劫持数据
    initState(this);
  };
}



