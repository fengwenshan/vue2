import { Component, WatcherOptions, WatchFn } from '@/type/component';
import { isObject } from '@/shared/is';
import { parsePath } from '@/shared/util';
import type Dep from './dep';
import { popTarget, pushTarget } from './dep';
import { queueWatcher } from '@/observer/scheduler';

let uuid = 0;
class Watcher {
  id: number;
  vm: Component;
  // 深度监听对象
  deep: boolean;
  // 是否用户自定义
  user: boolean;
  // 回调函数
  cb: WatchFn;
  // expOrFn转函数
  getter: (obj: any) => any;
  // 读取当前的值
  value: any;
  // dep
  deps: Dep[];
  depIds: Set<number>;
  // 存储dep id
  newDepIds: Set<number>;
  // 存储dep
  newDeps: Dep[];
  constructor(vm: Component, expOrFn: string | (() => any), cb: WatchFn, options: WatcherOptions) {
    this.id = uuid++;
    this.vm = vm;
    this.deps = [];
    this.newDepIds = new Set();
    this.depIds = new Set();
    this.newDeps = [];
    vm._watchers.push(this);
    if(options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
    } else {
      this.deep = this.user  = false;
    }
    this.cb = cb;
    if(typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn) || (() => {});
    }
    this.value = this.get();
  }
  get() {
    pushTarget(this);
    const vm = this.vm;
    const value = this.getter.call(vm, vm);
    popTarget();
    return value;
  }
  addDep(dep: Dep) {
    const id = dep.id;
    if(!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      // 判断以前就有这个
      if(!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }
  update() {
    // queue 队列
    queueWatcher(this);
  }
  run() {
    const value = this.get;
    if(value !== this.value || isObject(value) || this.deep) {
      const oldValue = this.value;
      this.value = value;
      if(this.user) {
        // const info = `callback for watcher "${this.expression}"`
        // invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
  // 取决于此观察程序收集的所有dep。
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }
}

export default Watcher;