import * as stylex from '@stylexjs/stylex';

/**
 * Corner radii. The most visible non-colour lever a theme has: Classic keeps
 * them small, Ocean rounds them fully, Sunset squares them off - and none of
 * them has to touch a component.
 */
export const radius = stylex.defineVars({
  sm: 'initial',
  md: 'initial',
  lg: 'initial',
  /** Fully rounded ends - badges, pills, toggles. */
  pill: 'initial',
});

/** Stroke widths, so a theme can thicken every outline at once. */
export const border = stylex.defineVars({
  width: 'initial',
  widthStrong: 'initial',
});

/**
 * Elevation.
 *
 * Unlike `radius` and `border` these carry a colour, so a theme usually gives
 * each one a `[light, dark]` pair alongside its colours - a shadow tuned for a
 * white page is invisible on a near-black one. Unset by default, like every
 * token: no shadow.
 */
export const shadow = stylex.defineVars({
  sm: 'initial',
  md: 'initial',
  lg: 'initial',
});
