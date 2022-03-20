import { toHandleKey } from '../shared';

export function emit(instance, event: string, ...args) {
  console.log('event = ', event);
  const { props } = instance;

  const handleName = toHandleKey(event);
  const handle = props[handleName];
  handle && handle(...args);
}
