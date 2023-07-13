import { isObject } from './shared/util';
import { initMixin } from './mixin/init';
import { stateMixin } from './mixin/state';
import { renderMixin } from './mixin/render';
import { eventsMixin } from './mixin/event';
import { lifecycleMixin } from './mixin/lifecycle';
import { ComponentOptions } from './type/component';

// 追踪到Vue.js的整个加载和初始化过程
export class Vue {
  static options: Record<string, unknown> = {};
  _isVue: boolean = true;
  __v_skip: boolean = true;
  _uid: number = 0;
  _self?: Vue;
  $options = { };
  $parent?: Vue;
  $root?: Vue;
  $children?: Vue[];
  $refs?: any;
  _watcher?: any;
  _inactive?: any;
  _directInactive?: any;
  _isMounted?: any;
  _isDestroyed?: any;
  _isBeingDestroyed?: any;

  _init: (options: ComponentOptions) => void = () => {};
  $mount: (el: string) => void = () => {};

  constructor(options: ComponentOptions) {
    if(options && isObject(options)){
      // Vue源码处理："noImplicitThis": false 来禁用隐式 any 类型的警告。
      this._init(options);
    } else {
      throw new Error('Options 传递对象');
    }
  }
}

//  初始化：原型添加 _init方法
// _init 初始化值，事件，render,inject,state,provide, 挂载
initMixin(Vue);
// 数据处理：原型添加$data、$props、$watch、$set、$delete
stateMixin(Vue);
// 事件处理：原型添加$on、$once、$off、$emit
eventsMixin(Vue);
// 生命周期处理：原型添加_update、$forceUpdate、$destroy
lifecycleMixin(Vue);
// render处理: 原型添加 $nextTick、_render
renderMixin(Vue);


