# Themes

One theme, one package. Each directory here publishes as `@batik-prototype/theme-<name>`
and is installed on its own:

| Package                             | Looks like                                             | Schemes     |
| ----------------------------------- | ------------------------------------------------------ | ----------- |
| [`theme-classic`](./classic#readme) | Cool slate neutrals, confident blue. The default.      | light, dark |
| [`theme-ocean`](./ocean#readme)     | Near-monochrome slate, one teal accent, tight corners. | light, dark |
| [`theme-sunset`](./sunset#readme)   | Warm greys, one terracotta accent, squared off, serif. | light, dark |

```bash
pnpm add @batik-prototype/theme-ocean
```

```tsx
import { ThemeProvider } from '@batik-prototype/core';
import { ocean } from '@batik-prototype/theme-ocean';

<ThemeProvider theme={ocean}>{children}</ThemeProvider>;
```

Nothing in `@batik-prototype/core` knows these three exist. A theme is a value the app
chooses, which is why an app can ship several and swap between them at runtime.

## Writing one

A theme is a single file. It imports the variable groups it wants to change, overrides
them with `stylex.createTheme()`, and hands the result to `defineTheme()`.

```ts
import { defineTheme } from '@batik-prototype/core/theme';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import * as stylex from '@stylexjs/stylex';

const light = stylex.createTheme(color, {
  accent: '#7c3aed',
  accentHover: '#6d28d9',
  accentActive: '#5b21b6',
});

const dark = stylex.createTheme(color, {
  background: '#140f1f',
  surface: '#1e1730',
  foreground: '#ede9fe',
  accent: '#a78bfa',
  onAccent: '#140f1f',
});

export const violet = defineTheme({ name: 'violet', light, dark });
```

That is a complete, publishable theme. Anything it does not override keeps the default
from `@batik-prototype/core` — override three colours and inherit the other twenty.

### The three slots

`defineTheme` takes a `name` and up to three sets of styles. All three sets are optional,
and each takes one theme or an array of them.

| Slot    | Applied             | Use it for                                 |
| ------- | ------------------- | ------------------------------------------ |
| `base`  | in every scheme     | radii, type, spacing, borders              |
| `light` | in the light scheme | colours and shadows tuned for a light page |
| `dark`  | in the dark scheme  | colours and shadows tuned for a dark page  |

Splitting `base` out is what keeps a theme from writing its corner radii twice. Compare:

```ts
const softShape = stylex.createTheme(radius, { sm: '8px', md: '14px', lg: '20px' });

export const ocean = defineTheme({
  name: 'ocean',
  base: softShape, // once
  light: [lightColor, lightShadow], // twice, because these differ per scheme
  dark: [darkColor, darkShadow],
});
```

**Omitting `dark` is allowed.** The theme then reports `schemes: ['light']`, and a UI built
against that can hide or disable its dark toggle. Switching to dark anyway falls back to
the theme's light styles rather than to the token defaults — switching schemes must not
switch themes.

**Omitting `light` is allowed too**, and Classic is why: the token defaults in
`@batik-prototype/core` already _are_ the Classic light palette, so
[`theme-classic`](./classic#readme) supplies nothing but a dark scheme.

### Which groups you can override

Every group except `breakpoint`, which is `defineConsts` and resolved at compile time. See
[the token table](../packages/core#tokens). One `createTheme()` call per group.

Overriding `shadow` is worth the extra call in a theme with a dark scheme: a shadow tuned
against a white page is invisible against a near-black one, so it belongs in `light` and
`dark` rather than in `base`.

### Rules the compiler enforces

- **Import each variable group from its own `.stylex` entry point** —
  `@batik-prototype/core/tokens/color.stylex`, never `@batik-prototype/core`. StyleX
  derives a variable's identity from the specifier you write; a barrel import hashes to a
  variable that does not exist, with no error and no styles.
- **`createTheme` values must be static.** Literals and local constants in the same file
  are fine. A value imported from an ordinary module is not — StyleX cannot see across
  files except through `.stylex` ones.
- **`createTheme` itself can live anywhere.** Only `defineVars` and `defineConsts` are
  confined to `.stylex` files, which is why a theme package needs no such file of its own.

## Adding a theme to this repo

```bash
vp create theme -- --name violet --description "Deep violet with a soft dusk scheme"
```

That scaffolds `themes/violet` with the manifest, tsconfig, build config and licence
already right, and runs `vp install`. What it generates is a working theme rather than a
stub — a violet accent over the default palette, and a neutral dark ground to retint — so
you can see it in the example app before choosing a single colour. See
[`create-theme`](../tools/create-theme#readme).

Two things the generator leaves to you:

1. `pnpm changeset` — CI fails a PR that changes a package without one.
2. Add it to the picker in [`apps/example`](../apps/example#readme), so it is exercised.

The theme packages are React-free and depend on nothing but `@batik-prototype/core` and
`@stylexjs/stylex`, both as peers. They build with
`@batik-prototype/config/vite/stylex-library`, which is the shared library config with
minification off — a StyleX package ships its `createTheme()` calls for the consuming app
to compile, so those calls have to stay readable.
