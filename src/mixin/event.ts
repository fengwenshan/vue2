import { Component } from '@/type/component';


export function initEvents(vm: Component) {
  vm._event = Object.create(null);
  vm._hasHookEvent = false;
  const listeners = vm.$options._parentListeners;
  if(listeners) {
    // updateComponentListeners(vm, listeners)
  }
  console.log(vm);
}

export function eventsMixin (Vue: typeof Component) {
  console.log(Vue);
}

