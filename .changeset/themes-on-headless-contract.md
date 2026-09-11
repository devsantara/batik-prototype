---
'@batik-prototype/theme-classic': minor
'@batik-prototype/theme-ocean': minor
'@batik-prototype/theme-sunset': minor
---

**Breaking:** rebuilt on the new token contract, and requires the matching `@batik-prototype/core`. Every theme now sets every token itself — shared tokens, the switch and the icons, Classic included, whose light palette used to be core's defaults. Themes no longer depend on `@stylexjs/stylex`.

Each theme now has a shape of its own: Classic has small rounded corners, Ocean is fully rounded — buttons, inputs, badges and the switch are pills, with cards and accordions at 24px — and Sunset is square, with no rounding at all. Colours are unchanged.
