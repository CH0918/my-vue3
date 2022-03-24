import { h } from '../../lib/my-vue.esm.js';
import { Foo } from './Foo.js';
import { createTextVNode } from '../../lib/my-vue.esm.js';

export default {
  name: 'App',
  setup() {},
  render() {
    const foo = h(
      Foo,
      {},
      {
        header: (user) => [
          h('p', {}, 'header' + user.name),
          createTextVNode('hahah'),
        ],
        footer: () => h('p', {}, 'footer'),
      }
    );
    const app = h('div', {}, 'app');
    return h('div', {}, [
      foo,
      app,
      // h(Foo, {}, [h('h1', { id: 'h1' }, 'this is h1')]),
    ]);
  },
};
