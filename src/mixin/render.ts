import { Component } from '@/type/component';

export function initRender(vm: Component) {
  // vm.vnode = null;
  // vm._staticTrees = null;
  // const options = vm.$options;
  // const parentVnode = vm.$vnode = options._parentVnode;
  // const renderContext = parentVnode && parentVnode.renderContext;
  // vm.$scopedSlots = {};
  // vm._c = (a, b, c, d) => createElement(vm, a, b, c , d, false);
  // vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);

  // const parentData = parentVnode && parentVnode.parentData;
  // defineReactive(vm, '$attrs', parentData && parentData.attrs || {}, null, true)
  // defineReactive(vm, '$listeners', parentData && parentData.attrs || {}, null, true)
}

export function renderMixin(Vue: typeof Component) {
  console.log(Vue);
}