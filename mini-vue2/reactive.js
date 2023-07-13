
/* eslint-disable */
import { Dep } from "./dep"
export class Observer {
  constructor(value) {
    this.value = value
    if(typeof value === 'object') {
      if(Array.isArray(value)) {
        // 调用数组
      } else {
        this.walk(value)
      }
    } else {
      defineReactive(value)
    }
  }
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
  // 数组数据响应化
}

export function observe(obj) {
  if(typeof obj !== 'object' || obj === null) return 
  // Object
  new Observer(obj)
}

export function defineReactive(obj, key, val) {
  observe(obj)
  // 创建一个Dep 和当前key一一对应
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      return val;
    },
    set(newVal) {
      if(newVal !== val) {
        // 如果赋值的依然是对象，也要进行便利
        observe(newVal)

        val = newVal;
        // 数据变更，执行视图更新函数
        dep.notify()
      }
    }
  });
}

export function set(obj, key, value) {
  defineReactive(obj, key, value)
}



