export function isObject(value) {
  return value !== null && typeof value === 'object';
}
export function hasOwn(obj: Object, key) {
  return obj.hasOwnProperty(key);
}
