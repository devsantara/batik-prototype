# `@batik-prototype/theme-ocean`

Near-monochrome slate with a single teal accent. Fully rounded, hairline borders, almost no
shadow. Light and dark.

```bash
pnpm add @batik-prototype/theme-ocean
```

```tsx
import { ThemeProvider } from '@batik-prototype/core';
import { ocean } from '@batik-prototype/theme-ocean';

<ThemeProvider theme={ocean}>{children}</ThemeProvider>;
```

| Section      | Sets                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| `tokens`     | every token; `colors` and `shadow` as pairs, a fully rounded `radius` ramp |
| `components` | `switch` — every token; a hairline off track, fully round                  |
| `icons`      | `chevron`                                                                  |

## The reference theme

Ocean is the fullest example of the theme contract, and the one to copy from.

The point of interest is what it writes once and what it writes twice. Rounding is
scheme-independent — a pill is a pill on a white page or a black one — so each `radius`
token is one string. Colours and shadows genuinely differ per scheme, so those are
`[light, dark]` pairs.

Everything is fully rounded — every button, input and badge is a pill — except the largest
surfaces: cards and accordions stop at 24px, since a card rounded to its full height would clip
whatever sits in its corners. The switch is round like the rest, which suits it: a rounded track
is what says "this slides" rather than "this is a checkbox". Like every section of the contract,
Ocean sets all nine of its switch tokens.

No component knows any of this happened. Switching to Ocean in
[`apps/example`](../../../apps/example#readme) restyles every button, card, input and badge
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
