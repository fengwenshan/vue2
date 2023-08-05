import { observe, proxy } from '@/observer/observer';
import { hasOwn, isFunction, isPlainObject } from '@/shared/util';
import { Component, PropsType } from '@/type/component';


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
  const opt = vm.$options;
  let data: Record<any, any> = {}; // = opt.data;
  // 初始化 data 数据
  if(isFunction(opt.data)) {
    data = opt.data.call(vm);
  } else if(isPlainObject(opt.data)) {
    data = opt.data;
  }
  vm._data = data;
  const keys = Object.keys(data);
  keys.forEach(key => {
    proxy(vm, '_data', key);
  });
  observe(data);


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

// inject proxy 都放到这个里面
export function stateMixin(Vue: typeof Component) {
  console.log(Vue);
}