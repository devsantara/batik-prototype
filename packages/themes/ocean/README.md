# `@batik-prototype/theme-ocean`

Near-monochrome slate with a single teal accent. Tight corners, hairline borders,
almost no shadow. Light and dark.

```bash
pnpm add @batik-prototype/theme-ocean
```

```tsx
import { ThemeProvider } from '@batik-prototype/core';
import { ocean } from '@batik-prototype/theme-ocean';

<ThemeProvider theme={ocean}>{children}</ThemeProvider>;
```

| Slot    | Overrides         |
| ------- | ----------------- |
| `base`  | `radius`          |
| `light` | `color`, `shadow` |
| `dark`  | `color`, `shadow` |

## The reference theme

Ocean is the fullest example of the theme contract, and the one to copy from. It uses all
three slots and overrides three of the five variable groups, which is about as much as a
theme normally needs.

The `base` slot is the point of interest. Rounding is scheme-independent — a 6px radius is
a 6px radius on a white page or a black one — so `radius` is written once in `base` rather
than repeated in `light` and `dark`. Colours and shadows genuinely differ per scheme, so
those are written twice.

No component knows any of this happened. Switching to Ocean in
[`apps/example`](../../apps/example#readme) rounds every button, card, input and badge
without a single component re-render caring which theme is active.

## Palette

| Role       | Light     | Dark      |
| ---------- | --------- | --------- |
| Background | `#fbfcfc` | `#0c1113` |
| Surface    | `#ffffff` | `#12191c` |
| Foreground | `#101619` | `#e6ecee` |
| Accent     | `#0e7490` | `#5eead4` |
| Ring       | `#0e7490` | `#5eead4` |

The accent is the only saturated colour in the palette; every surface, line and label is a
slate neutral. On a near-black page an accent has to gain luminance to read as accented, so
dark swaps the deep teal for a light one rather than darkening it.

Elevation is deliberately close to absent — a hairline already separates a sheet from the
page, so only `shadow.lg`, used by things that genuinely overlay the page, is meant to be
noticed.
