import { track, trigger } from './effect';
import { mutableHandlers } from './baseHandlers';
// export const targetMap = new Map();
export const reactiveMap = new WeakMap();
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}
export function reactive(target) {
  return createReactiveObject(target, reactiveMap, mutableHandlers);
}

export function createReactiveObject(target, reactiveMap, baseHandlers) {
  let reactiveProxy;
  // 缓存proxy对象
  if (reactiveProxy) {
    reactiveProxy = reactiveMap[target];
    return reactiveProxy;
  }
  reactiveProxy = new Proxy(target, baseHandlers);
  reactiveMap.set(target, reactiveProxy);
  return reactiveProxy;
}

export function isReactive(value) {
  // 普通对象没有该属性，返回undefind !!转为fales
  return !!value[ReactiveFlags.IS_REACTIVE];
}
