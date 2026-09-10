---
'@batik-prototype/theme-ocean': minor
---

Modernize the Ocean theme

- Replace the mint-tinted surfaces with cool slate neutrals so the cyan accent is the only saturated element on screen.
- Move the accent from teal to cyan (`#0891b2` light, `#22d3ee` dark) and desaturate the status surfaces to match.
- Rework the elevation ramp into two-layer shadows (hairline edge plus a wide, low-opacity spread) for both schemes.
- Tighten the corner radii from 8/14/20 to a 6/10/16 ramp; `pill` is unchanged.
- Add a `font` base override: Inter ahead of the existing system fallbacks, with slightly tighter `trackingWide`. No web font is fetched.
