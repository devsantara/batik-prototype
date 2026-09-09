# `@batik-prototype/theme-sunset`

Warm amber and orange, squared off, set in a serif. Light and dark.

```bash
pnpm add @batik-prototype/theme-sunset
```

```tsx
import { ThemeProvider } from '@batik-prototype/core';
import { sunset } from '@batik-prototype/theme-sunset';

<ThemeProvider theme={sunset}>{children}</ThemeProvider>;
```

| Slot    | Overrides         |
| ------- | ----------------- |
| `base`  | `radius`, `font`  |
| `light` | `color`, `shadow` |
| `dark`  | `color`, `shadow` |

## How far a theme can go

Sunset exists to show that a theme's reach is not limited to colour. It is Ocean's mirror
image on two axes at once:

- **Shape.** Near-square corners against Ocean's soft ones. `pill` is squared off too — a
  badge that stays round while its neighbours go sharp reads as an oversight rather than a
  decision.
- **Type.** A serif stack replaces the system sans. No web font is involved: the stack
  resolves to a serif that is already on the machine, so the theme costs no extra bytes and
  no font-loading flash.

Both live in `base`, because neither depends on the colour scheme.

## Palette

| Role       | Light     | Dark      |
| ---------- | --------- | --------- |
| Background | `#fff8f2` | `#1b0f08` |
| Surface    | `#ffffff` | `#2a1710` |
| Foreground | `#431407` | `#ffeadb` |
| Accent     | `#ea580c` | `#fb923c` |
| Ring       | `#f97316` | `#fb923c` |
