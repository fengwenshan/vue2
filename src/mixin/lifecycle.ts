import { Component, Hook } from '@/type/component';


export function initLifecycle(vm: Component) {
  const options = vm.$options;
  const parent = options.parent;
  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;
  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = null;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}
export function callHook(vm: Component, hook: Hook) {
  console.log(vm, hook);
}

export function lifecycleMixin(Vue: typeof Component) {
  console.log(Vue);
}

