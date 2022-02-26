import { track, trigger } from './effect';
import {
  isReactive,
  isReadonly,
  readonly,
  reactive,
  ReactiveFlags,
} from './reactive';
import { isObject } from '../../shared';
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
export const mutableHandlers = {
  get,
  set,
};
export const readonlyHandlers = {
  get: readonlyGet,
  set: function (target, key, value) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
};
export function createGetter(isReadOnly = false) {
  return function get(target, key) {
    // 兼容isReactive方法
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadOnly;
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadOnly;
    }
    const res = Reflect.get(target, key);
    if (isReadOnly && isObject(res)) {
      return readonly(res);
    }
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
