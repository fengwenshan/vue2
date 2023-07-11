import { isObject} from '@/utils/type';
import initProxy from '@/instance/initProxy'
import 


export interface Options {
  _isComponent: unknown // any
}
export interface VueInstance {
  _init(options: Options): void
}

let uid = 0;
function Vue(this: VueInstance, options?: Options) {
  if(options && isObject(options)){
    // Vue源码处理："noImplicitThis": false 来禁用隐式 any 类型的警告。
    this._init(options);
  } else {
    throw new Error('Options 传递对象');
  }
}

Vue.prototype._init = function(options: Options) {
  this.uid = uid++;
  this._isVue = true;
  if(options._isComponent) {

  } else {
    this.$options = mergeOptions(resolveConstructorOptions(this.constructor), options, this);
  }
  initProxy(vm);
  this._self = this;
  // 初始化声明周期
  initLifecycle(this);
  // 初始化事件
  initEvents(this);
  // 初始化render
  initRender(this);
  // 
  callHook(this, 'beforeCreate');
  // 
  initInjections(this);
  // 
  initState(this);
  // 注入
  initProvide(this);

  callHook(this, 'created');

  if (this.$options.el) {
    this.$mount(this.$options.el);
  }
};
export default Vue;