/* eslint-disable */
import { observe } from "./reactive";
import Compiler from './compile'
// 方便用户访问$data的数据
function proxy(vm, key) {
  Object.keys(vm[key]).forEach(item => {
    Object.defineProperty(vm, item, {
      get() {
        return vm[key][item]
      },
      set(newVal) {
        vm[key][item] = newVal
      }
    })
  })
}

export default class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    observe(this.$data)
    // 代理 this.$data
    proxy(this, '$data')
    // 创建编译器
    new Compiler(options.el, this)
  }
}

