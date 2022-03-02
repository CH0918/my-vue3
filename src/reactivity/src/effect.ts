// import { targetMap } from './reactive';

let activeEffect;
let shouldTrack = false;
export const targetMap = new WeakMap();
export class ReactiveEffect {
  private _fn;
  // public scheduler: Function | undefined;
  active = true;
  deps = [];
  public onStop?: () => void;

  constructor(fn) {
    this._fn = fn;
    // this.scheduler = scheduler;
  }
  run() {
    // 触发effect中的fn，将收集依赖开关打开
    shouldTrack = true;
    // 执行effect的fn同时，把当前的effect实例抛出去
    activeEffect = this;
    const result = this._fn();

    // 执行完fn 意味着依赖已收集完毕，重置状态
    shouldTrack = false;
    activeEffect = undefined;
    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
    if (this.onStop) {
      this.onStop();
    }
  }
}
// 清除依赖
function cleanupEffect(effect) {
  // 清空所有的依赖
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}
export function effect(fn, options: any = {}) {
  const __effect = new ReactiveEffect(fn);
  Object.assign(__effect, options);
  __effect.run();
  let runner: any = __effect.run.bind(__effect);
  runner.effect = __effect;
  return runner;
}
export function stop(runner) {
  runner.effect.stop();
}
// 收集依赖
export function track(target, key) {
  if (!isTracking()) return;
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
  trackEffect(dep);
}
export function trackEffect(dep) {
  dep.add(activeEffect);
  // 反向收集，每个effet持有所有的依赖
  activeEffect.deps.push(dep);
}
// 触发依赖
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffect(dep);
}
export function triggerEffect(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
