import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  // 处理组件类型
  if (typeof vnode.type === 'object') {
    processComponent(vnode, container);
  } else if (typeof vnode.type === 'string') {
    processElement(vnode, container);
  }
}

// 处理组件
function processComponent(initialVnode: any, container: any) {
  // 挂载节点
  mountComponent(initialVnode, container);
}
function mountComponent(initialVnode: any, container) {
  // 创建组件实例对象 vnode->是对dom进行抽象，组件可能有很多其他的属性，例如props，slot等 所以需要创建一个实例对象来承载
  const instance = createComponentInstance(initialVnode);

  setupComponent(instance);

  setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance: any, initialVnode, container) {
  // const proxyInstance = new Proxy(instance.ctx, componentPublicInstance);
  const { proxy } = instance;
  // subTree -> 虚拟节点树 vnode
  const subTree = instance.render.call(proxy);
  // vnode -> element -> mountElement
  patch(subTree, container);
  // 所有element都mount 完毕后 把el挂载到组件的虚拟节点上
  initialVnode.el = subTree.el;
}

// 处理元素节点
function processElement(vnode: any, container: any) {
  // 挂载元素节点
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  // vnode -> {type: 'div', props: 'hi xxxxx', children: undefined}
  const el = (vnode.el = document.createElement(vnode.type));
  const { props, children } = vnode;
  // children 可能是string 也可能是array
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}
function mountChildren(vnode, container) {
  vnode.children.forEach((vnode) => {
    patch(vnode, container);
  });
}
