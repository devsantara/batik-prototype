/**
 * The theme-authoring contract, and nothing else.
 *
 * This entry point is deliberately React-free: a theme package imports
 * `defineTheme` from here and needs no React dependency, no `@types/react`,
 * and no StyleX of its own - a theme is data, and the StyleX it is checked
 * against comes with core. The React side of theming - `ThemeProvider`,
 * `useTheme`, `useColorScheme` - is exported from the package root instead.
 */
export {
  defineTheme,
  extendTheme,
  type BatikTheme,
  type ColorScheme,
  type ThemeConfig,
  type ThemeOverrides,
  type TokenValue,
} from '#/theme/define-theme';
