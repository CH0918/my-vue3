import { h, getCurrentInstance } from '../../lib/my-vue.esm.js';
import { Foo } from './Foo.js';
export default {
  name: 'App',
  setup() {
    console.log('app instance = ', getCurrentInstance());
  },
  render() {
    const app = h('div', {}, 'app');
    const foo = h(Foo, {}, 'foo');
    return h('div', {}, [app, foo]);
  },
};
