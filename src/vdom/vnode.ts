/**
 * 节点描述对象
 */
export default class VNode {
  tag?: string; // 标签名称
  text?: string; // 文本内容，注释内容
  isComment: boolean; // 是否注释
  constructor(tag?: string, text?: string) {
    this.tag = tag;
    this.text = text;
    this.isComment = false;
  }
}

/**
 * 注释节点
 * @param text 注释文本
 * @returns 
 */
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

/**
 * 文本节点
 * @param val 文本内容
 * @returns 
 */
export const createTextVNode = (val: string) => {
  return new VNode(undefined, String(val));
};
