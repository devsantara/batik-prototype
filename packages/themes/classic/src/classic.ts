import { defineTheme } from '@batik-prototype/core/theme';

/**
 * Cool slate neutrals, a confident blue and small rounded corners. The theme to
 * start from.
 *
 * Its light scheme used to live in `@batik-prototype/core`, as the variables'
 * default values, and this package only added the dark one. Core's defaults
 * are a plain monochrome now, so Classic is a complete theme like every other -
 * the light values are the ones core used to carry, unchanged.
 */
export const classic = defineTheme('classic', {
  tokens: {
    colors: {
      background: ['#f8fafc', '#0b1120'],
      surface: ['#ffffff', '#111827'],
      surfaceHover: ['#f1f5f9', '#1e293b'],

      foreground: ['#0f172a', '#e2e8f0'],
      muted: ['#64748b', '#94a3b8'],

      border: ['#e2e8f0', '#1e293b'],
      borderStrong: ['#cbd5e1', '#334155'],
      ring: ['#3b82f6', '#60a5fa'],

      // The dark accent lightens rather than darkens towards active: on a
      // near-black page, "more pressed" reads as brighter, not deeper.
      accent: ['#2563eb', '#3b82f6'],
      accentHover: ['#1d4ed8', '#60a5fa'],
      accentActive: ['#1e40af', '#93c5fd'],
      onAccent: ['#ffffff', '#0b1120'],

      danger: ['#dc2626', '#f87171'],

      neutralSurface: ['#f1f5f9', '#1e293b'],
      onNeutralSurface: ['#334155', '#cbd5e1'],
      accentSurface: ['#dbeafe', '#1e3a8a'],
      onAccentSurface: ['#1e40af', '#bfdbfe'],
      successSurface: ['#dcfce7', '#14532d'],
      onSuccessSurface: ['#166534', '#bbf7d0'],
      warningSurface: ['#fef3c7', '#78350f'],
      onWarningSurface: ['#92400e', '#fde68a'],
      dangerSurface: ['#fee2e2', '#7f1d1d'],
      onDangerSurface: ['#991b1b', '#fecaca'],
    },

    typography: {
      family:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      familyMono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',

      sizeSm: '0.8125rem',
      sizeMd: '0.9375rem',
      sizeLg: '1.0625rem',

      weightRegular: '400',
      weightMedium: '500',
      weightSemibold: '600',

      lineHeightTight: '1.25',
      lineHeightNormal: '1.5',

      trackingWide: '0.01em',
    },

    spacing: { xs: '4px', sm: '6px', md: '10px', lg: '14px', xl: '20px', xxl: '28px' },

    // Small, restrained corners everywhere - badges and the switch included -
    // enough to soften an edge without ever reading as round.
    radius: { sm: '3px', md: '4px', lg: '6px', pill: '4px' },

    border: { width: '1px', widthStrong: '2px' },

    // A shadow tuned against a white page disappears against a near-black one,
    // so the dark scheme trades the slate tint for opaque black at a higher
    // alpha.
    shadow: {
      sm: ['0 1px 2px rgba(15, 23, 42, 0.06)', '0 1px 2px rgba(0, 0, 0, 0.5)'],
      md: ['0 2px 8px rgba(15, 23, 42, 0.08)', '0 2px 8px rgba(0, 0, 0, 0.55)'],
      lg: ['0 12px 32px rgba(15, 23, 42, 0.12)', '0 12px 32px rgba(0, 0, 0, 0.6)'],
    },
  },

  components: {
    // The on state is the accent and its copy colour, and the corners are as
    // small as the rest of Classic's: a rounded-rectangle knob in a
    // rounded-rectangle slot. The dark off track has to be lighter than the page rather than
    // darker - the one switch rule that does not survive a straight
    // light-to-dark flip - and the knob picks up the surface colour so an off
    // switch still reads as a knob sitting in a groove.
    switch: {
      trackOff: ['#e2e8f0', '#334155'],
      trackOn: ['#2563eb', '#3b82f6'],
      borderOff: ['#cbd5e1', '#475569'],
      borderOn: ['#2563eb', '#3b82f6'],
      thumbOff: ['#ffffff', '#cbd5e1'],
      thumbOn: ['#ffffff', '#0b1120'],
      thumbShadow: ['0 1px 2px rgba(15, 23, 42, 0.2)', '0 1px 2px rgba(0, 0, 0, 0.5)'],
      trackRadius: '4px',
      thumbRadius: '2px',
    },
  },

  icons: {
    chevron:
      '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>',
  },
});
