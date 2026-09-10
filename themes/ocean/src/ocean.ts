import { defineTheme } from '@batik-prototype/core/theme';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { font } from '@batik-prototype/core/tokens/font.stylex';
import { radius, shadow } from '@batik-prototype/core/tokens/shape.stylex';
import * as stylex from '@stylexjs/stylex';

// Near-monochrome slate. The page and the sheets sitting on it are separated by
// a hairline rather than a tint, and the only saturated colour in the whole
// palette is the accent - which is itself pulled back from cyan towards teal so
// it reads as ink, not as a highlighter.
const lightColor = stylex.createTheme(color, {
  background: '#fbfcfc',
  surface: '#ffffff',
  surfaceHover: '#f4f6f7',

  foreground: '#101619',
  muted: '#6b7c81',

  border: '#e8eced',
  borderStrong: '#d2d9db',
  ring: '#0e7490',

  accent: '#0e7490',
  accentHover: '#155e75',
  accentActive: '#164e63',
  onAccent: '#ffffff',

  danger: '#be123c',

  // Washes, not fills: light enough that a row of badges still reads as text
  // on the page rather than as a row of coloured chips.
  neutralSurface: '#f1f4f5',
  onNeutralSurface: '#3b4b50',
  accentSurface: '#e6f2f5',
  onAccentSurface: '#155e75',
  successSurface: '#e6f3ec',
  onSuccessSurface: '#14684a',
  warningSurface: '#f7efe0',
  onWarningSurface: '#7c4d08',
  dangerSurface: '#f8e9ec',
  onDangerSurface: '#9f1239',
});

// Dark keeps the same restraint: a flat slate page, one step of lift for a
// surface, and an accent bright enough to be legible without glowing.
const darkColor = stylex.createTheme(color, {
  background: '#0c1113',
  surface: '#12191c',
  surfaceHover: '#182226',

  foreground: '#e6ecee',
  muted: '#8d9ba0',

  border: '#1e282c',
  borderStrong: '#2d3a3f',
  ring: '#5eead4',

  accent: '#5eead4',
  accentHover: '#99f6e4',
  accentActive: '#ccfbf1',
  onAccent: '#08171a',

  danger: '#fb7185',

  neutralSurface: '#182226',
  onNeutralSurface: '#c9d5d8',
  accentSurface: '#123138',
  onAccentSurface: '#99f6e4',
  successSurface: '#12312a',
  onSuccessSurface: '#a7f3d0',
  warningSurface: '#33280f',
  onWarningSurface: '#fde68a',
  dangerSurface: '#3a1219',
  onDangerSurface: '#fecdd3',
});

// Elevation is close to absent. Borders already separate a sheet from the page,
// so a shadow only has to say "this one floats" - and only the largest one,
// for things that genuinely overlay the page, is allowed to be noticed.
const lightShadow = stylex.createTheme(shadow, {
  sm: '0 1px 1px rgba(16, 22, 25, 0.03)',
  md: '0 1px 2px rgba(16, 22, 25, 0.04), 0 4px 10px -6px rgba(16, 22, 25, 0.06)',
  lg: '0 1px 2px rgba(16, 22, 25, 0.04), 0 12px 28px -14px rgba(16, 22, 25, 0.12)',
});

const darkShadow = stylex.createTheme(shadow, {
  sm: '0 1px 1px rgba(0, 0, 0, 0.3)',
  md: '0 1px 2px rgba(0, 0, 0, 0.35), 0 4px 10px -6px rgba(0, 0, 0, 0.45)',
  lg: '0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 28px -14px rgba(0, 0, 0, 0.6)',
});

// Scheme-independent, so it goes in `base` and is written once. Corners are
// tight enough to read as square at a glance while still softening the
// hairlines - the ramp only opens up for the largest surfaces.
const softShape = stylex.createTheme(radius, {
  sm: '3px',
  md: '6px',
  lg: '10px',
  pill: '999px',
});

// A modern UI stack - Inter where it is installed, falling back to the same
// system faces as the default. No web font is fetched. Tracking sits at zero:
// letterspaced small caps are decoration, and there is none here.
const modernType = stylex.createTheme(font, {
  family:
    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  trackingWide: '0em',
});

/** Near-monochrome slate with one teal accent, tight corners, almost no shadow. */
export const ocean = defineTheme({
  name: 'ocean',
  base: [softShape, modernType],
  light: [lightColor, lightShadow],
  dark: [darkColor, darkShadow],
});
