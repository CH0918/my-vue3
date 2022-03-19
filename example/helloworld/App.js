import { h } from './../../lib/my-vue.esm.js';
import { Foo } from './Foo.js';
window.self = null;
export default {
  render() {
    window.self = this;
    // return h(
    //   'div',
    //   {
    //     id: 'root',
    //     class: ['red', 'blue'],
    //     onClick: () => {
    //       console.log('click');
    //     },
    //     onMouseenter: () => {
    //       console.log('onMouseenter');
    //     },
    //   },
    //   'msg: ' + this.msg
    // );
    return h('div', { id: 'root', class: ['red', 'blue'] }, [
      h('div', { class: 'yellow' }, 'this is yellow' + this.msg),
      // h('p', { class: 'green' }, 'this is p'),
      h(Foo, { count: 1 }),
    ]);
  },
  setup() {
    return {
      msg: 'hello vue',
    };
  },
};
