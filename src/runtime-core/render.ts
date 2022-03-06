import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  // 处理组件类型
  processComponent(vnode, container);
  // todo 处理element类型
}
function processComponent(vnode: any, container: any) {
  // 挂载节点
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
  // 创建组件实例对象 vnode->是对dom进行抽象，组件可能有很多其他的属性，例如props，slot等 所以需要创建一个实例对象来承载
  const instance = createComponentInstance(vnode);

  setupComponent(instance);

  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container) {
  // subTree -> 虚拟节点树 vnode
  const subTree = instance.render();

  // vnode -> element -> mountElement
  patch(subTree, container);
}
