import { ShapeFlags } from '../shared/ShapeFlags';
export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  };
  if (typeof vnode.children === 'string') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(vnode.children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  normalizeChildren(vnode, children);
  return vnode;
}
export function createTextVNode(text) {
  return createVNode(Text, {}, text);
}
function getShapeFlag(type: any) {
  // type -> string ： 元素
  // type -> object : 说明 是一个组件对象
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}
function normalizeChildren(vnode, children) {
  if (typeof children === 'object') {
    if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
    } else {
      // 渲染组件类型，那么children只能是插槽的形式插进来
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
    }
  }
}
