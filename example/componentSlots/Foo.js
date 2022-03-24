import { h, renderSlots } from '../../lib/my-vue.esm.js';
export const Foo = {
  naem: 'Foo',
  setup(props, { emit }) {
    return {};
  },
  render() {
    const foo = h('p', {}, 'Foo');
    // 获取到vnode children节点
    console.log('slots = ', this.$slots);
    // 具名插槽
    // return h('div', {}, [
    //   renderSlots(this.$slots, 'header', ),
    //   foo,
    //   renderSlots(this.$slots, 'footer'),
    // ]);

    // 作用域插槽 子组件中插槽的值传递给父组件
    const age = { name: '张三' };
    return h('div', {}, [
      renderSlots(this.$slots, 'header', age),
      foo,
      renderSlots(this.$slots, 'footer'),
    ]);
  },
};
