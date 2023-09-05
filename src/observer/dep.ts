

import { remove } from '@/shared/util';
import type Watcher from './watcher';

let uuid = 0;
class Dep {
  static target?: Watcher | null;
  id: number;
  subs: Watcher[];
  constructor() {
    this.id = uuid++;
    this.subs = [];
  }
  addSub(sub: Watcher) {
    this.subs.push(sub);
  }
  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }
  depend() {
    Dep.target && Dep.target.addDep(this);
  }
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