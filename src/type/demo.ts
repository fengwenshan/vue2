export interface Component {
  //定义Component对象的属性和方法，根据您的具体实现添加适当的类型
}
export interface ComponentOptions extends Record<string, unknown>{

}
export interface Options {
  _isComponent: unknown // any
}
export type VueConstructor = {
  new (options?: ComponentOptions): Component;
  // _init(options: ComponentOptions): void
};
const _toString = Object.prototype.toString;
export const isObject = (val: unknown): val is Record<string, unknown>  => _toString.call(val) === '[object Object]';

export class Vue {
  _init: any;
  constructor(options: Options) {
    if(options && isObject(options)){
      // Vue源码处理："noImplicitThis": false 来禁用隐式 any 类型的警告。
      this._init(options);
    } else {
      throw new Error('Options 传递对象');
    }
  }
}
export function initMixin(vue: typeof Vue) {
  Vue.prototype._init = function(vm: ComponentOptions) {
    console.log(vm);
  };
}
initMixin(Vue);