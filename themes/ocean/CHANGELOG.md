# @batik-prototype/theme-ocean

## 0.2.0

### Minor Changes

- [`3c4d6c5`](https://github.com/devsantara/batik-prototype/commit/3c4d6c54b3e9f433b377fbf0f998549bb43173e7) - Modernize the Ocean theme

  - Replace the mint-tinted surfaces with cool slate neutrals so the cyan accent is the only saturated element on screen.
  - Move the accent from teal to cyan (`#0891b2` light, `#22d3ee` dark) and desaturate the status surfaces to match.
  - Rework the elevation ramp into two-layer shadows (hairline edge plus a wide, low-opacity spread) for both schemes.
  - Tighten the corner radii from 8/14/20 to a 6/10/16 ramp; `pill` is unchanged.
  - Add a `font` base override: Inter ahead of the existing system fallbacks, with slightly tighter `trackingWide`. No web font is fetched.

## 0.1.1

### Patch Changes

- Updated dependencies [[`7cb629d`](https://github.com/devsantara/batik-prototype/commit/7cb629d15b913364691cbaaa79857cb60146f53d)]:
  - @batik-prototype/core@0.2.0

## 0.1.0

### Minor Changes

- [`009ec49`](https://github.com/devsantara/batik-prototype/commit/009ec49eb8837f2be4f3b358a1b60bf329fa2789) Thanks [@edwintantawi](https://github.com/edwintantawi)! - Add the first three Batik themes, each a package of its own.

  Classic is the default and supplies only a dark scheme, since the token defaults in
  `@batik-prototype/core` already are its light palette. Ocean overrides colour, shadow and
  radius; Sunset overrides colour, shadow, radius and type, to show that a theme's reach is
  not limited to colour.

### Patch Changes

- Updated dependencies [[`3f8e8b6`](https://github.com/devsantara/batik-prototype/commit/3f8e8b667ce5f42b9cdd85a591ad45e542e0a9b9)]:
  - @batik-prototype/core@0.1.0
