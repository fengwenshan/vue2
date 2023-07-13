/* eslint-disable */
/*
defineReactive 时为每个key创建一个Dep实例
初始化视图时读取某个key，例如name1, 创建一个watcher1
由于触发name1的getter方法，便将watcher1天假到name1对应的Dep中
当name1更新，setter触发时，便可通过对应的Dep中
当name1更新，setter触发时，便可通过对应的Dep通知其管理所有Watcher更新
*/

export class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn
    Dep.target = this
    this.vm[this.key] // 读取触发getter
    Dep.target = null // 收集完，立即置空
  }
  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

export class Dep {
  constructor() {
    this.deps = []
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}