# `@batik-prototype/theme-classic`

Cool slate neutrals with a confident blue accent. The default Batik theme.

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

| Slot    | Overrides         |
| ------- | ----------------- |
| `base`  | nothing           |
| `light` | nothing           |
| `dark`  | `color`, `shadow` |

## Why this theme is nearly empty

The variable defaults in [`@batik-prototype/core`](../../packages/core#readme) _are_ the
Classic light palette. That is what makes Classic the default theme rather than merely the
recommended one: an app that installs no theme at all is already rendering it.

So there is nothing for `light` to say, and this package exists to do two things the
defaults cannot — carry the dark scheme, and give the default a name a theme picker can
list next to Ocean and Sunset.

It is also the smallest working demonstration that `light` is optional. See
[Writing one](../README.md#writing-one).

## The dark scheme

Two groups are overridden, and the second one is the interesting one:

- **`color`** — a near-black page, lifted surfaces, and an accent that _lightens_ toward
  active rather than darkening. On a dark page "more pressed" reads as brighter.
- **`shadow`** — the light palette tints its shadows slate; against a near-black page that
  tint is invisible, so the dark scheme trades it for opaque black at a higher alpha.

Shadows are why a theme cannot put everything in `base`: elevation carries a colour, so it
belongs to a scheme.
