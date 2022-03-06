import { render } from './render';
import { createVNode } from './vnode';

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      rootContainer = document.querySelector(rootContainer);
      // 根据根组件创建虚拟节点
      // 所有的逻辑操作都是根据虚拟节点来进行
      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
    },
  };
}
