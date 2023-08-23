
/**
 * 收集依赖，添加观察者（watcher）,并通知所有观察者
 */
class Dep {
  static target = null; // null | Watcher
  constructor() {
    // 存储所有观察者
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  // 发送通知 
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}

export default Dep;