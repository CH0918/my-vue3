// import { targetMap } from './reactive';

let activeEffect;
export const targetMap = new WeakMap();
export class ReactiveEffect {
  private _fn;
  public scheduler: Function | undefined;
  active = true;
  deps = [];

  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    // active 控制是否收集依赖
    // if (!this.active) {
    //   // 不需要收集依赖，直接返回 执行fn
    //   return this._fn();
    // }
    // 执行effect的fn同时，把当前的effect实例抛出去
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  // 清空所有的依赖
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}
export function effect(fn, options: any = {}) {
  const __effect = new ReactiveEffect(fn, options.scheduler);
  Object.assign(__effect, options);
  __effect.run();
  let runner = __effect.run.bind(__effect);
  (runner as any).effect = __effect;
  return runner;
}
export function stop(runner) {
  runner.effect.stop();
}
// 收集依赖
export function track(target, key) {
  // targetMap -> key: target, value: deps
  // depsMap -> key: key, value: dep
  // dep: effect set
  // [target: [key: [effect, effect]]]
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
  // 反向收集，每个effet持有所有的依赖
  activeEffect.deps.push(dep);
}
// 触发依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
