import { mutableHandlers, readonlyHandlers } from './baseHandlers';
// export const targetMap = new Map();
export const proxyMap = new WeakMap();
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '_v_isReadOnly',
}
export function reactive(target) {
  return createReactiveObject(target, proxyMap, mutableHandlers);
}
export function readonly(target) {
  return createReactiveObject(target, proxyMap, readonlyHandlers);
}
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}
export function isProxy(value) {
  return isReadonly(value) || isReactive(value);
}

export function createReactiveObject(target, proxyMap, baseHandlers) {
  let reactiveProxy;
  // 缓存proxy对象
  if (reactiveProxy) {
    reactiveProxy = proxyMap[target];
    return reactiveProxy;
  }
  reactiveProxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, reactiveProxy);
  return reactiveProxy;
}

export function isReactive(value) {
  // 普通对象没有该属性，返回undefind !!转为fales
  return !!value[ReactiveFlags.IS_REACTIVE];
}
