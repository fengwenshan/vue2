import Dep from './dep.js';
/**
 * 当数据变化触发依赖，dep通知所有的Watcher实例视图
 * 自身实例化的时候向dep对象中添加自己
 */
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;
    Dep.target = this;
    // 第二次读取值，设置Dep.target 静态属性，也就是当前属性对应的一个Watcher
    this.oldValue = vm[key];
    Dep.target = null;
  }
  // 当数据发生变化的时候更新视图
  update() {
    let newVal = this.vm[this.key];
    if(this.oldValue === newVal) {
      return; 
    }
    this.cb(newVal);
  }
}

export default Watcher;