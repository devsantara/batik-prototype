import stylex from '@stylexjs/unplugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [
    // Before the React plugin: StyleX has to read `stylex.create()` and
    // `defineVars()` calls as they were written, and Fast Refresh's transform
    // rewrites enough of a module to spoil that. The themes have none - they
    // are data - so what it reads is core and this app.
    //
    // No `include` is needed for the workspace packages. The plugin transforms
    // every JS-like module it is handed and discovers which dependencies author
    // StyleX by looking for `@stylexjs/stylex` in their `dependencies` or
    // `peerDependencies` - which is exactly why every Batik package declares it
    // as a peer.
    stylex.vite({ useCSSLayers: true }),
    react(),
  ],

  run: {
    tasks: {
      build: {
        command: 'vp build',
        // Automatic tracking records the workspace sources this build reads, so
        // editing a component or a theme invalidates the app. Excluding dist
        // stops the output from invalidating the fingerprint that produced it.
        input: [{ auto: true }, '!dist/**'],
      },

      // A dev server never exits 0, so it would never write a cache entry.
      dev: {
        command: 'vp dev',
        cache: false,
      },
    },
  },
});
