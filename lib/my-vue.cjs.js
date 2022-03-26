'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(value) {
    return value !== null && typeof value === 'object';
}
function hasOwn(obj, key) {
    return obj.hasOwnProperty(key);
}
const capitalize = (eventName) => {
    return eventName
        ? eventName.charAt(0).toUpperCase() + eventName.slice(1)
        : '';
};
const camelize = (eventName) => {
    return eventName
        ? eventName.replace(/-(\w)/g, (_, c) => {
            return c ? c.toUpperCase() : '';
        })
        : '';
};
const toHandleKey = (eventName) => {
    return eventName ? 'on' + camelize(capitalize(eventName)) : '';
};

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
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

function emit(instance, event, ...args) {
    console.log('instance ==== ', instance);
    const { props } = instance;
    const handleName = toHandleKey(event);
    const handle = props[handleName];
    handle && handle(...args);
}

function initSlots(instance, children) {
    console.log('initSlots instance = ', instance);
    const { vnode } = instance;
    if (vnode.shapeFlag & 16) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    for (let key in children) {
        let slot = children[key];
        slots[key] = (props) => normalizeSlotsValue(slot(props));
    }
}
function normalizeSlotsValue(slot) {
    return Array.isArray(slot) ? slot : [slot];
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        proxy: {},
        ctx: {},
        setupState: {},
        props: {},
        slots: {},
        emit: () => { },
    };
    component.emit = emit;
    component.ctx = {
        _: component,
    };
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
let currentInstance = null;
function setupStatefulComponent(instance) {
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = component;
    if (setup) {
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit.bind(null, instance),
        });
        setCurrentInstance(null);
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
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
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
    normalizeChildren(vnode, children);
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === 'string'
        ? 1
        : 2;
}
function normalizeChildren(vnode, children) {
    if (typeof children === 'object') {
        if (vnode.shapeFlag & 1) ;
        else {
            vnode.shapeFlag |= 16;
        }
    }
}

function render(vnode, container) {
    console.log('render...', vnode);
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlag, type } = vnode;
    switch (type) {
        case Fragment:
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlag & 2) {
                console.log('处理组件 vnode', vnode);
                processComponent(vnode, container);
            }
            else if (shapeFlag & 1) {
                processElement(vnode, container);
            }
            break;
    }
}
function processFragment(vnode, container) {
    mountChildren(vnode, container);
}
function processText(vnode, container) {
    const { children } = vnode;
    const textContent = (vnode.el = document.createTextNode(children));
    container.append(textContent);
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

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        return createVNode(Fragment, {}, slot(props));
    }
}

exports.createApp = createApp;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.renderSlots = renderSlots;
