# `@batik-prototype/theme-classic`

Cool slate neutrals, a confident blue accent and small rounded corners. The theme to start from.

```bash
pnpm add @batik-prototype/theme-classic
```

```tsx
import { ThemeProvider } from '@batik-prototype/core';
import { classic } from '@batik-prototype/theme-classic';

<ThemeProvider theme={classic} colorScheme="system">
  {children}
</ThemeProvider>;
```

| Section      | Sets                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| `tokens`     | every token; `colors` and `shadow` as `[light, dark]` pairs, a small `radius` ramp |
| `components` | `switch` — every token                                                             |
| `icons`      | `chevron`                                                                          |

## From default to theme

Classic used to be the variables' default values in
[`@batik-prototype/core`](../../core#readme), and this package only added the dark scheme —
an app that installed no theme at all was already rendering Classic light.

Core's defaults are unset now, not Classic. So Classic is a complete theme like
Ocean and Sunset, and its light values are the ones core used to carry, unchanged. It is still
the one to start from: the most conventional palette, and the closest to what a new theme from
`vp create theme` looks like before it is retinted.

## The dark scheme

Two groups differ most between the schemes, and the second is the interesting one:

- **`colors`** — a near-black page, lifted surfaces, and an accent that _lightens_ toward
  active rather than darkening. On a dark page "more pressed" reads as brighter.
- **`shadow`** — the light palette tints its shadows slate; against a near-black page that
  tint is invisible, so the dark scheme trades it for opaque black at a higher alpha.

Shadows are why a shadow token usually takes a pair: elevation carries a colour, so it belongs
to a scheme.
