import { observe, proxy } from '@/observer/observer';
import { isFunction, isPlainObject } from '@/shared/util';
import {Component, PropsType, WatchFn, WatchObject, WatchOptions} from '@/type/component';


export function initProxy(vm: Component) {
  console.log(vm);
}

export function initInject(vm: Component) {
  console.log(vm);
}
/**
 * 
 * @param vm 
 */
export function initState(vm: Component) {
  const keys = Object.keys(vm.$data);
  // 代理到vue实例上
  keys.forEach(key => {
    proxy(vm, '_data', key);
  });
  // observe(data);


  // 初始化方法

  console.log(vm, '111');
  // vm._watcher = [];
  // const opts = vm.$options;
  // if(opts.props) initProps(vm, opts.props);
  // if(opts.methods) initMethods(vm, opts.methods);
  // if(opts.data) {
  //   initData(vm);
  // } else {
  //   observe(vm._data = {}, true);
  // }
  // console.log(vm);
}

// function validateProp(key: string, propOptions: PropsType, vm: Component) {
//   const prop = propOptions[key];
//   const absent = !hasOwn()
// }
export function initProps(vm: Component, propsOptions: PropsType) {
  // const props = vm._props = {};
  // const keys: string[] = vm.$options._propKeys = [];
  // // const isRoot = !vm.$parent;
  // // // 切换响应式，把响应式关掉
  // for(const key in propsOptions) {
  //   // keys.push(key);
  //   defineReactive(props, key, true);
  //   if(!(key in vm)) {
  //     proxy(vm, '_props', key);
  //   }
  // }
  // // // 切换响应式，把响应式开启
  
}

export function initProvide(vm: Component) {
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