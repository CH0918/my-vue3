import { isObject } from '../../shared';
import { createDep } from './dep';
import { isTracking, trackEffect, triggerEffect } from './effect';
import { reactive } from './reactive';
class RefImpl {
  private _value;
  // dep = new Set();
  dep = createDep();
  __v_isRef_ = true;
  constructor(value) {
    this._value = convert(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (!hasChange(this.value, newValue)) return;
    this._value = convert(newValue);
    triggerEffect(this.dep);
  }
}
function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}
export function hasChange(value, newValue) {
  return !Object.is(value, newValue);
}
export function ref(value) {
  return new RefImpl(value);
}
export function isRef(value) {
  return !!value.__v_isRef_;
}
export function unRef(value) {
  return isRef(value) ? value.value : value;
}
const shallowUnwrapHandlers = {
  get(target, key) {
    return unRef(Reflect.get(target, key));
  },
  set(target, key, value) {
    // 1.old -> ref; new -> !ref 需要.value再赋值
    // 2.old -> ref; new -> ref
    // 3.old -> !ref; new -> ref
    // 4.old -> !ref; new -> !ref
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value);
    } else {
      return Reflect.set(target, key, value);
    }
  },
};
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
