import libraryConfig from '@batik-prototype/config/vite/library';
import { defineConfig, mergeConfig } from 'vite-plus';

export default mergeConfig(
  libraryConfig,
  defineConfig({
    // Ships lower than the shared es2022 floor to widen browser reach.
    //
    // This package's tsconfig still type-checks against `lib: ES2022`, so the
    // two are deliberately out of step: tsdown downlevels *syntax* to es2020
    // but does not polyfill *APIs*. An ES2021+ method - `Array.prototype.at`,
    // `Object.hasOwn`, `String.replaceAll` - type-checks clean here and ships
    // unpolyfilled. Add a matching `lib` override to tsconfig.json if that
    // becomes a real risk.
    pack: { target: 'es2020', minify: false },
  }),
);
