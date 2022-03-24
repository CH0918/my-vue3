import { h } from '../../lib/my-vue.esm.js';
import { Foo } from './Foo.js';

export default {
  name: 'App',
  setup() {},
  render() {
    const foo = h(
      Foo,
      {},
      {
        header: (user) => h('p', {}, 'header' + user.name),
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
