import { isObject, parsePath } from '@/shared/util';
import { Component } from '@/type/component';
import type Dep from './dep';
import { queueWatcher } from './scheduler';

type WatcherParamsOptionsType  = Partial<{
  user: boolean,
  lazy: boolean,
  deep: boolean,
  sync: boolean
  computed: boolean
  before: () => void
}>

let uid = 0;

export default class Watcher {
  vm: Component;
  cb: () => void;
  user: boolean;
  lazy: boolean;
  deep: boolean;
  sync: boolean;
  before?: (vm: Component) => void;
  id: number;

  active: boolean; // 用于标识当前 Watcher 是否处于激活状态。当 Watcher 被创建时，它是激活状态的，表示它已经开始监听数据的变化。当 Watcher 不再需要监听数据变化时，比如组件被销毁或计算属性不再使用时，active 会被设置为 false，Watcher 不再执行更新操作
  dirty: boolean; // 用于标识当前 Watcher 是否是"脏的"。脏的 Watcher 表示它的依赖项已经发生了变化，需要进行更新。在执行更新操作后，dirty 会被设置为 false，表示 Watcher 已经是最新的状态。
  deps: any[]; // 这是 Watcher 的依赖项列表，是一组关联的 Dep 对象。deps 存储着 Watcher 之前所依赖的 Dep 对象集合，newDeps 存储着 Watcher 当前最新的依赖 Dep 对象集合。通过比较 deps 和 newDeps 的变化，Watcher 可以判断自己是否需要进行更新。
  newDeps: any[];
  depIds: Set<any>; // 这是 Watcher 的依赖项 ID 集合。depIds 存储着 Watcher 之前所依赖的 Dep 对象的 ID，newDepIds 存储着 Watcher 当前最新的依赖 Dep 对象的 ID。这些 ID 用于快速判断 Watcher 的依赖项是否发生了变化，从而决定是否进行更新
  newDepIds: Set<any>;
  expression: string; // \用于表示 Watcher 的表达式。对于计算属性等特殊的 Watcher，它的 expression 属性会保存计算属性的表达式字符串，用于在 Watcher 更新时进行处理。

  getter?: ((vm: Component) => Component) | undefined;
  value?: Component; 

  /**
   * @description 它主要用于建立数据与视图之间的联系，并在数据变化时更新视图
   * @param { Component }  vm 当前组件实例的饮用
   * @param { string | Object } expOrFn 获取数据的函数或者表达式，然后建立依赖关系，以便数据放生变化时能够通知相关的视图更新
   * @param { Function } cb expOrFn数据变化时，Watcher实例就会通过这个回调函数通知相关的视图更新，从而保持视图和数据同步
   * @param { object } options 
   * @param { boolean } options.user 代表是否为开发者创建，不是vue内部响应式系统创建。开发者创建的Watcher通常手动跟踪数据变化，并进行一些自定义操作。通常user为true,默认会配合lazy使用，设置为懒执行
   * @param { boolean } options.lazy 用于设置 Watcher 是否是懒执行的。如果设置为 true，则 Watcher 会在第一次访问时不立即执行求值函数，而是等到依赖项发生变化时再执行。
   * @param { boolean } options.deep 用于设置 Watcher 是否深度观察对象内部的变化。如果设置为 true，则 Watcher 会递归观察对象内部所有属性的变化，而不仅仅是顶层属性。
   * @param { boolean } options.sync 用于设置 Watcher 是否同步执行回调函数。如果设置为 true，则 Watcher 的回调函数会同步执行，而不是在下一个事件循环中异步执行。
   * @param { boolean } options.computed 用于标识当前 Watcher 是否是计算属性的 Watcher。计算属性的 Watcher 在依赖项变化时会进行缓存，只有在依赖项发生改变时才会重新求值
   * @param { Function } options.before 回调函数, 用于Watcher求值之前执行。在 Watcher 执行回调函数之前，会先执行 before 回调函数，如果存在的话。这个回调函数可以用于在 Watcher 执行之前进行一些准备工作或副作用操作。
   * @param { boolean} isRenderWatcher 用于标识当前 Watcher 是否是渲染函数的 Watcher。在 Vue.js 中，视图的渲染是通过 Watcher 实现的，isRenderWatcher 用于标识当前 Watcher 是否用于处理视图的渲染。
   */
  constructor(vm: Component, expOrFn: string | ((vm: Component) => Component), cb: () => void, options?: WatcherParamsOptionsType, isRenderWatcher?: boolean) {
    this.vm = vm;
    this.cb = cb;
    if(options) {
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.deep = !!options.deep;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.user = this.lazy = this.deep = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid;
    this.active = true;
    this.dirty = this.lazy;
    this.lazy = !!options?.lazy;
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.expression = '';

    if(typeof expOrFn === 'function') {
      /* this.a + this.b 每次得出一个不同的结果时,处理函数都会被调用。就像监听一个未被定义的计算属性
        this.$watch(() => {
          return this.a + this.b;
        });
      */
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if(this.getter) {
        console.error('访问错误');
      }
    }
    this.value = this.lazy ? undefined : this.get();
  }
  get() {
    const vm = this.vm;
    const value = this.getter?.call(vm, vm);
    // 判断是否深度观察内部变化
    // if(this.deep) {}
    return value;
    // 弹出
    // this.cleanupDeps()
  }
  addDep(dep: Dep) {
    const id = dep.id;
    if(!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if(!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }
  update() {
    if(this.lazy) {
      this.dirty = true;
    } else if(this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }
  run() {
    if(this.active) {
      const value = this.get();
      if((value !== this.value || isObject(value) || this.deep) && this.user) {
        this.value = value;
        // this.cb.call(this.vm, value, this.value);
      }
    }
  }
}