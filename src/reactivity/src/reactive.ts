export function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      return Reflect.set(target, key, value);
    },
  });
}
