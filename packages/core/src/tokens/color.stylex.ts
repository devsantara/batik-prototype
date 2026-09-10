import * as stylex from '@stylexjs/stylex';

/**
 * Every colour a Batik component can render, and the only colours it may.
 *
 * The defaults are `initial`: unset. A custom property set to `initial` is
 * invalid wherever it is read, so the declaration reading it behaves as if it
 * were never written and the element keeps the browser's own styling. That is
 * what an app with no theme renders - truly unstyled - and what a theme built
 * for an older core leaves unstyled for a token it has never heard of.
 *
 * There is nothing to fall back on. A theme sets every one of these through
 * `defineTheme()` - the contract requires it - so nothing a theme renders is
 * borrowed from here. And the comments are the contract: what a token is
 * *for* is what a theme author has to go on.
 */
export const color = stylex.defineVars({
  // --- Surfaces ---------------------------------------------------------
  /** The page behind everything else. */
  background: 'initial',
  /** A raised sheet: cards, menus, the inside of an input. */
  surface: 'initial',
  /** `surface` under a pointer. */
  surfaceHover: 'initial',

  // --- Content ----------------------------------------------------------
  /** Body copy and headings. */
  foreground: 'initial',
  /** Secondary copy: hints, placeholders, disabled labels. */
  muted: 'initial',

  // --- Lines ------------------------------------------------------------
  border: 'initial',
  /** Borders that have to be seen: a hovered input, a divider under a header. */
  borderStrong: 'initial',
  /** The focus ring, which is the one colour that must never be subtle. */
  ring: 'initial',

  // --- Accent -----------------------------------------------------------
  // The single brand colour. Its interaction states are tokens of their own
  // rather than a computed lighten/darken, so a theme decides every one of
  // them.
  accent: 'initial',
  accentHover: 'initial',
  accentActive: 'initial',
  /** Copy drawn on top of `accent`. */
  onAccent: 'initial',

  // --- Status -----------------------------------------------------------
  /** Border and copy for an invalid field. */
  danger: 'initial',

  // --- Tonal surfaces ---------------------------------------------------
  // Badge fills. Each pairs a wash with the copy colour that stays readable on
  // it, so a component never has to guess a contrasting foreground.
  neutralSurface: 'initial',
  onNeutralSurface: 'initial',
  accentSurface: 'initial',
  onAccentSurface: 'initial',
  successSurface: 'initial',
  onSuccessSurface: 'initial',
  warningSurface: 'initial',
  onWarningSurface: 'initial',
  dangerSurface: 'initial',
  onDangerSurface: 'initial',
});
