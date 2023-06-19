import swc from 'rollup-plugin-swc';
import nodeResolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';

/* eslint-disable-next-line import/no-anonymous-default-export */
export default {
  input: 'dist/clients/http_client/__e2etests__/test-cf-worker-app.js',
  output: {
    dir: 'bundle',
    format: 'esm',
  },
  plugins: [
    nodeResolve({
      extensions: ['.ts', '.js'],
      browser: true,
    }),
    cjs(),
    swc({
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        target: 'es2022',
      },
    }),
  ],
};
