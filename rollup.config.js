import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.unpkg,
      format: 'umd',
      name: 'ParticleBubbles',
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