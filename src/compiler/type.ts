export type  ParseHTMLOptionsType = {
  start: (tag: string, attrs: ASTElementAttrs, start: number, end?: number, unary?: boolean) => void
  end: (tag: string, start: number, end: number) => void
  chars: (text: string, start: number, end: number) => void
  comment: (text: string, start: number, end: number) => void
}

// HTML AST类型
export type ASTElementAttrs = { 
  name: string;
  value: any;
  dynamic?: boolean;
  start?: number;
  end?: number 
}[]

export type ASTElement = {
  type: 1, // // 元素节点1， 属性节点2， 文本节点3
  tag: string,
  attrs: ASTElementAttrs,
  // attrsList: ASTElementAttrs
  dynamicAttrs?: ASTElementAttrs
  // attrsMap: Record<string, any>
  // rawAttrsMap: Record<string, ASTElementAttrs>
  // parent?: ASTElement
  start: number,
  end?: number
  // false 双标签，true 单标签
  unary?: boolean

  // 将属性标记为动态 true
  hasBindings?: boolean
}

