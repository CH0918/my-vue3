import { isObject } from '../../shared';
import { isTracking, trackEffect, triggerEffect } from './effect';
import { reactive } from './reactive';
class RefImpl {
  private _value;
  dep = new Set();
  constructor(value) {
    this._value = isObject(value) ? reactive(value) : value;
  }
  get value() {
    if (isTracking()) {
      trackEffect(this.dep);
    }
    return this._value;
  }
  set value(newValue) {
    if (!hasChange(this.value, newValue)) return;
    this._value = isObject(newValue) ? reactive(newValue) : newValue;
    triggerEffect(this.dep);
  }
}
export function hasChange(value, newValue) {
  return !Object.is(value, newValue);
}
export function ref(value) {
  return new RefImpl(value);
}
