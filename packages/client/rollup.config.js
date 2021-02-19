import outDir from '../../scripts/outdir';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import builtinModules from 'builtin-modules';
import dts from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: './src/index.ts',
    output: outDir.map((oDir) => {

      let path = `${oDir}/client`;

      if (process.env.NODE_ENV === 'production') {
        path = path.replace('/client', '');
      }

      return {
        file: `${path}/index.js`,
        format: 'esm',
      };
    }),
    plugins: [
      nodeResolve(),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
      autoExternal({
        builtins: true,
        dependencies: true,
        packagePath: './package.json',
        peerDependencies: true,
      }),
      terser({
        keep_classnames: true,
        keep_fnames: true,
        output: {
          comments: false,
        },
      }),
    ],
    external: [
      '@abstractflo/shared',
      'alt-client',
      'alt-webview',
      'natives',
      ...builtinModules,
    ],
  },
  {
    input: '../../dist/types/client/index.d.ts',
    output: outDir.map((oDir) => {
      let path = `${oDir}/client`;

      if (process.env.NODE_ENV === 'production') {
        path = path.replace('/client', '');
      }
      return {
        file: `${path}/index.d.ts`,
        format: 'esm',
      };
    }),
    plugins: [
      dts(),
    ],
    external: [
      'alt-client',
      'natives',
      '@abstractflo/shared',
      '@abraham/reflection',
    ],
  },
];
