

import { remove } from '@/shared/util';
import type Watcher from './watcher';

let uuid = 0;
// Dep 只进行依赖存储(管理)
class Dep {
  static target?: Watcher | null;   
  id: number;
  subs: Watcher[];
  constructor() {
    this.id = uuid++;
    this.subs = [];
  }
  /**
   * 收集依赖
   */
  addSub(sub: Watcher) {
    this.subs.push(sub);
  }
  /**
   * 删除依赖
   */
  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }
  /**
   * 不知道watcher里面有没有该依赖(Dep)，
   *    没有,就把当前依赖放入Watcher里面观察，并把该Watcher也放入Dep中
   * 就在Watcher.addDep里面把Watcher添加到Dep里面
   */
  depend() {
    Dep.target && Dep.target.addDep(this);
  }
  /**
   * 更新watcher里面的update
   */
  notify() {
    const subs = this.subs.slice();
    subs.forEach(item => { item.update(); });
  }
}

Dep.target = null;
const targetStack: Watcher[] = [];
function pushTarget(target: Watcher) {
  targetStack.push(target);
  Dep.target = target;
}
function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
export default Dep;

export {
  pushTarget,
  popTarget
};