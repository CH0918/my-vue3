export function isObject(value) {
  return value !== null && typeof value === 'object';
}
export function hasOwn(obj: Object, key) {
  return obj.hasOwnProperty(key);
}

export const capitalize = (eventName: string) => {
  return eventName
    ? eventName.charAt(0).toUpperCase() + eventName.slice(1)
    : '';
};

const camelize = (eventName: string) => {
  return eventName
    ? eventName.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : '';
      })
    : '';
};
export const toHandleKey = (eventName: string) => {
  return eventName ? 'on' + camelize(capitalize(eventName)) : '';
};
