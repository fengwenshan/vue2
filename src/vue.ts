import { isObject } from "./shared/util";
import { initMixin } from './mixin/init'
import { stateMixin } from './mixin/state'
import { renderMixin } from './mixin/render'
import { eventsMixin } from './mixin/event'
import { lifecycleMixin } from './mixin/lifecycle'
import { Component, Options } from "./type/component";

export function Vue(this: Component, options?: Options) {
  if(options && isObject(options)){
    // Vue源码处理："noImplicitThis": false 来禁用隐式 any 类型的警告。
    this._init(options);
  } else {
    throw new Error('Options 传递对象');
  }
}

// 初始化处理
initMixin(Vue)
// 数据处理
stateMixin(Vue)
// render处理
renderMixin(Vue)
// 事件处理
eventsMixin(Vue)
// 生命周期处理
lifecycleMixin(Vue)

/*

思考： 
  class Vue  {
    constructor() {
      
    }
    _init() {
      
    }
  }

  1. Vue 本身类型怎么写？
  2. new 以后得到的实例是什么？
  3. Vue源码里面为什么传递Vue本身的类型使用typeof Component ？
  4. Vue(this: Component, options?: Options)， 第一个参数我需要传递this吗 ？
  5. 为什么声明Component 需要这样声明 export declare class Component， 去掉declare就会报错, declare作用是什么，见文件type/components.ts

 */

