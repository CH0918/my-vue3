import { targetMap } from './reactive';
let activeEffect;
export class ReactiveEffect {
  private _fn;
  constructor(fn) {
    this._fn = fn;
    this.run();
  }
  run() {
    // 执行effect的fn同时，把当前的effect实例抛出去
    activeEffect = this;
    this._fn();
  }
}
export function effect(fn) {
  const __effect = new ReactiveEffect(fn);
}
// 收集依赖
export function track(target, key) {
  // targetMap -> key: target, value: deps
  // depsMap -> key: key, value: dep
  // dep: effect set
  // {obj: {key: }}
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    deps.add(activeEffect);
    depsMap.set(key, deps);
  }
  deps.add(activeEffect);
}
// 触发依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(key);
  deps.forEach((dep) => {
    console.log('dep running...', dep);
    dep.run();
  });
}
