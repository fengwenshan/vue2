import { ComponentOptions } from "./options"

export interface Options {
  _isComponent: unknown // any
}

export type Hook = 'beforeCreate' | 'created' | 'beforeMount' | 'mounted' | 'beforeUpdate' | 'updated' | 'beforeDestroy' | 'destroyed'

export declare class Component {
  constructor(options: ComponentOptions)
  _init(options: ComponentOptions): void
}