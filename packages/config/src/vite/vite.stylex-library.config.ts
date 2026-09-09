import { defineConfig, mergeConfig } from 'vite-plus';

import libraryConfig from './vite.library.config.ts';

/**
 * The build configuration for a publishable package that authors StyleX -
 * `@batik-prototype/core` and every theme package.
 *
 * A StyleX package does not ship compiled CSS. It ships its `stylex.create`,
 * `defineVars` and `createTheme` calls intact, and the *consuming* app's StyleX
 * plugin reads them, hashes them and emits one stylesheet for the whole
 * dependency graph. That is what lets a theme installed from npm override
 * variables a component package declared: both halves are compiled together,
 * against the same hash inputs.
 *
 * Everything below follows from that one fact.
 */
export default mergeConfig(
  libraryConfig,
  defineConfig({
    pack: {
      // The consumer's compiler has to statically read these calls out of
      // `dist`. Minification is not known to break that - object keys and the
      // StyleX import binding both survive it - but it turns the one input a
      // downstream build depends on into something no human can check when a
      // variable fails to resolve. Shipping it readable costs nothing: the app
      // minifies afterwards anyway, with whole-program context.
      minify: false,
    },
  }),
);
