/*
  a-zA-Z: 匹配所有小写和大写字母。
  \u00B7: 匹配Unicode编码为\u00B7的中间点（·）。
  \u00C0-\u00D6: 匹配Unicode编码范围在\u00C0到\u00D6之间的字符。
  \u00D8-\u00F6: 匹配Unicode编码范围在\u00D8到\u00F6之间的字符。
  \u00F8-\u037D: 匹配Unicode编码范围在\u00F8到\u037D之间的字符。
  \u037F-\u1FFF: 匹配Unicode编码范围在\u037F到\u1FFF之间的字符。
  \u200C-\u200D: 匹配Unicode编码范围在\u200C到\u200D之间的字符。
  \u203F-\u2040: 匹配Unicode编码范围在\u203F到\u2040之间的字符。
  \u2070-\u218F: 匹配Unicode编码范围在\u2070到\u218F之间的字符。
  \u2C00-\u2FEF: 匹配Unicode编码范围在\u2C00到\u2FEF之间的字符。
  \u3001-\uD7FF: 匹配Unicode编码范围在\u3001到\uD7FF之间的字符。
  \uF900-\uFDCF: 匹配Unicode编码范围在\uF900到\uFDCF之间的字符。
  \uFDF0-\uFFFD: 匹配Unicode编码范围在\uFDF0到\uFFFD之间的字符。
*/
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;


export const def = (target: Record<string, any>, sourKey: string, value: any, enumerable?: boolean) => {
  return Object.defineProperty(target, sourKey, {
    configurable: true,
    enumerable: !!enumerable, // 默认不可枚举
    writable: true,
    value,
  });
};

export const hasProto = '__proto__' in {};
/**
 * @description 解析字符串路径
 * 
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);
type ObjectWithNestedProperties = Record<string, any>
// parsePath<T extends object>(path: string)
export const parsePath = <T extends ObjectWithNestedProperties>(path: string) => {
  if(!bailRE.test(path)) {
    const segments = path.split('.');
    return (obj: T): T => {
      segments.forEach(item => {
        if(obj) {
          obj = obj[item];
        }
      });
      return obj;
    };
  }
}; 

/**
 * @description 删除数组中指定的地址
 */
export const remove = (arr: any[], item: any) => {
  if(arr.length) {
    const index = arr.indexOf(item);
    if(index > -1) {
      return arr.splice(index, 1);
    }
  }
};

/**
 * @description 判断该对象是否有这个属性
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (obj: Record<string, any>, key: string) => {
  return hasOwnProperty.call(obj, key);
};

/**
 * @description 逗号分隔，映射
 */
export const makeMap = (str: string, expectsLowerCase?: boolean): (key: string) => true | void  => {
  const map = Object.create(null);
  str.split(',').forEach(key => { map[key] = true; });
  return expectsLowerCase ? val => map[val.toLowerCase()] : val =>  map[val];
};


