# `@batik/tokens`

Fluid type and space scales, built on [`@batik/math`](../math).

```ts
import { fluid, space } from '@batik/tokens';

// Body copy: 16px at a 320px viewport, 24px at 1280px, clamped at both ends.
fluid(800, { min: 16, max: 24 }); // => 20

// A step on the spacing ramp.
space(3); // => 8
```

| Export     | Signature                                              |
| ---------- | ------------------------------------------------------ |
| `fluid`    | `(viewport, size: Range, across?: Range) => number`    |
| `VIEWPORT` | `Range` — the default `320 … 1280` interpolation range |
| `space`    | `(step: number) => number`                             |
| `MAX_STEP` | `number` — the last addressable step on the ramp       |

## Why this package looks the way it does

It is the reference for a package that **depends on another workspace package**.

- **`@batik/math` is a `dependency`, declared `workspace:*`.** `pnpm publish`
  rewrites that to the real version (`0.1.0`) in the tarball. Because it is a
  dependency rather than a devDependency, tsdown leaves it external instead of
  inlining it, so consumers get one copy of the math code no matter how many
  Batik packages they install.
- **Cross-package imports resolve to source, so no build is needed to work.**
  `@batik/math`'s top-level `exports` points at its `src/index.ts`, so a fresh
  clone type-checks and tests green with no `dist`, and editing math is visible
  here immediately. See [`@batik/math`](../math#why-this-package-looks-the-way-it-does)
  for how the published shape is kept separate.
- **The `build` task declares that dependency for ordering.** `dependsOn: [{
task: 'build', from: 'dependencies' }]` means `vp run @batik/tokens#build`
  builds math first, so a targeted build lands the same result as
  `vp run -r build`. That governs build order; it is not what makes the types
  resolve. It lives in [`@batik/config`](../config#readme) with the
  rest of the shared task definition — it is a no-op for packages with no
  workspace dependencies, so every package can share one `build` task.
- **Everything else** — the tsconfig presets, the `#/*` imports map, the pack
  gates — matches [`@batik/math`](../math#why-this-package-looks-the-way-it-does).

## Scripts

```bash
vp run build          # vp pack - production build, then attw + publint + unused
vp run dev            # vp pack --watch
```
