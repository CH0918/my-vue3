import { h } from '../../lib/my-vue.esm.js';

export const Foo = {
  setup(props) {
    console.log('foo props = ', props);
  },
  render() {
    return h('div', {}, 'count = ' + this.count);
  },
};
