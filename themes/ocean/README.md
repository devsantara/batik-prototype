# `@batik-prototype/theme-ocean`

Calm teal and cyan, generously rounded. Light and dark.

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

The `base` slot is the point of interest. Rounding is scheme-independent — a 14px radius is
a 14px radius on a white page or a black one — so `radius` is written once in `base` rather
than repeated in `light` and `dark`. Colours and shadows genuinely differ per scheme, so
those are written twice.

No component knows any of this happened. Switching to Ocean in
[`apps/example`](../../apps/example#readme) rounds every button, card, input and badge
without a single component re-render caring which theme is active.

## Palette

| Role       | Light     | Dark      |
| ---------- | --------- | --------- |
| Background | `#f0fbfa` | `#032027` |
| Surface    | `#ffffff` | `#07303a` |
| Foreground | `#062e2b` | `#dffaf7` |
| Accent     | `#0d9488` | `#2dd4bf` |
| Ring       | `#14b8a6` | `#2dd4bf` |

The dark accent is the light theme's hover colour rather than a darker teal: on a
near-black page an accent has to gain luminance to read as accented.
