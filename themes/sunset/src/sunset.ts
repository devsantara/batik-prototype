import { defineTheme } from '@batik-prototype/core/theme';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { font } from '@batik-prototype/core/tokens/font.stylex';
import { radius, shadow } from '@batik-prototype/core/tokens/shape.stylex';
import * as stylex from '@stylexjs/stylex';

// Warm greys rather than orange. The page is off-white with a trace of amber in
// it - enough to feel warm next to Ocean's slate, not enough to read as a tint.
// The accent is the one saturated colour, and it is pulled back from orange
// towards terracotta so it behaves like ink instead of a highlighter.
const lightColor = stylex.createTheme(color, {
  background: '#fcfaf8',
  surface: '#ffffff',
  surfaceHover: '#f6f2ee',

  foreground: '#1c1614',
  muted: '#7d716a',

  border: '#ece5df',
  borderStrong: '#dbd1c8',
  ring: '#b4530f',

  accent: '#b4530f',
  accentHover: '#93430c',
  accentActive: '#7a3809',
  onAccent: '#ffffff',

  danger: '#be123c',

  // Washes, not fills: a row of badges should still read as text on the page
  // rather than as a row of coloured chips.
  neutralSurface: '#f4f0ec',
  onNeutralSurface: '#4a423d',
  accentSurface: '#f7ede4',
  onAccentSurface: '#93430c',
  successSurface: '#ecf2ea',
  onSuccessSurface: '#3a5a2c',
  warningSurface: '#f8f0dd',
  onWarningSurface: '#7c4d08',
  dangerSurface: '#f9eaeb',
  onDangerSurface: '#9f1239',
});

// Dark keeps the same restraint: a flat warm-charcoal page, one step of lift for
// a surface, and an accent bright enough to be legible without glowing.
const darkColor = stylex.createTheme(color, {
  background: '#12100e',
  surface: '#1a1715',
  surfaceHover: '#231f1c',

  foreground: '#ece7e3',
  muted: '#9c918a',

  border: '#272220',
  borderStrong: '#3a3330',
  ring: '#e8a26a',

  accent: '#e8a26a',
  accentHover: '#f2bd90',
  accentActive: '#f8d5b4',
  onAccent: '#1a1006',

  danger: '#fb7185',

  neutralSurface: '#231f1c',
  onNeutralSurface: '#d3ccc6',
  accentSurface: '#372415',
  onAccentSurface: '#f2bd90',
  successSurface: '#1e2b1a',
  onSuccessSurface: '#bcd9b0',
  warningSurface: '#332a10',
  onWarningSurface: '#fde68a',
  dangerSurface: '#341518',
  onDangerSurface: '#fecdd3',
});

// Elevation is close to absent. Borders already separate a sheet from the page,
// so a shadow only has to say "this one floats" - and only the largest one, for
// things that genuinely overlay the page, is allowed to be noticed.
const lightShadow = stylex.createTheme(shadow, {
  sm: '0 1px 1px rgba(28, 22, 20, 0.03)',
  md: '0 1px 2px rgba(28, 22, 20, 0.04), 0 4px 10px -6px rgba(28, 22, 20, 0.06)',
  lg: '0 1px 2px rgba(28, 22, 20, 0.04), 0 12px 28px -14px rgba(28, 22, 20, 0.12)',
});

const darkShadow = stylex.createTheme(shadow, {
  sm: '0 1px 1px rgba(0, 0, 0, 0.3)',
  md: '0 1px 2px rgba(0, 0, 0, 0.35), 0 4px 10px -6px rgba(0, 0, 0, 0.45)',
  lg: '0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 28px -14px rgba(0, 0, 0, 0.6)',
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
// font: the stack resolves to a serif that is already on the machine. Tracking
// sits at zero - letterspaced small caps are decoration, and there is none here.
const serifType = stylex.createTheme(font, {
  family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  trackingWide: '0em',
});

/** Warm greys with one terracotta accent, squared off, set in a serif. */
export const sunset = defineTheme({
  name: 'sunset',
  base: [sharpShape, serifType],
  light: [lightColor, lightShadow],
  dark: [darkColor, darkShadow],
});
