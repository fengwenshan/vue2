

import { remove } from '@/shared/util';
import type Watcher from './watcher';
let uid = 0;
export default class Dep {
  static target?: Watcher;
  id: number;
  subs: Array<Watcher>;
  constructor() {
    this.id = uid++;
    this.subs = [];
  }
  addSub(sub: Watcher) {
    this.subs.push(sub);
  }
  remove(sub: Watcher) {
    remove(this.subs, sub);
  }
  depend() {
    if(Dep.target) {
      Dep.target.addDep(this);
    }
  }
  notify() {
    this.subs.slice().forEach(sub => {
      sub.update();
    });
  }
}

Dep.target = undefined;

const targetStack: (Watcher | undefined)[] = [];

export const pushTarget = (target?: Watcher) =>  {
  targetStack.push(target);
  Dep.target = target;
};

export const popTarget = () => {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
};
