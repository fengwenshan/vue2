import Dep from './dep.js';
const isObject = val => typeof val === 'object';

/**
 * 数据劫持，把data里面的数据添加getter/setter
 * 负责把data选项中的属性转换成响应式的，数据变化发送通知
 * getter 在compiler里面访问的时候，会触发getter, 这时候就会收集依赖
 * setter 数据改变的时候 通知依赖更新，从而更新页面
 */
class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    if(isObject(data)) {
      Object.keys(data).forEach(key => {
        this.defineReactive(data, key, data[key]);
      });
    }
  }
  defineReactive(target, key, value) {
    const _this = this;
    const dep = new Dep();
    // 如果里面还是对象，那么继续执行循环劫持
    this.walk(value);

    Object.defineProperty(target, key, {
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newVal) {
        if(newVal === value) return; 
        // target[key] = newVal 会死循环
        value = newVal;
        // 新赋值的也可能是对象
        _this.walk(newVal);
        dep.notify();
      }
    });
  }
}

export default Observer;