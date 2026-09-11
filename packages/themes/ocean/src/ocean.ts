import { defineTheme } from '@batik-prototype/core/theme';

/** Near-monochrome slate with one teal accent, fully rounded, almost no shadow. */
export const ocean = defineTheme('ocean', {
  tokens: {
    // Near-monochrome slate. The page and the sheets sitting on it are
    // separated by a hairline rather than a tint, and the only saturated colour
    // in the whole palette is the accent - which is itself pulled back from
    // cyan towards teal so it reads as ink, not as a highlighter. Dark keeps
    // the same restraint: a flat slate page, one step of lift for a surface,
    // and an accent bright enough to be legible without glowing.
    colors: {
      background: ['#fbfcfc', '#0c1113'],
      surface: ['#ffffff', '#12191c'],
      surfaceHover: ['#f4f6f7', '#182226'],

      foreground: ['#101619', '#e6ecee'],
      muted: ['#6b7c81', '#8d9ba0'],

      border: ['#e8eced', '#1e282c'],
      borderStrong: ['#d2d9db', '#2d3a3f'],
      ring: ['#0e7490', '#5eead4'],

      accent: ['#0e7490', '#5eead4'],
      accentHover: ['#155e75', '#99f6e4'],
      accentActive: ['#164e63', '#ccfbf1'],
      onAccent: ['#ffffff', '#08171a'],

      danger: ['#be123c', '#fb7185'],

      // Washes, not fills: light enough that a row of badges still reads as
      // text on the page rather than as a row of coloured chips.
      neutralSurface: ['#f1f4f5', '#182226'],
      onNeutralSurface: ['#3b4b50', '#c9d5d8'],
      accentSurface: ['#e6f2f5', '#123138'],
      onAccentSurface: ['#155e75', '#99f6e4'],
      successSurface: ['#e6f3ec', '#12312a'],
      onSuccessSurface: ['#14684a', '#a7f3d0'],
      warningSurface: ['#f7efe0', '#33280f'],
      onWarningSurface: ['#7c4d08', '#fde68a'],
      dangerSurface: ['#f8e9ec', '#3a1219'],
      onDangerSurface: ['#9f1239', '#fecdd3'],
    },

    // A modern UI stack - Inter where it is installed, falling back to the same
    // system faces as Classic. No web font is fetched. Tracking sits at zero:
    // letterspaced small caps are decoration, and there is none here.
    typography: {
      family:
        'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      familyMono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',

      sizeSm: '0.8125rem',
      sizeMd: '0.9375rem',
      sizeLg: '1.0625rem',

      weightRegular: '400',
      weightMedium: '500',
      weightSemibold: '600',

      lineHeightTight: '1.25',
      lineHeightNormal: '1.5',

      trackingWide: '0em',
    },

    spacing: { xs: '4px', sm: '6px', md: '10px', lg: '14px', xl: '20px', xxl: '28px' },

    // Fully rounded: every button, input and badge is a pill. Large surfaces -
    // cards, accordions - stop at a generous 24px instead, because a card
    // rounded to its full height would clip whatever sits in its corners.
    radius: { sm: '999px', md: '999px', lg: '24px', pill: '999px' },

    border: { width: '1px', widthStrong: '2px' },

    // Elevation is close to absent. Borders already separate a sheet from the
    // page, so a shadow only has to say "this one floats" - and only the
    // largest one, for things that genuinely overlay the page, is allowed to be
    // noticed.
    shadow: {
      sm: ['0 1px 1px rgba(16, 22, 25, 0.03)', '0 1px 1px rgba(0, 0, 0, 0.3)'],
      md: [
        '0 1px 2px rgba(16, 22, 25, 0.04), 0 4px 10px -6px rgba(16, 22, 25, 0.06)',
        '0 1px 2px rgba(0, 0, 0, 0.35), 0 4px 10px -6px rgba(0, 0, 0, 0.45)',
      ],
      lg: [
        '0 1px 2px rgba(16, 22, 25, 0.04), 0 12px 28px -14px rgba(16, 22, 25, 0.12)',
        '0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 28px -14px rgba(0, 0, 0, 0.6)',
      ],
    },
  },

  components: {
    // Fully round, like everything else in Ocean. Off is a hairline groove
    // rather than a filled pill, so the accent only appears when it means on.
    // The knob takes the palette's own roles: white on light, and on dark the
    // muted slate when off and near-black when on - dark enough to hold its
    // shape against the pale teal track, where a white knob would wash out.
    switch: {
      trackOff: ['#f1f4f5', '#1e282c'],
      trackOn: ['#0e7490', '#5eead4'],
      borderOff: ['#d2d9db', '#2d3a3f'],
      borderOn: ['#0e7490', '#5eead4'],
      thumbOff: ['#ffffff', '#8d9ba0'],
      thumbOn: ['#ffffff', '#08171a'],
      thumbShadow: ['0 1px 2px rgba(16, 22, 25, 0.14)', '0 1px 2px rgba(0, 0, 0, 0.45)'],
      trackRadius: '999px',
      thumbRadius: '999px',
    },
  },

  icons: {
    chevron:
      '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>',
  },
});
