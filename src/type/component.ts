
export type BaseType = string | number | boolean
export type PropsBaseType = BaseType | symbol | Date | (() => any) // | Record<string, any>
export type PropsValidatorType = PropsBaseType[]
export type PropsQuoteType = {
  type?: PropsBaseType
  required?: boolean
  default?: PropsBaseType | (() => boolean)
  validator?: (value: any) => boolean
}

export type VmWatch =  ( expOrFn: string | (() => any), cb: WatchFn | WatchObject, options?: WatchOptions) => (() => void);
export type WatchFn = (newVal: any, oldVal: any) => void
export type WatchObject =  { handler: WatchFn } & WatcherOptions
export type WatchOptions = {
  /**
   *  是否立即执行
   */
  immediate?: boolean
  /**
   * 复杂数据类型，是否深度监听
   */
  deep?: boolean
}
export type WatcherOptions = { user?: boolean } & WatchOptions
export type PropsType = Record<string, PropsBaseType | PropsQuoteType | PropsQuoteType>

export type Hook = 'beforeCreate' | 'created' | 'beforeMount' | 'mounted' | 'beforeUpdate' | 'updated' | 'beforeDestroy' | 'destroyed'


export declare class Component {
  constructor(options: Options);
  _init: (options: Options) => void;
  $watch: VmWatch;
  $data: Record<string, any>;
  $options: Options;
  [prop: string]: any
}


export interface Options {
  // _isComponent?: unknown // any
  data: (() => Record<string, any>) | Record<string, any>
}



// 内部组件选项
export interface InternalComponentOptions {

}

export interface PropOptions {  }

