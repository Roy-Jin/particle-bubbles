import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.unpkg,
      format: 'umd',
      name: 'ParticleAnimator',
      sourcemap: true,
      exports: 'named',
      globals: {}
    }
  ],
  plugins: [
    resolve({
      browser: true,
      extensions: ['.js', '.ts']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types',
      rootDir: 'src',
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    })
  ],
  external: []
};