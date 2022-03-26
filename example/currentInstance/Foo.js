import { h, renderSlots, getCurrentInstance } from '../../lib/my-vue.esm.js';
export const Foo = {
  naem: 'Foo',
  setup(props, { emit }) {
    console.log('foo instance = ', getCurrentInstance());
    return {};
  },
  render() {
    const foo = h('p', {}, 'Foo');
    return h('div', {}, [foo]);
  },
};
