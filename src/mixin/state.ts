import { Component } from '@/type/component';


export function initProxy(vm: Component) {
  console.log(vm);
}

export function initInject(vm: Component) {
  console.log(vm);
}

export function initState(vm: Component) {
  console.log(vm);
}

export function initProvide(vm: Component) {
  console.log(vm);
}

// inject proxy 都放到这个里面
export function stateMixin(Vue: typeof Component) {
  console.log(Vue);
}