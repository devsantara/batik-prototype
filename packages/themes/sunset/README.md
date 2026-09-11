# `@batik-prototype/theme-sunset`

Warm greys with one terracotta accent, square corners, set in a serif. Light and dark.

```bash
pnpm add @batik-prototype/theme-sunset
```

```tsx
import { ThemeProvider } from '@batik-prototype/core';
import { sunset } from '@batik-prototype/theme-sunset';

<ThemeProvider theme={sunset}>{children}</ThemeProvider>;
```

| Section      | Sets                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| `tokens`     | every token; a square `radius` ramp (all `0px`), a serif `typography.family` |
| `components` | `switch` — every token, squared to match the ramp                            |
| `icons`      | `chevron`                                                                    |

## How far a theme can go

Sunset exists to show that a theme's reach is not limited to colour. It is Ocean's mirror
image on two axes at once:

- **Shape.** Square corners — no rounding at all — against Ocean's fully rounded ones. `pill` is
  square too, and so is the switch — a badge that stays round while its neighbours go sharp
  reads as an oversight rather than a decision.
- **Type.** A serif stack replaces the system sans. No web font is involved: the stack
  resolves to a serif that is already on the machine, so the theme costs no extra bytes and
  no font-loading flash.

Both are single values rather than `[light, dark]` pairs, because neither depends on the
colour scheme.

The colour is as restrained as Ocean's. The page is an off-white with a trace of amber in
it — enough to feel warm next to Ocean's slate, not enough to read as a tint — and the
terracotta accent is the only saturated colour in the palette. Tonal surfaces are washes
rather than fills, so a row of badges still reads as text on the page. Elevation is close
to absent: borders already separate a sheet from the page, and only the largest shadow, for
things that genuinely overlay it, is allowed to be noticed.

## Palette

| Role       | Light     | Dark      |
| ---------- | --------- | --------- |
| Background | `#fcfaf8` | `#12100e` |
| Surface    | `#ffffff` | `#1a1715` |
| Foreground | `#1c1614` | `#ece7e3` |
| Accent     | `#b4530f` | `#e8a26a` |
| Ring       | `#b4530f` | `#e8a26a` |
