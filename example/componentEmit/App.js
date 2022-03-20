import { h } from '../../lib/my-vue.esm.js';
import { Foo } from './Foo.js';

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [
      h('div', {}, 'App'),
      h(Foo, {
        foo: 'bar',
        onAdd: (a, b) => {
          console.log('app add click', a, b);
        },
        onAddFoo: (a) => {
          console.log('app add foo click', a);
        },
      }),
    ]);
  },
};
