import { defineTheme } from '@batik-prototype/core/theme';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { radius, shadow } from '@batik-prototype/core/tokens/shape.stylex';
import * as stylex from '@stylexjs/stylex';

const lightColor = stylex.createTheme(color, {
  background: '#f0fbfa',
  surface: '#ffffff',
  surfaceHover: '#e6f7f5',

  foreground: '#062e2b',
  muted: '#4d7d79',

  border: '#cdeae7',
  borderStrong: '#9fd6d0',
  ring: '#14b8a6',

  accent: '#0d9488',
  accentHover: '#0f766e',
  accentActive: '#115e59',
  onAccent: '#ffffff',

  danger: '#e11d48',

  neutralSurface: '#e6f7f5',
  onNeutralSurface: '#0f5f59',
  accentSurface: '#ccfbf1',
  onAccentSurface: '#115e59',
  successSurface: '#d1fae5',
  onSuccessSurface: '#065f46',
  warningSurface: '#fef3c7',
  onWarningSurface: '#92400e',
  dangerSurface: '#ffe4e6',
  onDangerSurface: '#9f1239',
});

const darkColor = stylex.createTheme(color, {
  background: '#032027',
  surface: '#07303a',
  surfaceHover: '#0b4553',

  foreground: '#dffaf7',
  muted: '#7fb3b8',

  border: '#0b4553',
  borderStrong: '#126579',
  ring: '#2dd4bf',

  accent: '#2dd4bf',
  accentHover: '#5eead4',
  accentActive: '#99f6e4',
  onAccent: '#032027',

  danger: '#fb7185',

  neutralSurface: '#0b4553',
  onNeutralSurface: '#c7f0ec',
  accentSurface: '#134e4a',
  onAccentSurface: '#99f6e4',
  successSurface: '#064e3b',
  onSuccessSurface: '#a7f3d0',
  warningSurface: '#713f12',
  onWarningSurface: '#fde68a',
  dangerSurface: '#881337',
  onDangerSurface: '#fecdd3',
});

const lightShadow = stylex.createTheme(shadow, {
  sm: '0 1px 2px rgba(6, 46, 43, 0.08)',
  md: '0 4px 14px rgba(6, 46, 43, 0.1)',
  lg: '0 16px 40px rgba(6, 46, 43, 0.16)',
});

const darkShadow = stylex.createTheme(shadow, {
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 4px 14px rgba(0, 0, 0, 0.55)',
  lg: '0 16px 40px rgba(0, 0, 0, 0.6)',
});

// Scheme-independent, so it goes in `base` and is written once. Rounding is
// the loudest thing a theme can change without touching a single component.
const softShape = stylex.createTheme(radius, {
  sm: '8px',
  md: '14px',
  lg: '20px',
  pill: '999px',
});

/** Calm teal and cyan, generously rounded. Light and dark. */
export const ocean = defineTheme({
  name: 'ocean',
  base: softShape,
  light: [lightColor, lightShadow],
  dark: [darkColor, darkShadow],
});
