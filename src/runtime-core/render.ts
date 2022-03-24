import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  console.log('render...', vnode);
  patch(vnode, container);
}
function patch(vnode, container) {
  // 处理组件类型
  const { shapeFlag } = vnode;
  // 通过位运算符来控制
  // 组件类型 ： 0010
  // 元素类型 ： 0001
  if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    console.log('处理组件 vnode', vnode);
    processComponent(vnode, container);
  } else if (shapeFlag & ShapeFlags.ELEMENT) {
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
  const { props, children, shapeFlag } = vnode;
  // children 可能是string 也可能是array

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }
  // 处理props
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  for (const key in props) {
    const val = props[key];

    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }
  container.append(el);
}
function mountChildren(vnode, container) {
  vnode.children.forEach((vnode) => {
    patch(vnode, container);
  });
}
