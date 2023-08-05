import { isObject } from '@/shared/util';
import { Component } from '@/type/component';


export class Observer {
  value: any;
  constructor(value: any) {
    this.value = value;
    if(Array.isArray(value)) {

    } else {
      this.walk(value);
    }
  }
  walk(obj: Record<string, any>) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key);
    });
  }
}

const defineReactive = (obj: Record<string, any>, key: string) => {
  observe(obj[key]);
  const value = obj[key];
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      return value; 
    },
    set(val) {
      if(value !== val) {
        return;
      } else {
        obj[key] = val;
        observe(obj[key]);
      }
    } 
  });
};

export const proxy = (target: Component, sourceKey: string, key: string) => {
  Object.defineProperty(target, key, {
    get() {
      return this[sourceKey][key];
    },
    set(val) {
      this[sourceKey][key] = val;
    }
  });
};

export const observe = (value: any) => {
  if(!isObject(value)) {
    return; 
  }
  new Observer(value);
};