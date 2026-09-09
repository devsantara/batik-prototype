import { createContext, use } from 'react';

import type { BatikTheme, ColorScheme } from '#/theme/define-theme';

export type ThemeContextValue = {
  readonly theme: BatikTheme;
  readonly colorScheme: ColorScheme;
};

/**
 * Read by app-level chrome - a theme picker, a scheme toggle - and by nothing
 * else. Components never touch this: they read CSS variables, which the
 * provider has already set on an ancestor, so a Batik button costs no context
 * subscription and re-renders no more often than its own props change.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

function useThemeContext(hook: string): ThemeContextValue {
  const value = use(ThemeContext);

  if (value === null) {
    throw new Error(`${hook}() must be called inside a <ThemeProvider>.`);
  }

  return value;
}

/** The active theme, including the `schemes` it supports. */
export function useTheme(): BatikTheme {
  return useThemeContext('useTheme').theme;
}

/**
 * The colour scheme in effect - always `'light'` or `'dark'`, never
 * `'system'`. A `'system'` preference has already been resolved against the OS
 * by the time it reaches here.
 */
export function useColorScheme(): ColorScheme {
  return useThemeContext('useColorScheme').colorScheme;
}
