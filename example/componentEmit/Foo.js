import { h } from '../../lib/my-vue.esm.js';
export const Foo = {
  naem: 'Foo',
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log('foo emit click');
      emit('add', 1, 2);
      emit('add-foo', 'haha');
    };
    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd,
      },
      'emitAdd'
    );

    const foo = h('p', {}, 'Foo' + this.foo);

    return h('div', {}, [foo, btn]);
  },
};
