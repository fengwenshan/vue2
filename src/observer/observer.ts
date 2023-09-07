import { isObject } from '@/shared/is';
import { hasOwn, def } from '@/shared/util';
import { Component } from '@/type/component';



const arrayProto: Record<string, any> = Array.prototype;
const arrayMethods  = Object.create(arrayProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  
  const original = arrayProto[method];
  // 这里的this是 Object.create(arrayProto);
  def(arrayMethods, method, function (...args: any[]) {
    // original 什么方法触发，就是什么方法，比如 arr.push(5), 那么original就是push方法
    // this就是当前对象，比如arr.push(5), 那么this就是arr，
    // result执行该数组方法返回的参数 push 返回的参数

    // 调用原型链上的方法，然后执行自己的逻辑
    const result = original.apply(this, args);
    const ob = this.__ob__;
    // 防止用户push 对象进去
    let inserted;
    switch(method) {
    case 'push':
    case 'unshift': 
      inserted = args; // 对添加的数据进行响应式
      break;
    case 'splice':
      // 参数1：开始位置， 参数2删除熟练， 参数3+添加数据
      inserted = args.slice(2);
    }
    if (inserted) ob.observeArray(inserted);
    // 通知更新
    // ob.dep.notify();
    return result;
  });
});


export class Observer {
  value: Record<string, any> | any[];
  // 标记响应式属性
  
  constructor(value: any) {
    this.value = value;
    // 设置ob不可枚举，这样Object.keys就循环不了
    def(value, '__ob__', this);
    if(Array.isArray(value)) {
      // value.__proto__ = arrayMethods;
      Object.setPrototypeOf(value, arrayMethods);
    } else {
      this.walk(value);
    }
  }
  walk(obj: Record<string, any>) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key);
    });
  }
  observeArray (items: any[]) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

/**
 * 读取数据收集并监听（watcher），设置数据通知更新(Dep)
 * @param obj 
 * @param key 
 */
const defineReactive = (obj: Record<string, any>, key: string) => {
  observe(obj[key]);
  const value = obj[key];
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 读取数据，时候进行收集
      // if(Dep.target) {
      //   // 读取模板的数据，这时候Dep.target = Watcher
      //   dep.depend()
      // }
      return value; 
    },
    set(val) {
      if(value !== val) {
        return;
      } else {
        // 如果是对象，继续劫持
        observe(obj[key]);
        obj[key] = val;
      }
    } 
  });
};

export const observe = (value: any) => {
  if(!isObject(value)) {
    return; 
  }
  let ob: Observer; // 响应式标记
  if(hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
};

export const proxy = (target: Component, sourceKey: string, key: string) => {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key];
    },
    set(val) {
      target[sourceKey][key] = val;
    }
  });
};