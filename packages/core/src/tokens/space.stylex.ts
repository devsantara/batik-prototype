import * as stylex from '@stylexjs/stylex';

/**
 * The spacing ramp every component's padding and gap reads from.
 *
 * It is a variable group rather than a constant group because density is a
 * theme decision: a theme that wants a tighter UI overrides the ramp once and
 * every component follows, with no component-level opt-in.
 */
export const space = stylex.defineVars({
  xs: '4px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  xxl: '28px',
});
