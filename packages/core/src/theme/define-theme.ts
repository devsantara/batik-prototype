import type { CompiledStyles, StyleXArray } from '@stylexjs/stylex';

/** A resolved colour scheme. There is no `'system'` here - that is a request, not a result. */
export type ColorScheme = 'light' | 'dark';

/**
 * The result of one or more `stylex.createTheme()` calls, in whatever shape is
 * convenient: a single theme, an array of them, or a nested array.
 *
 * `CompiledStyles` is the union StyleX itself uses for a compiled theme object,
 * so anything assignable here can be handed straight to `stylex.props()`.
 */
export type ThemeStyles = StyleXArray<CompiledStyles | false | null | undefined>;

/** What a theme package hands to {@link defineTheme}. */
export type ThemeDefinition = {
  /** Stable identifier, unique across themes. Used for `data-batik-theme` and for keying UI. */
  readonly name: string;

  /**
   * Variable overrides that apply in every colour scheme - type, spacing,
   * radii. Anything whose right value does not depend on light versus dark.
   */
  readonly base?: ThemeStyles;

  /**
   * Variable overrides for the light scheme.
   *
   * Optional, and meaningfully so: leaving it out means "the token defaults are
   * already right", which is exactly the case for the built-in Classic palette.
   */
  readonly light?: ThemeStyles;

  /**
   * Variable overrides for the dark scheme. A theme that omits this has no dark
   * scheme; {@link resolveTheme} falls back to its light one so the theme still
   * looks like itself rather than reverting to the defaults.
   */
  readonly dark?: ThemeStyles;
};

/** A theme definition plus the metadata {@link defineTheme} derives from it. */
export type BatikTheme = ThemeDefinition & {
  /** The schemes this theme actually implements, for building a scheme toggle. */
  readonly schemes: readonly ColorScheme[];
};

/**
 * Package a theme's `createTheme()` output as a Batik theme.
 *
 * This is deliberately a plain function and not a compile-time API: the
 * `stylex.createTheme()` calls stay in the theme package, where the StyleX
 * compiler can see their literal values. All this adds is the contract and the
 * derived `schemes` list.
 *
 * ```ts
 * const light = stylex.createTheme(color, { accent: '#0d9488' });
 * const dark = stylex.createTheme(color, { accent: '#2dd4bf' });
 *
 * export const ocean = defineTheme({ name: 'ocean', light, dark });
 * ```
 */
export function defineTheme(definition: ThemeDefinition): BatikTheme {
  return {
    ...definition,
    schemes: definition.dark === undefined ? ['light'] : ['light', 'dark'],
  };
}

/**
 * The styles to apply for one scheme: the theme's scheme-independent overrides
 * followed by the scheme-specific ones.
 *
 * A theme with no dark scheme resolves dark to its light styles. Falling
 * through to the token defaults instead would swap the theme out from under the
 * user the moment they switched schemes.
 */
export function resolveTheme(theme: ThemeDefinition, scheme: ColorScheme): ThemeStyles {
  return [theme.base, scheme === 'dark' ? (theme.dark ?? theme.light) : theme.light];
}
