import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { useMemo, type CSSProperties, type ReactNode } from 'react';

import { usePreferredColorScheme, type ColorSchemePreference } from '#/theme/color-scheme';
import type { BatikTheme, ColorScheme } from '#/theme/define-theme';
import { ThemeContext, type ThemeContextValue } from '#/theme/theme-context';

import { color } from '../tokens/color.stylex';
import { font } from '../tokens/font.stylex';

export type ThemeProviderProps = {
  /** The theme to apply, from a theme package or from `defineTheme()` in app code. */
  readonly theme: BatikTheme;

  /**
   * Which scheme to render. `'system'` (the default) follows the OS and
   * updates live; `'light'` and `'dark'` force one.
   *
   * This is a controlled prop with no uncontrolled twin, so an app that offers
   * a toggle owns that state and there is never a second copy of it here to
   * drift.
   */
  readonly colorScheme?: ColorSchemePreference;

  /**
   * Extra StyleX styles for the theme root, merged last.
   *
   * The root is a real element in the layout, so an app usually has something
   * to say about its size - `minHeight: '100vh'` to make the page surface fill
   * the viewport, say - without wanting a second wrapper to say it in.
   *
   * Not the place to adjust the theme itself: its variables are set inline,
   * and an inline declaration beats any class. `extendTheme()` is.
   */
  readonly style?: StyleXStyles;

  readonly children?: ReactNode;
};

const styles = stylex.create({
  surface: {
    backgroundColor: color.background,
    color: color.foreground,
    fontFamily: font.family,
    fontSize: font.sizeMd,
    lineHeight: font.lineHeightNormal,
  },

  // `color-scheme` is what makes the browser's own chrome - scrollbars, form
  // control defaults, the canvas behind a transparent page - match the theme.
  // Dynamic rather than two static rules so it always mirrors the resolved
  // scheme, including the `'system'` case.
  scheme: (scheme: ColorScheme) => ({ colorScheme: scheme }),
});

/**
 * Applies a theme to everything inside it.
 *
 * The theme's variables are set inline on a real element rather than on
 * `:root`, which is what makes themes nest: a second provider deeper in the
 * tree restyles only its own subtree. That element also carries the page
 * surface (background, text colour, base type), so dropping a provider around
 * an app is enough to make it look themed.
 */
export function ThemeProvider({
  theme,
  colorScheme = 'system',
  style,
  children,
}: ThemeProviderProps) {
  const preferred = usePreferredColorScheme();
  const resolved = colorScheme === 'system' ? preferred : colorScheme;

  const context = useMemo<ThemeContextValue>(
    () => ({ theme, colorScheme: resolved }),
    [theme, resolved],
  );

  // The one place a `stylex.props()` spread and a `style` attribute meet, and
  // on purpose. The dynamic `scheme` style comes back as an inline style, and
  // so do the theme's variables - values `defineTheme()` resolved at runtime,
  // not ones StyleX compiled - so the two are merged rather than letting one
  // replace the other.
  const { style: inline, ...props } = stylex.props(styles.surface, styles.scheme(resolved), style);

  return (
    <ThemeContext value={context}>
      <div
        data-batik-theme={theme.name}
        {...props}
        style={{ ...inline, ...theme.vars[resolved] } as CSSProperties}
      >
        {children}
      </div>
    </ThemeContext>
  );
}
