import { toHandleKey } from '../shared';

export function emit(instance, event: string, ...args) {
  console.log('instance ==== ', instance);
  const { props } = instance;

  const handleName = toHandleKey(event);
  const handle = props[handleName];
  handle && handle(...args);
}
