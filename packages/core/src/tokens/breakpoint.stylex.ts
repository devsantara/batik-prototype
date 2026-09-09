import * as stylex from '@stylexjs/stylex';

/**
 * Shared media queries, as `defineConsts` rather than `defineVars`.
 *
 * A media query is not a value a theme can override - it is a condition the
 * compiler has to read at build time to decide which at-rule a declaration
 * lands in. `defineConsts` inlines the string; `defineVars` would emit a custom
 * property, which is not something `@media` can be keyed on.
 */
export const breakpoint = stylex.defineConsts({
  sm: '@media (min-width: 40rem)',
  md: '@media (min-width: 48rem)',
  lg: '@media (min-width: 64rem)',
});
