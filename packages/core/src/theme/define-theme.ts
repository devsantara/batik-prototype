import {
  buildTheme,
  mergeConfig,
  type BuiltTheme,
  type ThemeConfig as ConfigFor,
  type ThemeOverrides as OverridesFor,
} from '#/theme/build-theme';
import { contract } from '#/theme/contract';

export type { ColorScheme, TokenValue } from '#/theme/build-theme';

/**
 * Everything a theme sets, checked against this version of the contract.
 *
 * Every token is required - under `tokens`, `components` and `icons` alike. Add
 * one to core, or a whole group, and every theme stops compiling until it has a
 * value for each.
 */
export type ThemeConfig = ConfigFor<typeof contract>;

/** Any part of a {@link ThemeConfig}, down to one token - what {@link extendTheme} takes. */
export type ThemeOverrides = OverridesFor<typeof contract>;

/** A theme, ready for `ThemeProvider`. */
export type BatikTheme = BuiltTheme<typeof contract>;

/**
 * Define a theme: a value for every token the contract names.
 *
 * ```ts
 * export const ocean = defineTheme('ocean', {
 *   tokens: {
 *     colors: { accent: ['#0e7490', '#5eead4'], ... },
 *     radius: { sm: '3px', md: '6px', lg: '10px', pill: '999px' },
 *     ...
 *   },
 *   icons: { chevron: '<svg viewBox="0 0 16 16">...</svg>' },
 * });
 * ```
 *
 * A value is one string for every scheme or a `[light, dark]` pair, and a
 * theme with no pairs anywhere has no dark scheme.
 *
 * This is a plain function, not a StyleX API, and has to be. StyleX reads
 * `createTheme()` at compile time and only from a literal at the call site, so
 * no helper can call it on a theme's behalf. Instead `defineTheme` reads each
 * token's CSS variable off the compiled contract and hands `ThemeProvider` the
 * values to set on it. Components are untouched - their styles are still
 * static and compiled - and a theme stops being StyleX at all. It is data,
 * which is what makes {@link extendTheme} possible.
 *
 * Checked twice. The config's type is the contract, so a theme in this repo
 * that misses a token does not compile. And the check runs again here, against
 * whichever core is installed, so a theme package built for an older one says
 * which tokens it is missing instead of quietly leaving them unstyled.
 */
export function defineTheme(name: string, config: ThemeConfig): BatikTheme {
  return buildTheme(contract, name, config);
}

/**
 * A new theme that is an existing one with some values changed.
 *
 * ```ts
 * export const plum = extendTheme(classic, 'plum', {
 *   tokens: { colors: { accent: ['#7c3aed', '#a78bfa'] } },
 * });
 * ```
 *
 * The base is complete, so the result is too - which makes this the shortest
 * way to a theme that is not a whole palette of its own.
 */
export function extendTheme(base: BatikTheme, name: string, overrides: ThemeOverrides): BatikTheme {
  return buildTheme(contract, name, mergeConfig(base.config, overrides));
}
