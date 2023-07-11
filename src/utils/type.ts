const _toString = Object.prototype.toString;

export const isObject = (val: unknown): val is Record<string, unknown>  => _toString.call(val) === '[object Object]';