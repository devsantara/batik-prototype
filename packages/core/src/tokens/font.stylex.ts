import * as stylex from '@stylexjs/stylex';

/**
 * Type tokens. Scheme-independent - a theme overrides these once, in its
 * `base` styles, rather than twice for light and dark.
 *
 * Weights and line heights are strings because `defineVars` emits its values
 * into a CSS custom property verbatim; a bare `400` is a valid `font-weight`
 * but a bare `1.5` would be too, and quoting both keeps the file honest about
 * what actually lands in the stylesheet.
 */
export const font = stylex.defineVars({
  family:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  familyMono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',

  sizeSm: '0.8125rem',
  sizeMd: '0.9375rem',
  sizeLg: '1.0625rem',

  weightRegular: '400',
  weightMedium: '500',
  weightSemibold: '600',

  lineHeightTight: '1.25',
  lineHeightNormal: '1.5',

  /** Applied to badges and other small uppercase-ish labels. */
  trackingWide: '0.01em',
});
