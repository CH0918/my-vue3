import { h } from './../../lib/my-vue.esm.js';
export default {
  render() {
    // return h('div', { id: 'root', class: ['red', 'blue'] }, 'msg: ' + this.msg);
    return h('div', { id: 'root', class: ['red', 'blue'] }, [
      h('div', { class: 'yellow' }, 'this is yellow'),
      h('p', { class: 'green' }, 'this is p'),
    ]);
  },
  setup() {
    return {
      msg: 'hello vue',
    };
  },
};
