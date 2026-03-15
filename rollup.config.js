import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import metablock from 'rollup-plugin-userscript-metablock';

const isDevelopment = process.env.BUILD === 'development';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/userscript.user.js',
    format: 'iife',
    name: 'UserScript',
    sourcemap: isDevelopment ? 'inline' : false,
    banner: () => {
      // The metablock plugin will inject the userscript metadata here
      return '';
    }
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    metablock({
      file: './meta.json'
    })
  ]
};
