# @batik-prototype/theme-classic

## 0.3.0

### Minor Changes

- [#8](https://github.com/devsantara/batik-prototype/pull/8) [`3cd1d99`](https://github.com/devsantara/batik-prototype/commit/3cd1d990e4419b42d9e441dc723e2271f08eabcd) - **Breaking:** rebuilt on the new token contract, and requires the matching `@batik-prototype/core`. Every theme now sets every token itself — shared tokens, the switch and the icons, Classic included, whose light palette used to be core's defaults. Themes no longer depend on `@stylexjs/stylex`.
  
  Each theme now has a shape of its own: Classic has small rounded corners, Ocean is fully rounded — buttons, inputs, badges and the switch are pills, with cards and accordions at 24px — and Sunset is square, with no rounding at all. Colours are unchanged.

### Patch Changes

- Updated dependencies [[`3cd1d99`](https://github.com/devsantara/batik-prototype/commit/3cd1d990e4419b42d9e441dc723e2271f08eabcd)]:
  - @batik-prototype/core@0.4.0

## 0.2.0

### Minor Changes

- [`6d1ea91`](https://github.com/devsantara/batik-prototype/commit/6d1ea913f263825a71010cc68e4589328ad928e5) - Give `Switch` its own token group, `toggle`, at `@batik-prototype/core/tokens/switch.stylex`: track and knob colours per state, the knob's drop shadow, and separate track and thumb radii. Classic, Ocean and Sunset each override it, so the switch now looks like its theme rather than like the same control recoloured — Ocean keeps a round track over a hairline groove, Sunset squares it into a slot, and both dark schemes invert the knob against a light accent.

### Patch Changes

- Updated dependencies [[`6d1ea91`](https://github.com/devsantara/batik-prototype/commit/6d1ea913f263825a71010cc68e4589328ad928e5), [`6d1ea91`](https://github.com/devsantara/batik-prototype/commit/6d1ea913f263825a71010cc68e4589328ad928e5)]:
  - @batik-prototype/core@0.3.0

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
