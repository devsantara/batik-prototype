import * as stylex from '@stylexjs/stylex';

/**
 * Corner radii. The most visible non-colour lever a theme has: Ocean rounds
 * everything, Sunset squares it off, and neither has to touch a component.
 */
export const radius = stylex.defineVars({
  sm: '4px',
  md: '8px',
  lg: '12px',
  /** Fully rounded ends - badges, pills, toggles. */
  pill: '999px',
});

/** Stroke widths, so a theme can thicken every outline at once. */
export const border = stylex.defineVars({
  width: '1px',
  widthStrong: '2px',
});

/**
 * Elevation.
 *
 * Unlike `radius` and `border` these carry a colour, so a theme overrides them
 * per colour scheme alongside `color` rather than once in `base` - a shadow
 * tuned for a white page is invisible on a near-black one.
 */
export const shadow = stylex.defineVars({
  sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
  md: '0 2px 8px rgba(15, 23, 42, 0.08)',
  lg: '0 12px 32px rgba(15, 23, 42, 0.12)',
});
