# @batik-prototype/core

## 0.3.0

### Minor Changes

- [`6d1ea91`](https://github.com/devsantara/batik-prototype/commit/6d1ea913f263825a71010cc68e4589328ad928e5) - Add `Switch`, an on/off control built on a `role="switch"` checkbox, in three token-driven sizes with controlled, uncontrolled and disabled states.

- [`6d1ea91`](https://github.com/devsantara/batik-prototype/commit/6d1ea913f263825a71010cc68e4589328ad928e5) - Give `Switch` its own token group, `toggle`, at `@batik-prototype/core/tokens/switch.stylex`: track and knob colours per state, the knob's drop shadow, and separate track and thumb radii. Classic, Ocean and Sunset each override it, so the switch now looks like its theme rather than like the same control recoloured — Ocean keeps a round track over a hairline groove, Sunset squares it into a slot, and both dark schemes invert the knob against a light accent.

## 0.2.0

### Minor Changes

- [#2](https://github.com/devsantara/batik-prototype/pull/2) [`7cb629d`](https://github.com/devsantara/batik-prototype/commit/7cb629d15b913364691cbaaa79857cb60146f53d) Thanks [@edwintantawi](https://github.com/edwintantawi)! - Add `Accordion`, a stack of disclosure rows in the same token-driven shape as the rest of
  the set: `contained` groups the rows on one surface and divides them with the border token,
  `separated` gives each row its own outline.

  It is `<details>` and `<summary>` underneath, so the keyboard, the screen reader and
  find-in-page behaviour are the platform's. `exclusive` names the group rather than tracking
  which row is open, which is why the rows arrive as an `items` array instead of as children:
  nothing has to read the group's name or variant out of React context to render.

## 0.1.0

### Minor Changes

- [`3f8e8b6`](https://github.com/devsantara/batik-prototype/commit/3f8e8b667ce5f42b9cdd85a591ad45e542e0a9b9) Thanks [@edwintantawi](https://github.com/edwintantawi)! - Add the design system: `Button`, `Input`, `Card` and `Badge`, the design token contract
  they read from, and the React runtime that applies a theme.

  Tokens are StyleX variable groups, published one `.stylex` entry point per concern, so a
  theme package can override them by name. `ThemeProvider` applies a theme to a subtree and
  resolves `'system'` against the OS; `defineTheme` and `resolveTheme` are the React-free
  authoring contract, also available at `@batik-prototype/core/theme`.

  The variable defaults are the Classic light palette, so an app that installs nothing else
  already renders a finished-looking UI.
