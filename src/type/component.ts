export interface Options {
  _isComponent?: unknown // any
}

export type Hook = 'beforeCreate' | 'created' | 'beforeMount' | 'mounted' | 'beforeUpdate' | 'updated' | 'beforeDestroy' | 'destroyed'


export declare class Component {
  static options: Record<string, unknown> = {};
  constructor(options?: ComponentOptions);
  // a flag to avoid this being observed 
  // 避免出现这种的观察
  _isVue: boolean;
  // 
  __v_skip: boolean;
  // expose real self 本身-> 真实的自己
  _self?:  this; // Component;
  // uuid
  _uid: number;

  $options: {
    el?: string
    parent?: Component
  };
  $parent?: Component;
  $root?: Component;
  $children?: Component[];
  $refs?: any;
  _watcher?: any;
  _inactive?: any;
  _directInactive?: any;
  _isMounted?: any;
  _isDestroyed?: any;
  _isBeingDestroyed?: any;
  _init(options: ComponentOptions): void;
  $mount(el: string): void
  
  //定义Component对象的属性和方法，根据您的具体实现添加适当的类型
}

export interface ComponentOptions extends Record<string, unknown>{
  // _Components?: unknown
}

// 内部组件选项
export interface InternalComponentOptions {

}

export interface PropOptions {

}