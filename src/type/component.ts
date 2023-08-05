export interface Options {
  _isComponent?: unknown // any
}
export type BaseType = string | number | boolean
export type PropsBaseType = BaseType | symbol | Date | (() => any) // | Record<string, any> 
export type PropsValidatorType = PropsBaseType[]
export type PropsQuoteType = {
  type?: PropsBaseType
  required?: boolean
  default?: PropsBaseType | (() => boolean)
  validator?: (value: any) => boolean
}

export type PropsType = Record<string, PropsBaseType | PropsQuoteType | PropsQuoteType>

export type Hook = 'beforeCreate' | 'created' | 'beforeMount' | 'mounted' | 'beforeUpdate' | 'updated' | 'beforeDestroy' | 'destroyed'


export declare class Component {
  // static options: Record<string, unknown> = {};
  constructor(options?: ComponentOptions);
  $options: ComponentOptions;
  _data: Record<any, any>;
  // // a flag to avoid this being observed 
  // // 避免出现这种的观察
  // _isVue: boolean;
  // // 
  // __v_skip: boolean;
  // // expose real self 本身-> 真实的自己
  // _self?:  this; // Component;
  // // uuid
  // _uid: number;

  // // $options: {
  // //   el?: string
  // //   parent?: Component
  // //   _propKeys?: string[]
  // // } & ComponentOptions;
  // $parent?: Component;
  // $root?: Component;
  // $children?: Component[];
  // $refs?: any;
  // _watcher?: any;
  // _inactive?: any;
  // _directInactive?: any;
  // _isMounted?: any;
  // _isDestroyed?: any;
  // _isBeingDestroyed?: any;
  _init(options: ComponentOptions): void;
  $mount(el: string): void
  
  //定义Component对象的属性和方法，根据您的具体实现添加适当的类型
}


// type DataFunction<T extends Record<any, any>> = () => T;
export interface ComponentOptions extends Record<string, unknown> {
  // props: PropsType
  // _Components?: unknown
  data: Record<any, any> |  ((this: any) => Record<any, any>) // DataFunction<Record<any, any>>//(() => Record<any, any>)
  
}



// 内部组件选项
export interface InternalComponentOptions {

}

export interface PropOptions {

}

