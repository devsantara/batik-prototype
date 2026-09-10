# `@batik-prototype/core`

The Batik design system: four components, the token contract they read from, and the React
runtime that applies a theme.

```bash
pnpm add @batik-prototype/core @stylexjs/stylex
```

```tsx
import { Badge, Button, Card, Input, ThemeProvider } from '@batik-prototype/core';
import { classic } from '@batik-prototype/theme-classic';

export function App() {
  return (
    <ThemeProvider theme={classic}>
      <Card>
        <Badge tone="success">Ready</Badge>
        <Input placeholder="Search" />
        <Button>Save</Button>
      </Card>
    </ThemeProvider>
  );
}
```

That is the whole integration. No CSS file to import, no provider to configure, no class
names to memorise — the styles arrive through your bundler's StyleX plugin, which you need
anyway to compile your own StyleX. See [Setting up the compiler](#setting-up-the-compiler).

## What is in the box

| Export                        | What it is                                                                |
| ----------------------------- | ------------------------------------------------------------------------- |
| `Button`                      | `solid` / `outline` / `ghost`, three sizes, disabled                      |
| `Input`                       | Three sizes, `invalid`, disabled, themed placeholder                      |
| `Card`                        | `elevated` / `outlined`, four padding steps                               |
| `Badge`                       | Five tones: neutral, accent, success, warning, danger                     |
| `Accordion`                   | `contained` / `separated`, optional `exclusive` rows                      |
| `Switch`                      | Three sizes, controlled or not, disabled                                  |
| `ThemeProvider`               | Applies a theme, resolves the colour scheme                               |
| `useTheme` / `useColorScheme` | Read the active theme and the resolved scheme                             |
| `usePreferredColorScheme`     | The OS preference on its own, kept live                                   |
| `defineTheme` / `extendTheme` | Build a theme against the contract, also at `@batik-prototype/core/theme` |

Components are plain elements underneath — `<button>`, `<input>`, `<div>`, `<span>`,
`<details>`, `<label>` — and forward every prop those accept, `ref` included. There is no wrapper, no
portal and no context lookup in the render path. `Accordion` takes its rows as an `items`
array for that last reason: a compound `<Accordion.Item>` would have to read the group's
variant and its `exclusive` group name out of context on every render.

## Themes

A theme is a package. Install it, hand it to the provider, and every component follows:

```tsx
import { ocean } from '@batik-prototype/theme-ocean';

<ThemeProvider theme={ocean} colorScheme="system">
```

`colorScheme` takes `'system'` (the default), `'light'` or `'dark'`. `'system'` follows the
OS and updates live. A theme declares which schemes it actually implements, so a toggle can
disable what a theme does not have:

```tsx
const theme = useTheme();

theme.schemes.includes('dark'); // false for a light-only theme
```

Writing one is a single file. [`themes/`](../themes#readme) is the walkthrough;
[`@batik-prototype/theme-ocean`](../themes/ocean#readme) is the fullest example.

### The default is unstyled

Every token variable defaults to `initial`, which leaves it unset: a declaration that reads it
behaves as if it were never written. An app that renders these components with no theme gets
them truly unstyled — the browser's own colours, type and spacing.

There is nothing for a theme to lean on. `ThemeProvider` still requires a theme, and a theme
still sets every token, so when this package adds a token, every theme has to answer for it.
[`themes/`](../themes#readme) explains the contract and how it is checked.

## Tokens

Everything a component renders comes from a variable group, so a theme can reach it.

| Entry point                                      | Exports                                |
| ------------------------------------------------ | -------------------------------------- |
| `@batik-prototype/core/tokens/color.stylex`      | `color` — 23 colour roles              |
| `@batik-prototype/core/tokens/font.stylex`       | `font`                                 |
| `@batik-prototype/core/tokens/space.stylex`      | `space`                                |
| `@batik-prototype/core/tokens/shape.stylex`      | `radius`, `border`, `shadow`           |
| `@batik-prototype/core/tokens/switch.stylex`     | `toggle` — the switch's track and knob |
| `@batik-prototype/core/tokens/icon.stylex`       | `icon` — the icons a component masks   |
| `@batik-prototype/core/tokens/breakpoint.stylex` | `breakpoint` — media queries           |

App code reads them the same way a component does:

```tsx
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { space } from '@batik-prototype/core/tokens/space.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  panel: { backgroundColor: color.surface, padding: space.xl },
});
```

Styles written that way are themed for free: they read the same variables the active theme
overrode.

**`toggle` is the one component-scoped group.** A switch is painted rather than composed:
its off track is neither `surface` nor `neutralSurface` in every theme, its knob is not always
the sheet colour, and its corners need not follow `radius.pill`. So it has tokens of its own, and a theme sets
all nine like every other group — moving any of them moves the switch alone, never the badges
and cards around it. Sizes stay out of it: track and thumb geometry is the component's.

**`breakpoint` is `defineConsts`, not `defineVars`.** A media query is a condition the
compiler resolves at build time, not a value a theme can override at runtime — there is no
such thing as a custom property inside an `@media` prelude. Everything else is `defineVars`
and therefore themeable.

### Tokens are not re-exported from the package root

`import { color } from '@batik-prototype/core'` does not work, and the omission is
load-bearing rather than an oversight.

StyleX derives a variable's identity from the module an import statement _names_, not from
the module the value came from — that is what `unstable_moduleResolution` configures, and
it is why cross-package theming works at all. A token re-exported through the barrel would
resolve to `index.ts` and hash to a variable the stylesheet never defines: no error, no
styles, no obvious cause. Naming the `.stylex` file directly keeps the two sides in step.

The same rule explains two smaller things:

- **Inside this package, token files are imported by relative path**, not through the `#/`
  alias the rest of the source uses. StyleX resolves `.stylex` specifiers itself with
  Node's algorithm; `#/*` maps to `./src/*.js`, which only a TypeScript-aware bundler can
  follow. Everything that is not a token file still uses `#/`.
- **Every token file has its own `exports` subpath and its own build entry**, so
  `@batik-prototype/core/tokens/color.stylex` resolves to one distinct module in `src` and
  one distinct module in `dist`. Bundling them into `index.js` would change a variable's
  canonical path and silently break every published theme.

## Styling a component from outside

Components take a `style` prop that accepts StyleX styles and merges last, so it wins:

```tsx
const styles = stylex.create({ wide: { width: '100%' } });

<Button style={styles.wide}>Save</Button>;
```

`className` and the DOM `style` attribute are removed from every component's props on
purpose. A `stylex.props()` spread produces both, so passing either alongside it silently
drops one of the two — a bug that looks like the design system ignoring you.

## Setting up the compiler

This package ships its `stylex.create()` and `defineVars()` calls **uncompiled**. Your app's
StyleX plugin reads them along with your own source and emits one stylesheet for the whole
graph, and the variable names it settles on are the ones `defineTheme()` reads back at runtime
to set a theme's values. Theme packages are not part of this: a theme is data, with nothing for
the compiler to read.

For Vite that is the whole configuration:

```ts
import stylex from '@stylexjs/unplugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [stylex.vite({ useCSSLayers: true }), react()],
});
```

Two things worth knowing:

- **StyleX first.** It has to read the calls as written, and the React plugin's Fast
  Refresh transform rewrites enough of a module to spoil that.
- **No `include` for Batik.** The plugin transforms every JS-like module it is handed and
  discovers which dependencies author StyleX by looking for `@stylexjs/stylex` in their
  `dependencies` or `peerDependencies`. Every Batik package declares it as a peer, which is
  what puts them on that list.

Other bundlers work the same way through `@stylexjs/unplugin`; Next.js uses the Babel and
PostCSS plugins instead. `@stylexjs/stylex` is a peer dependency here, so there is exactly
one copy of it and one set of variable hashes.

## Two things a prototype has not settled

- **No component tests.** The theme contract is covered
  ([`src/theme/build-theme.test.ts`](./src/theme/build-theme.test.ts)), but rendering
  assertions need a DOM environment and a testing library this workspace does not install
  yet.
- **No RTL, no reduced-motion.** StyleX flips logical properties on its own and the
  components use them, but neither is exercised anywhere.

## Scripts

```bash
vp run build          # vp pack - production build, then attw + publint + unused
vp run dev            # vp pack --watch
vp test run           # from the repo root, runs this package's tests too
```

[`@batik-prototype/config`](../config#readme) documents the tsconfig split, the two
`exports` maps and the `#/` alias that every package in this repo shares.
