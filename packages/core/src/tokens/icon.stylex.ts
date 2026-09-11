import * as stylex from '@stylexjs/stylex';

/**
 * Icons, as CSS rather than as markup.
 *
 * A component draws an icon as an element masked by one of these - an SVG in a
 * `url()` - and paints it in `currentColor`. So an icon is themed the way a
 * colour is: the theme sets a variable on an ancestor, the component reads it,
 * and nothing in between needs to know which theme is active. No context, no
 * re-render, no React in a theme package.
 *
 * A theme supplies each icon as SVG markup and `defineTheme()` turns it into
 * the `url()` a mask needs. Only the shape survives: a mask keeps the drawing's
 * alpha and discards its colours, so `stroke="currentColor"` and
 * `stroke="black"` come out the same.
 *
 * Unset by default, like every token. With no mask, nothing shapes the
 * `currentColor` square an icon is painted on, so an unthemed icon renders as
 * that plain square.
 */
export const icon = stylex.defineVars({
  /**
   * A downward chevron. `Accordion` turns it half a turn to point up when a row is open.
   */
  chevron: 'initial',
});
