import { ShapeFlags } from '../shared/ShapeFlags';

export function initSlots(instance, children) {
  console.log('initSlots instance = ', instance);
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}
function normalizeObjectSlots(children: any, slots: any) {
  for (let key in children) {
    let slot = children[key];
    slots[key] = (props) => normalizeSlotsValue(slot(props));
  }
}
function normalizeSlotsValue(slot) {
  return Array.isArray(slot) ? slot : [slot];
}
