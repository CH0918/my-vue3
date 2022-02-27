import { track, trigger } from './effect';
import {
  isReactive,
  isReadonly,
  readonly,
  reactive,
  ReactiveFlags,
  isProxy,
} from './reactive';
import { isObject } from '../../shared';
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
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
export const shallowReadonlyHandlers = Object.assign({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
export function createGetter(isReadonly = false, isShallowReadonly = false) {
  return function get(target, key) {
    // 兼容isReactive方法
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);
    if (isShallowReadonly) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    // 收集依赖
    track(target, key);
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
