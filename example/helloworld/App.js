import { h } from './../../lib/my-vue.esm.js';
export default {
  render() {
    return h('div', 'msg: ' + this.msg);
  },
  setup() {
    return {
      msg: 'hello vue',
    };
  },
};
