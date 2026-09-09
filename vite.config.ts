import { defineConfig } from 'vite-plus';

export default defineConfig({
  // The only place `vp create` looks for local generators - it does not infer
  // them from the workspace. `name` is what `vp create <name>` accepts.
  create: {
    templates: [
      {
        name: 'package',
        description: 'A publishable Batik package under packages/',
        template: './tools/create-package',
      },
    ],
  },
  staged: {
    '*': 'vp check --fix',
  },
  test: {
    include: ['{apps,packages,themes,tools}/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
  },
  fmt: {
    ignorePatterns: ['pnpm-lock.yaml'],
    singleQuote: true,
    printWidth: 100,
    sortPackageJson: true,
    sortImports: {
      // Narrower than the default `["~/", "@/", "#"]`: `#/` is the only
      // internal alias convention in this repo, declared per package via the
      // `imports` field in package.json.
      internalPattern: ['#/'],

      // Differs from the default in one way that matters: `side_effect` is
      // pulled out as the first group, so side-effect imports stay hoisted and
      // in source order. Their order is load-bearing (CSS cascade, polyfills),
      // and the default scatters them into `style`/`builtin`/`unknown`.
      groups: [
        ['side_effect'],
        ['builtin'],
        ['external'],
        ['internal', 'subpath'],
        ['parent', 'sibling', 'index'],
        ['style'],
        ['unknown'],
      ],
    },
  },
  lint: {
    plugins: ['typescript', 'react', 'react-perf', 'jsx-a11y'],

    // Browser globals only. Node globals are granted per path below, so a
    // package that ships to a browser cannot quietly reach for `process` or
    // `Buffer` - the same isolation `types: []` enforces on the type side.
    env: { builtin: true, browser: true },

    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // Build configs and tooling run in Node, never in a browser.
        files: [
          'vite.config.ts',
          '*/*/vite.config.ts',
          'packages/config/src/vite/**',
          'tools/*/bin/**',
          'tools/*/src/**',
        ],
        env: { node: true },
      },
    ],
  },
});
