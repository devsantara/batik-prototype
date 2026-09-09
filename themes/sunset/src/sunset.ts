import { defineTheme } from '@batik-prototype/core/theme';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { font } from '@batik-prototype/core/tokens/font.stylex';
import { radius, shadow } from '@batik-prototype/core/tokens/shape.stylex';
import * as stylex from '@stylexjs/stylex';

const lightColor = stylex.createTheme(color, {
  background: '#fff8f2',
  surface: '#ffffff',
  surfaceHover: '#fff0e4',

  foreground: '#431407',
  muted: '#92613f',

  border: '#f7ddc8',
  borderStrong: '#eebf9c',
  ring: '#f97316',

  accent: '#ea580c',
  accentHover: '#c2410c',
  accentActive: '#9a3412',
  onAccent: '#ffffff',

  danger: '#be123c',

  neutralSurface: '#fdece0',
  onNeutralSurface: '#7c3a12',
  accentSurface: '#ffedd5',
  onAccentSurface: '#9a3412',
  successSurface: '#d9f2e0',
  onSuccessSurface: '#14532d',
  warningSurface: '#fef0c7',
  onWarningSurface: '#854d0e',
  dangerSurface: '#ffe4e6',
  onDangerSurface: '#9f1239',
});

const darkColor = stylex.createTheme(color, {
  background: '#1b0f08',
  surface: '#2a1710',
  surfaceHover: '#3a2016',

  foreground: '#ffeadb',
  muted: '#c69a7a',

  border: '#3a2016',
  borderStrong: '#5a3020',
  ring: '#fb923c',

  accent: '#fb923c',
  accentHover: '#fdba74',
  accentActive: '#fed7aa',
  onAccent: '#1b0f08',

  danger: '#fb7185',

  neutralSurface: '#3a2016',
  onNeutralSurface: '#f5d6bd',
  accentSurface: '#7c2d12',
  onAccentSurface: '#fed7aa',
  successSurface: '#14532d',
  onSuccessSurface: '#bbf7d0',
  warningSurface: '#713f12',
  onWarningSurface: '#fde68a',
  dangerSurface: '#881337',
  onDangerSurface: '#fecdd3',
});

const lightShadow = stylex.createTheme(shadow, {
  sm: '0 1px 2px rgba(67, 20, 7, 0.08)',
  md: '0 3px 10px rgba(67, 20, 7, 0.1)',
  lg: '0 14px 36px rgba(67, 20, 7, 0.16)',
});

const darkShadow = stylex.createTheme(shadow, {
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 3px 10px rgba(0, 0, 0, 0.55)',
  lg: '0 14px 36px rgba(0, 0, 0, 0.6)',
});

// The mirror image of Ocean: near-square corners rather than pill-soft ones.
// `pill` is squared off too - a badge that stays round while its neighbours go
// sharp reads as an oversight rather than a decision.
const sharpShape = stylex.createTheme(radius, {
  sm: '2px',
  md: '3px',
  lg: '4px',
  pill: '4px',
});

// Proof that a theme's reach is not limited to colour. Nothing here needs a web
// font: the stack resolves to a serif that is already on the machine.
const serifType = stylex.createTheme(font, {
  family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
});

/** Warm amber and orange, squared off, set in a serif. Light and dark. */
export const sunset = defineTheme({
  name: 'sunset',
  base: [sharpShape, serifType],
  light: [lightColor, lightShadow],
  dark: [darkColor, darkShadow],
});
