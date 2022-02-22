import { track, trigger } from './effect';
export const targetMap = new Map();
export function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // 收集依赖
      track(target, key);
      return res;
    },
    set(target, key, value) {
      let res = Reflect.set(target, key, value);
      trigger(target, key);
      return res;
    },
  });
}
