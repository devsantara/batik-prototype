# Themes

One theme, one package. Each directory here publishes as `@batik-prototype/theme-<name>`
and is installed on its own:

| Package                             | Looks like                                                                         | Schemes     |
| ----------------------------------- | ---------------------------------------------------------------------------------- | ----------- |
| [`theme-classic`](./classic#readme) | Cool slate neutrals, confident blue, small rounded corners. The one to start from. | light, dark |
| [`theme-ocean`](./ocean#readme)     | Near-monochrome slate, one teal accent, fully rounded.                             | light, dark |
| [`theme-sunset`](./sunset#readme)   | Warm greys, one terracotta accent, square corners, serif.                          | light, dark |

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

## The contract

`@batik-prototype/core` ships every token with a plain monochrome default — what an app with
no theme renders. A theme replaces all of it: a value for every token the contract names,
handed to `defineTheme()`:

```ts
import { defineTheme } from '@batik-prototype/core/theme';

export const violet = defineTheme('violet', {
  tokens: {
    colors: {
      background: ['#f8fafc', '#140f1f'],
      accent: ['#7c3aed', '#a78bfa'],
      // …every colour role
    },
    typography: { family: 'ui-sans-serif, system-ui, sans-serif' /* …every type token */ },
    spacing: { xs: '4px', sm: '6px', md: '10px', lg: '14px', xl: '20px', xxl: '28px' },
    radius: { sm: '4px', md: '8px', lg: '12px', pill: '999px' },
    border: { width: '1px', widthStrong: '2px' },
    shadow: { sm: ['0 1px 2px rgba(15, 23, 42, 0.06)', '0 1px 2px rgba(0, 0, 0, 0.5)'] /* … */ },
  },
  components: {
    switch: { trackOff: ['#e2e8f0', '#2a2142'], trackOn: ['#7c3aed', '#a78bfa'] /* …all nine */ },
  },
  icons: {
    chevron:
      '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" /></svg>',
  },
});
```

| Section      | Required    | What goes in it                                                 |
| ------------ | ----------- | --------------------------------------------------------------- |
| `tokens`     | every token | `colors`, `typography`, `spacing`, `radius`, `border`, `shadow` |
| `components` | every token | per-component tokens — `switch` today                           |
| `icons`      | every icon  | SVG markup — `chevron` today                                    |

**A value is one string or a `[light, dark]` pair.** Any token can take either, so a theme
writes a pair only where the value genuinely differs — colours and shadows, usually — and
never repeats a radius twice. A theme with no pairs anywhere has no dark scheme: it reports
`schemes: ['light']`, and a UI built against that can hide or disable its dark toggle.

**Every section is all-or-nothing.** The monochrome defaults are a fallback, not a base to
build on, so the config type requires every token — shared, component and icon alike — and a
theme that misses one does not compile:

```text
error TS2741: Property 'info' is missing in type '{ background: …; … }' but required in type 'TokenValues<…>'.
```

That is the constraint that keeps every theme in step with core. Add a token to core and every
theme in this repo stops compiling until it has a value for it; rename one and the old name
becomes an error too.

**Components included.** A component group is part of the contract like any other, so a theme
sets every switch token, down to the knob's corners — which is what keeps a new component from
arriving in a theme half-styled. Add one to core and every theme stops compiling until it has
styled it.

**Icons are masks.** A component draws an icon as an element masked by the SVG and paints it in
`currentColor`, so only the shape carries and the SVG's own colours are ignored. Markup can be
pasted from any icon set; `defineTheme()` adds the SVG namespace if it is missing.

### Starting from another theme

`extendTheme()` takes a complete theme and replaces what you name. The base is complete, so the
result is too:

```ts
import { extendTheme } from '@batik-prototype/core/theme';
import { classic } from '@batik-prototype/theme-classic';

export const plum = extendTheme(classic, 'plum', {
  tokens: { colors: { accent: ['#7c3aed', '#a78bfa'], accentHover: ['#6d28d9', '#c4b5fd'] } },
});
```

A value is replaced whole: overriding a pair with one string gives that string in both schemes.

### When core moves ahead of a theme

The types check a theme against the contract it was built with. An app that upgrades
`@batik-prototype/core` past its installed theme package gets the other half of the check:
`defineTheme()` runs again at load, against the installed core, and says what is missing
rather than letting it fall back to monochrome in silence.

```text
Batik: theme "ocean" does not match the token contract of the installed @batik-prototype/core.
  Not set, so these fall back to core's monochrome defaults: tokens.colors.info
If the theme comes from a package, update it to a version built for this core.
```

Tokens a theme sets that the contract does not have — a theme newer than its core — are
reported the same way, as a warning.

### Why `defineTheme` is not `createTheme`

StyleX reads `stylex.createTheme()` at compile time, and only from a literal written at the call
site, so no helper can call it on a theme's behalf. `defineTheme()` is a plain function instead:
it reads each token's CSS variable off the compiled contract, and `ThemeProvider` sets the values
inline on its root. The components' styles are untouched — still static and atomic — and a theme
package stops being StyleX at all. It is data, which is what lets `extendTheme()` exist, lets a
theme carry icons, and means a theme never has to know which `.stylex` file a token lives in.

## Adding a theme to this repo

```bash
vp create theme -- --name violet --description "Deep violet with a soft dusk scheme"
```

That scaffolds `packages/themes/violet` with the manifest, tsconfig, build config and licence
already right, and runs `vp install`. What it generates is a complete theme — Classic's
neutrals with a violet accent, and a violet dark ground — so you can see it in the example app
before choosing a single colour. See [`create-theme`](../../tools/create-theme#readme).

Two things the generator leaves to you:

1. `pnpm changeset` — CI fails a PR that changes a package without one.
2. Add it to the picker in [`apps/example`](../../apps/example#readme), so it is exercised.

Theme packages are React-free and StyleX-free: they depend on nothing but
`@batik-prototype/core`, as a peer, and build with the plain
`@batik-prototype/config/vite/library` config.
