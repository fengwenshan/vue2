// 调度程序文件

import type Watcher from './watcher';

const has: Partial<Record<string, true>> = {};
export const queueWatcher = (watcher: Watcher) => {
  const id = watcher.id;
  if(has[id] === null) {
    
  }
};