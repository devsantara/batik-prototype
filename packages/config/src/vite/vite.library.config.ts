import { defineConfig } from 'vite-plus';

/**
 * The build configuration every publishable Batik package shares - both the
 * `pack` policy that tsdown reads and the `build`/`dev` tasks that `vp run`
 * reads.
 *
 * Only options that differ from a correct Vite+ default are set. `format` is
 * already esm, and `treeshake`, `clean`, `report` and `failOnWarn` are already
 * on - anything absent here is already right.
 */
export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    minify: true,

    // tsdown defaults to `node`, which resolves Node builtins and picks Node
    // main fields. A design-system package has to run anywhere. This also
    // switches the output extensions to `.js`/`.d.ts`, which is why the
    // `publishConfig.exports` maps point there.
    platform: 'neutral',

    // Without this tsdown reads `engines.node`, and with no `engines` field it
    // downlevels nothing at all. Pin it to the same floor
    // typescript/tsconfig.browser.json type-checks against, so the shipped syntax matches
    // the checked syntax.
    target: 'es2022',

    // Off by default. Declaration maps come from `declarationMap` in
    // typescript/tsconfig.library.json, which is why `src` is in `files`.
    sourcemap: true,

    // `minify` is left off on purpose. Libraries ship readable code so consumer
    // stack traces stay legible; the consuming app minifies anyway, with
    // whole-program context a single package cannot have.

    // Publish-time gates. All three are off by default and none ship with
    // Vite+ - they resolve from the workspace root's devDependencies, or
    // `vp pack` aborts with "Failed to import module".
    //
    // publint already reports at `error:` and exits 1. attw and unused default
    // to warn/warning, which prints the problem and then exits 0 - so a package
    // shipping no type declarations at all would sail through CI. `level`
    // promotes them, making all three fail the build.
    publint: true,
    attw: { level: 'error' },
    unused: { level: 'error' },
  },

  run: {
    tasks: {
      // `build` is a task rather than a package.json script because tasks are
      // cached by default and scripts are not - and a name can only be one or
      // the other. `vp run -r build` resolves this task and replays dist from
      // the cache when nothing it reads has changed.
      //
      // This block cannot move into a Vite plugin: the task graph is resolved
      // statically, before any plugin runs, so a plugin's `config` hook never
      // executes on that path and the tasks simply do not exist. Merging this
      // config works because it happens at config-evaluation time instead.
      build: {
        command: 'vp pack',

        // Build workspace dependencies first, so a targeted
        // `vp run <pkg>#build` lands the same result as a recursive run instead
        // of depending on run order. A no-op when there are none.
        dependsOn: [{ task: 'build', from: 'dependencies' }],

        // Automatic input tracking records every file `vp pack` reads, and
        // after one build that set includes the dist it just wrote. Excluding
        // dist stops the previous output from invalidating the fingerprint that
        // produced it.
        //
        // `tsconfig.tsbuildinfo` needs the same treatment for a different
        // reason: `incremental` in typescript/tsconfig.base.json makes tsc both
        // read and write it, and a path that is read and written in the same
        // run is never cacheable - Vite Task refuses the entry outright. It is
        // tsc's own incremental state, not a build product, so it is excluded
        // from outputs too rather than archived and restored.
        input: [{ auto: true }, '!dist/**', '!node_modules/.cache/**'],
        output: [{ auto: true }, '!node_modules/.cache/**'],
      },

      // A watcher never exits 0, so it would never write a cache entry anyway.
      // Opting out keeps it off the fingerprinting path entirely.
      dev: {
        command: 'vp pack --watch',
        cache: false,
      },
    },
  },
});
