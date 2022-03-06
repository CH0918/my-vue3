export default App = {
  render() {
    return h('div', 'msg: ' + this.msg);
  },
  setup() {
    return {
      msg: 'hello vue',
    };
  },
};
