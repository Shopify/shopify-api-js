import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser  from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import * as pkg from './package.json';

export const mainSrcInput = 'src/index.ts';

export function getPlugins({
  tsconfig,
  minify
} = {})  {
  return [
    replace({
      'preventAssignment': true,
      'ROLLUP_REPLACE_CLIENT_VERSION': pkg.version
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: tsconfig ? tsconfig : './tsconfig.build.json',
      outDir: './dist/ts',
    }),
    ...(minify === true ? [terser({keep_fnames: new RegExp('fetch')})] : [])
  ];
}

const packageName = pkg.name.substring(1);
const repositoryName = pkg.repository.url.split(':')[1].split('.')[0];
export const bannerConfig = {
  banner: `/*! ${packageName} -- Copyright (c) 2023-present, Shopify Inc. -- license (MIT): https://github.com/${repositoryName}/blob/main/LICENSE */`,
}
