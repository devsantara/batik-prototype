# `@batik-prototype/example`

A React + Vite app that consumes the design system exactly the way a downstream app would:
by installing `@batik-prototype/core`, installing three theme packages, and switching
between them at runtime.

```bash
vp run @batik-prototype/example#dev     # or `pnpm dev` from the repo root
```

Deployed to <https://devsantara.github.io/batik-prototype/> on every push to `main`, by
[`deploy.yml`](../../.github/workflows/deploy.yml).

## What it demonstrates

- **Every component**, in every variant, size and state — [`src/showcase.tsx`](./src/showcase.tsx).
- **Theme switching** across three installed theme packages, and colour-scheme switching
  across `system` / `light` / `dark` — [`src/app.tsx`](./src/app.tsx).
- **`theme.schemes`** in use: the dark control is disabled for a theme that has no dark
  scheme, rather than silently doing nothing when pressed.
- **App code reading the same tokens as the components.** The header, the segmented
  controls and the page grid are all plain `stylex.create()` in this app, styled from
  `@batik-prototype/core/tokens/*.stylex` — so they are themed by the same switch that
  themes the components.
- **`breakpoint` as `defineConsts`**: the header's responsive layout uses
  `[breakpoint.md]` as a computed key, which is only possible because a media query is
  inlined at compile time rather than emitted as a variable.

The segmented controls are built out of `Button` rather than a component the design system
does not have yet. That is deliberate: it keeps the app honest about what actually ships.

## The Vite config is the whole integration

[`vite.config.ts`](./vite.config.ts) is two plugins:

```ts
plugins: [stylex.vite({ useCSSLayers: true }), react()],
```

StyleX comes first, because it has to read `stylex.create()` and `createTheme()` calls as
they were written and Fast Refresh's transform rewrites enough of a module to spoil that.

There is no `include` list for the workspace packages. The plugin transforms every JS-like
module it is handed, and works out which dependencies author StyleX by looking for
`@stylexjs/stylex` in their `dependencies` or `peerDependencies` — which is exactly why
every Batik package declares it as a peer.

[`src/index.css`](./src/index.css) is the only hand-written CSS. StyleX has no stylesheet
of its own to link: in dev the plugin serves the compiled CSS from a middleware, and in a
production build it appends it to a CSS asset already in the bundle. Importing that file
from the entry is what creates the asset it appends to.

## Not published

`private: true`, so `vp run -r build` builds it with `vp build` and no changeset is
required for changes here.
