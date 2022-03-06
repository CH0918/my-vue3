import typescript from '@rollup/plugin-typescript';
export default {
  input: './src/index.ts',
  output: [
    // 1. cjs
    // 2. esm
    {
      format: 'cjs',
      file: 'lib/my-vue.cjs.js',
    },
    {
      format: 'es',
      file: 'lib/my-vue.esm.js',
    },
  ],
  plugins: [typescript()],
};
