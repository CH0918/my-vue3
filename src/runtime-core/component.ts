export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  };
  return component;
}

export function setupComponent(instance) {
  // todo
  // initProps();
  // initSlots();
  // 初始化有状态的组件，相对于无状态的函数组件来说的
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  const component = instance.type;

  const { setup } = component;

  if (setup) {
    // setupResult -> function: render函数，Object
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // setupResult 是Object的情况   todo function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  // instance.type -> App 组件
  const component = instance.type;
  // 把render函数挂到组件实例上
  if (component.render) {
    instance.render = component.render;
  }
}
