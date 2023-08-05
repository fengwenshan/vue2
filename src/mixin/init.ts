import { Component, ComponentOptions } from '@/type/component';
import { initState } from './state';
// import { initEvents } from './event';
// import { initRender } from './render';
// import { callHook, initLifecycle } from './lifecycle';
// import { initInject, initProvide, initState } from './state';


// let _uid = 0;
export function initMixin(Vue: typeof Component) {
  Vue.prototype._init = function(options: ComponentOptions) {
    
    // this._isVue = true;
    // this.__v_skip = true;
    // this._uid = _uid++;
    // this._self = this;
   
    // if(options?._Components) {
    //   // initInternalComponent(vm, options as any)
    // } else {
    //   this.$options = options;
    //   // this.$options = mergeOptions(
    //   //   resolveConstructorOptions(this.constructor as typeof Component),
    //   //   options,
    //   //   this
    //   // ) ;
    //   // this.$options = mergeOptions(
    //   //   resolveConstructorOptions(vm.constructor as any),
    //   //   options || {},
    //   //   vm
    //   // );
    // }
    // initLifecycle(this);
    // initEvents(this);
    // initRender(this);
    // callHook(this, 'beforeCreate');
    // initInject(this);
    initState(this);
    // initProvide(this);
    // callHook(this, 'created');



    if(this.$options.el) {
      this.$mount(this.$options.el);
    }
  };
}



