import { defineTheme } from '@batik-prototype/core/theme';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { font } from '@batik-prototype/core/tokens/font.stylex';
import { radius, shadow } from '@batik-prototype/core/tokens/shape.stylex';
import * as stylex from '@stylexjs/stylex';

// Cool slate neutrals with a single cyan accent, rather than a page tinted mint
// throughout. Surfaces stay near-neutral so the accent is the only saturated
// thing on screen, which is what makes the result read as clean.
const lightColor = stylex.createTheme(color, {
  background: '#f7f9fa',
  surface: '#ffffff',
  surfaceHover: '#f1f5f6',

  foreground: '#0d1b1f',
  muted: '#5f7379',

  border: '#e3e9ea',
  borderStrong: '#cbd6d8',
  ring: '#06b6d4',

  accent: '#0891b2',
  accentHover: '#0e7490',
  accentActive: '#155e75',
  onAccent: '#ffffff',

  danger: '#e11d48',

  neutralSurface: '#eef2f3',
  onNeutralSurface: '#33474d',
  accentSurface: '#e0f7fb',
  onAccentSurface: '#155e75',
  successSurface: '#dcf5e7',
  onSuccessSurface: '#116043',
  warningSurface: '#fdf0d5',
  onWarningSurface: '#8a5300',
  dangerSurface: '#fee7ea',
  onDangerSurface: '#9f1239',
});

// Dark is a deep slate rather than a bottle-green, so the same cyan accent
// carries over without the whole surface glowing.
const darkColor = stylex.createTheme(color, {
  background: '#0a1216',
  surface: '#101c21',
  surfaceHover: '#17272d',

  foreground: '#e8f1f3',
  muted: '#8ba3aa',

  border: '#1d2f36',
  borderStrong: '#2c444d',
  ring: '#22d3ee',

  accent: '#22d3ee',
  accentHover: '#67e8f9',
  accentActive: '#a5f3fc',
  onAccent: '#06171c',

  danger: '#fb7185',

  neutralSurface: '#17272d',
  onNeutralSurface: '#cfdee2',
  accentSurface: '#0d3b47',
  onAccentSurface: '#a5f3fc',
  successSurface: '#0d3b2e',
  onSuccessSurface: '#a7f3d0',
  warningSurface: '#3f2e10',
  onWarningSurface: '#fde68a',
  dangerSurface: '#45141f',
  onDangerSurface: '#fecdd3',
});

// Two layers each: a hairline that does the edge work and a wide, low-opacity
// spread that does the lift. One heavy blur alone reads as a drop shadow from a
// decade ago.
const lightShadow = stylex.createTheme(shadow, {
  sm: '0 1px 2px rgba(13, 27, 31, 0.06)',
  md: '0 1px 2px rgba(13, 27, 31, 0.05), 0 6px 16px -4px rgba(13, 27, 31, 0.08)',
  lg: '0 1px 3px rgba(13, 27, 31, 0.06), 0 18px 44px -12px rgba(13, 27, 31, 0.16)',
});

const darkShadow = stylex.createTheme(shadow, {
  sm: '0 1px 2px rgba(0, 0, 0, 0.45)',
  md: '0 1px 2px rgba(0, 0, 0, 0.4), 0 6px 16px -4px rgba(0, 0, 0, 0.55)',
  lg: '0 1px 3px rgba(0, 0, 0, 0.4), 0 18px 44px -12px rgba(0, 0, 0, 0.65)',
});

// Scheme-independent, so it goes in `base` and is written once. Rounding is
// the loudest thing a theme can change without touching a single component.
// Tighter than before: pill-soft corners on every control read as playful, and
// a consistent 10/12/16 ramp reads as considered.
const softShape = stylex.createTheme(radius, {
  sm: '6px',
  md: '10px',
  lg: '16px',
  pill: '999px',
});

// A modern UI stack - Inter where it is installed, falling back to the same
// system faces as the default. No web font is fetched.
const modernType = stylex.createTheme(font, {
  family:
    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  trackingWide: '0.005em',
});

/** Cool slate and cyan, evenly rounded, quietly modern. Light and dark. */
export const ocean = defineTheme({
  name: 'ocean',
  base: [softShape, modernType],
  light: [lightColor, lightShadow],
  dark: [darkColor, darkShadow],
});
