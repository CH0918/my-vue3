'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(value) {
    return value !== null && typeof value === 'object';
}
function hasOwn(obj, key) {
    return obj.hasOwnProperty(key);
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initProps(instance, props) {
    instance.props = props || {};
}

const targetMap = new WeakMap();
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    let dep = depsMap.get(key);
    triggerEffect(dep);
}
function triggerEffect(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        return true;
    },
};
const shallowReadonlyHandlers = Object.assign({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});
function createGetter(isReadonly = false, isShallowReadonly = false) {
    return function get(target, key) {
        if (key === "__v_isReactive") {
            return !isReadonly;
        }
        if (key === "_v_isReadOnly") {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (isShallowReadonly) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        let res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}

const proxyMap = new WeakMap();
var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags["IS_READONLY"] = "_v_isReadOnly";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(target) {
    return createReactiveObject(target, proxyMap, mutableHandlers);
}
function readonly(target) {
    return createReactiveObject(target, proxyMap, readonlyHandlers);
}
function shallowReadonly(target) {
    return createReactiveObject(target, proxyMap, shallowReadonlyHandlers);
}
function createReactiveObject(target, proxyMap, baseHandlers) {
    let reactiveProxy;
    if (reactiveProxy) {
        reactiveProxy = proxyMap[target];
        return reactiveProxy;
    }
    reactiveProxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, reactiveProxy);
    return reactiveProxy;
}

function createComponentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        proxy: {},
        ctx: {},
        setupState: {},
        props: {},
    };
    instance.ctx = {
        _: instance,
    };
    return instance;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = component;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props));
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlag } = vnode;
    if (shapeFlag & 2) {
        processComponent(vnode, container);
    }
    else if (shapeFlag & 1) {
        processElement(vnode, container);
    }
}
function processComponent(initialVnode, container) {
    mountComponent(initialVnode, container);
}
function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    initialVnode.el = subTree.el;
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { props, children, shapeFlag } = vnode;
    if (shapeFlag & 4) {
        el.textContent = children;
    }
    else if (shapeFlag & 8) {
        mountChildren(vnode, el);
    }
    const isOn = (key) => /^on[A-Z]/.test(key);
    for (const key in props) {
        const val = props[key];
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        }
        else {
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

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (typeof vnode.children === 'string') {
        vnode.shapeFlag |= 4;
    }
    else if (Array.isArray(vnode.children)) {
        vnode.shapeFlag |= 8;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1
        : 2;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            rootContainer = document.querySelector(rootContainer);
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
