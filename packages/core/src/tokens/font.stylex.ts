import * as stylex from '@stylexjs/stylex';

/**
 * Type tokens. Unset by default, like every token - text keeps the browser's
 * own family, size and weight until a theme sets them.
 *
 * Usually scheme-independent, so a theme writes each as a single value rather
 * than a `[light, dark]` pair. Weights and line heights are strings - `'500'`,
 * `'1.5'` - because a value lands in a CSS custom property verbatim, and
 * writing it the way the stylesheet will hold it keeps a file honest about
 * what it is setting.
 */
export const font = stylex.defineVars({
  family: 'initial',
  familyMono: 'initial',

  sizeSm: 'initial',
  sizeMd: 'initial',
  sizeLg: 'initial',

  weightRegular: 'initial',
  weightMedium: 'initial',
  weightSemibold: 'initial',

  lineHeightTight: 'initial',
  lineHeightNormal: 'initial',

  /** Applied to badges and other small uppercase-ish labels. */
  trackingWide: 'initial',
});
