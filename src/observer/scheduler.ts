/**
 * 调度程序文件
 */

import type Watcher from './watcher';

const queue: Watcher[] = [];
let index = 0;
// 保证同一个 Watcher 只添加一次
const has: Record<number, true | null> = {};
// flushing代表当前Watcher对列是不是正在执行
let flushing = false;
// 为了保证当前只执行一次flushSchedulerQueue逻辑
let waiting = false;

function resetSchedulerState() {
  index = queue.length = 0;
  waiting = flushing = false;
}

function flushSchedulerQueue () {
  flushing = true;
  let watcher, id;
  // 刷新前对队列进行排序。
  // 这样可以确保：
  //  1. 组件从父级更新到子级。（因为父项总是在子项之前创建）
  //  2. 组件的用户观察程序在其渲染观察程序之前运行（因为用户观察程序是在渲染观察程序前创建的）
  //  3. 如果某个组件在父组件的观察程序运行过程中被销毁，则可以跳过其观察程序。
  queue.sort((a, b) => a.id - b.id);
  // 不要缓存长度，因为当我们运行现有的观察程序时，可能会推送更多的观察程序
  for(index = 0; index < queue.length; index++) {
    watcher = queue[index];
    // watcher.before?.();
    id = watcher.id;
    has[id] = null;
    watcher.run();
  }
  // 在重置状态之前保留投递队列的副本
  // const activatedQueue = activatedChildren.slice();
  // const updatedQueue = queue.slice();
  resetSchedulerState();

  // 调用组件更新并激活钩子
  // callActivatedHooks(activatedQueue);
  // callUpdatedHooks(updatedQueue);
}
/**
 * 将观察程序推入观察程序队列,  ID重复的作业将被跳过，除非在刷新队列时推送。
 * @param watcher
 */
export const queueWatcher = (watcher: Watcher) => {
  const id = watcher.id;
  if(has[id] === null) {
    has[id] = true;
    if(!flushing) {
      // 加入队列
      queue.push(watcher);
    } else {
      let i = queue.length - 1;
      while(i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    if(!waiting) {
      waiting = true;
      // nextTick(flushSchedulerQueue);
    }
  }
};