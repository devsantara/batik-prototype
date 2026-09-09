import stylexLibraryConfig from '@batik-prototype/config/vite/stylex-library';
import { defineConfig, mergeConfig } from 'vite-plus';

export default mergeConfig(
  stylexLibraryConfig,
  defineConfig({
    pack: {
      // `mergeConfig` concatenates arrays, so these are added to the shared
      // `src/index.ts` entry rather than replacing it.
      //
      // Every `exports` subpath needs its own entry: the token files have to
      // exist as distinct modules in `dist` for a theme package to import them
      // by the same specifier it uses against `src`. Bundling them into
      // `index.js` would change a variable's canonical path and silently break
      // every published theme.
      entry: ['src/theme/index.ts', 'src/tokens/*.stylex.ts'],
    },
  }),
);
