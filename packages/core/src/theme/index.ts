/**
 * The theme-authoring contract, and nothing else.
 *
 * This entry point is deliberately React-free: a theme package imports
 * `defineTheme` from here and needs no React dependency, no `@types/react`,
 * and no runtime beyond StyleX. The React side of theming - `ThemeProvider`,
 * `useTheme`, `useColorScheme` - is exported from the package root instead.
 */
export {
  defineTheme,
  resolveTheme,
  type BatikTheme,
  type ColorScheme,
  type ThemeDefinition,
  type ThemeStyles,
} from '#/theme/define-theme';
