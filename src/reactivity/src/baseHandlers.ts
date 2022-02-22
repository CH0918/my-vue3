import { track, trigger } from './effect';
import { isReactive, reactive, ReactiveFlags } from './reactive';
import { isObject } from '../../shared';
const get = createGetter();
const set = createSetter();
export const mutableHandlers = {
  get,
  set,
};
export function createGetter(isReadOnly = false) {
  return function get(target, key) {
    // 兼容isReactive方法
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadOnly;
    }
    const res = Reflect.get(target, key);
    // 收集依赖
    track(target, key);
    if (isObject(res)) {
      return reactive(res);
    }
    return res;
  };
}
export function createSetter() {
  return function set(target, key, value) {
    let res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}
