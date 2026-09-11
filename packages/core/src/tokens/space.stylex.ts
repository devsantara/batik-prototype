import * as stylex from '@stylexjs/stylex';

/**
 * The spacing ramp every component's padding and gap reads from.
 *
 * It is a variable group rather than a constant group because density is a
 * theme decision: every component follows whatever ramp the theme supplies,
 * with no component-level opt-in. Unset by default: no padding, no gap.
 */
export const space = stylex.defineVars({
  xs: 'initial',
  sm: 'initial',
  md: 'initial',
  lg: 'initial',
  xl: 'initial',
  xxl: 'initial',
});
