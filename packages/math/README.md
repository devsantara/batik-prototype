# `@batik-prototype/math`

Math primitives for building design tokens and fluid scales.

```ts
import { clamp, lerp, remap } from '@batik-prototype/math';

// A fluid font size: 16px at a 320px viewport, 24px at 1280px, clamped at both ends.
remap(800, { min: 320, max: 1280 }, { min: 16, max: 24 }); // => 20
```

| Export  | Signature                                         |
| ------- | ------------------------------------------------- |
| `clamp` | `(value, min, max) => number`                     |
| `lerp`  | `(from, to, amount) => number`                    |
| `remap` | `(value, source: Range, target: Range) => number` |

## Why this package looks the way it does

It doubles as the reference for how a publishable package in this repo is wired.

- **tsconfig** extends `tsconfig.browser.json` + `tsconfig.library.json`. The
  overlay is what turns on `declaration` and `declarationMap`. `include` is
  `src` and nothing else: `vite.config.ts` is checked by the _root_ tsconfig
  instead, because pulling it in here would drag Vite+'s Node type references
  into this program and make `process` and `Buffer` resolve inside `src`.
- **`vite.config.ts` is a one-line re-export** of
  [`@batik-prototype/config/vite/library`](../config#readme). Both the `pack` policy
  and the `build`/`dev` tasks live there; a package overrides any of it by
  merging a local config over the shared one with `mergeConfig`.
- **`imports`** maps `#/*` to `./src/*.js`. The `.js` is deliberate — see the
  config package README. The alias is source-only; tsdown inlines it.
- **`exports` has two shapes, both hand-written.** The top-level `exports`
  points at `./src/index.ts`, so inside the workspace a sibling package resolves
  this one's _source_ - `vp check`, `vp test` and your editor all work on a fresh
  clone with no `dist` anywhere, and never see stale types. `publishConfig.exports`
  points at `./dist/index.js`, and `pnpm publish` swaps it in so consumers get
  the build. tsdown can generate both from `exports: { devExports: true }`, but
  that flag is experimental and rewrites package.json on every build; written out
  by hand, the manifest stays yours. publint and attw validate the
  `publishConfig` shape, so a broken published entry still fails the build.
  **This swap is a pnpm feature.** `npm pack` ignores it and produces a tarball
  whose `exports` still points at `./src/index.ts`, so releases must go through
  `pnpm publish` - which is why `changeset publish` is not used.
- **`files`** ships `src` alongside `dist` so declaration maps resolve for
  consumers, and excludes `*.test.ts` so tests stay out of the tarball.
  `README.md`, `CHANGELOG.md` and `LICENSE` are listed explicitly - npm force-includes
  the first and third, but never the changelog.
- **`sideEffects: false`** lets consumer bundlers drop unused exports.

## Scripts

```bash
vp run build          # vp pack - production build, then attw + publint + unused
vp run dev            # vp pack --watch
vp test run           # from the repo root, runs this package's tests too
```
