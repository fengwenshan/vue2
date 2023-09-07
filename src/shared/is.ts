const _toString = Object.prototype.toString;

export const isFunction = (val: unknown): val is (() => any) => typeof val === 'function';
export const isPlainObject = (val: unknown): val is Record<string, unknown>  => _toString.call(val) === '[object Object]';
export const isObject = (val: unknown): val is  Record<any, any> => val !== null && typeof val === 'object';