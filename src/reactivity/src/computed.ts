import { ReactiveEffect } from './effect';

class ComputedRefImpl {
  private _getter: Function;
  private _value: any;
  private _dirty: boolean = true;
  private _effect: ReactiveEffect;
  constructor(getter) {
    this._getter = getter;
    // 将依赖收集起来
    this._effect = new ReactiveEffect(this._getter, () => {
      // scheduller 的作用是当下次触发依赖时执行此函数，而不执行传进来的getter函数
      if (!this._dirty) {
        // 这里更改_dirty的目的是当响应式对象的值发生改变时，更改_dirty为true,达到重新执行getter函数的目的
        this._dirty = true;
      }
    });
  }
  get value() {
    // _dirty控制多次访问值的时候只执行一次getter函数
    if (this._dirty) {
      // this._value = this._getter();
      // 用依赖来控制执行getter的执行
      this._value = this._effect.run();
      this._dirty = false;
    }
    return this._value;
  }
}
export function computed(getter) {
  return new ComputedRefImpl(getter);
}
