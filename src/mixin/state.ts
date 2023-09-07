import { observe, proxy } from '@/observer/observer';
import { isFunction, isPlainObject } from '@/shared/is';
import {Component, PropsType, WatchFn, WatchObject, WatchOptions} from '@/type/component';


/**
 * 
 * @param vm 
 */
export function initState(vm: Component) {
  const keys = Object.keys(vm.$data);
  // 代理到vue实例上
  keys.forEach(key => {
    proxy(vm, '$data', key);
  });
  observe(vm.$data);
  console.log(vm);
}


/**
 * 整理watch参数，
 * @param vm
 * @param expOrFn cb为对象，提取handler 与 options, 如果cb为字符串，拿去vm身上代理的函数名
 * @param cb
 * @param options
 */
function createWatcher(vm: Component, expOrFn: string | (() => any), cb: WatchObject | WatchFn | string, options?: WatchOptions) {
  let option = options;
  let handler: WatchFn = () => {};
  if(isPlainObject(cb)) {
    option = cb;
    handler = cb.handler;
  }
  if (typeof cb === 'string') {
    handler = vm[cb];
  }
  return vm.$watch(expOrFn, handler, option);
}

// inject proxy 都放到这个里面
export function stateMixin(Vue: typeof Component) {
  Object.defineProperty(Vue.prototype, '$data', {
    get() {
      return this._data;
    }
  });
  Object.defineProperty(Vue.prototype, '$props', {
    get() {
      return this._props;
    }
  });
  // Vue.prototype.$set = set
  // Vue.prototype.$delete = del
  // https://v2.cn.vuejs.org/v2/api/#vm-watch
  // Vue.prototype.$watch = function(expOrFn, cb, options) {
  //   const vm: Component = this;
  //   if(isPlainObject(cb)) {
  //     // 整理参数使用, 这里面没有options， options在cb对象里面
  //     return createWatcher(vm, expOrFn, cb, options);
  //   }
  //   const option = Object.assign({ user: true }, options);
  //   const watcher = new Watcher(vm, expOrFn, cb, options);
  //   if (option.immediate) {
  //     const info = `callback for immediate watcher "${watcher.expression}"`;
  //     pushTarget();
  //     invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
  //     popTarget();
  //   }
  //   return function unwatchFn () {
  //     watcher.teardown();
  //   };
  // };
}