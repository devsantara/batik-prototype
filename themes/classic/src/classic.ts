import { defineTheme } from '@batik-prototype/core/theme';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { shadow } from '@batik-prototype/core/tokens/shape.stylex';
import { toggle } from '@batik-prototype/core/tokens/switch.stylex';
import * as stylex from '@stylexjs/stylex';

const darkColor = stylex.createTheme(color, {
  background: '#0b1120',
  surface: '#111827',
  surfaceHover: '#1e293b',

  foreground: '#e2e8f0',
  muted: '#94a3b8',

  border: '#1e293b',
  borderStrong: '#334155',
  ring: '#60a5fa',

  // The accent lightens rather than darkens on hover: on a near-black page,
  // "more pressed" reads as brighter, not deeper.
  accent: '#3b82f6',
  accentHover: '#60a5fa',
  accentActive: '#93c5fd',
  onAccent: '#0b1120',

  danger: '#f87171',

  neutralSurface: '#1e293b',
  onNeutralSurface: '#cbd5e1',
  accentSurface: '#1e3a8a',
  onAccentSurface: '#bfdbfe',
  successSurface: '#14532d',
  onSuccessSurface: '#bbf7d0',
  warningSurface: '#78350f',
  onWarningSurface: '#fde68a',
  dangerSurface: '#7f1d1d',
  onDangerSurface: '#fecaca',
});

// A shadow tuned against a white page disappears against a near-black one, so
// the dark scheme trades the slate tint for opaque black at a higher alpha.
const darkShadow = stylex.createTheme(shadow, {
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 2px 8px rgba(0, 0, 0, 0.55)',
  lg: '0 12px 32px rgba(0, 0, 0, 0.6)',
});

// The off track has to be lighter than the page rather than darker, which is
// the one switch rule that does not survive a straight light-to-dark flip, and
// the knob picks up the surface colour so an off switch still reads as a knob
// sitting in a groove.
const darkToggle = stylex.createTheme(toggle, {
  trackOff: '#334155',
  trackOn: '#3b82f6',
  borderOff: '#475569',
  borderOn: '#3b82f6',

  thumbOff: '#cbd5e1',
  thumbOn: '#0b1120',
  thumbShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
});

/**
 * The default Batik theme.
 *
 * There is no `light` here, and that is the whole point: the token defaults in
 * `@batik-prototype/core` *are* Classic light, which is what makes it the
 * default rather than merely the recommended one. This package exists to add
 * the dark scheme and to give the default a name a theme picker can list
 * alongside the others.
 */
export const classic = defineTheme({
  name: 'classic',
  dark: [darkColor, darkShadow, darkToggle],
});
