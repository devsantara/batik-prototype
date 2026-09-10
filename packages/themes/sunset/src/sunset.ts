import { defineTheme } from '@batik-prototype/core/theme';

/** Warm greys with one terracotta accent, square corners, set in a serif. */
export const sunset = defineTheme('sunset', {
  tokens: {
    // Warm greys rather than orange. The page is off-white with a trace of
    // amber in it - enough to feel warm next to Ocean's slate, not enough to
    // read as a tint. The accent is the one saturated colour, pulled back from
    // orange towards terracotta so it behaves like ink instead of a
    // highlighter. Dark keeps the same restraint: a flat warm-charcoal page,
    // one step of lift for a surface, and an accent bright enough to be legible
    // without glowing.
    colors: {
      background: ['#fcfaf8', '#12100e'],
      surface: ['#ffffff', '#1a1715'],
      surfaceHover: ['#f6f2ee', '#231f1c'],

      foreground: ['#1c1614', '#ece7e3'],
      muted: ['#7d716a', '#9c918a'],

      border: ['#ece5df', '#272220'],
      borderStrong: ['#dbd1c8', '#3a3330'],
      ring: ['#b4530f', '#e8a26a'],

      accent: ['#b4530f', '#e8a26a'],
      accentHover: ['#93430c', '#f2bd90'],
      accentActive: ['#7a3809', '#f8d5b4'],
      onAccent: ['#ffffff', '#1a1006'],

      danger: ['#be123c', '#fb7185'],

      // Washes, not fills: a row of badges should still read as text on the
      // page rather than as a row of coloured chips.
      neutralSurface: ['#f4f0ec', '#231f1c'],
      onNeutralSurface: ['#4a423d', '#d3ccc6'],
      accentSurface: ['#f7ede4', '#372415'],
      onAccentSurface: ['#93430c', '#f2bd90'],
      successSurface: ['#ecf2ea', '#1e2b1a'],
      onSuccessSurface: ['#3a5a2c', '#bcd9b0'],
      warningSurface: ['#f8f0dd', '#332a10'],
      onWarningSurface: ['#7c4d08', '#fde68a'],
      dangerSurface: ['#f9eaeb', '#341518'],
      onDangerSurface: ['#9f1239', '#fecdd3'],
    },

    // Proof that a theme's reach is not limited to colour. Nothing here needs a
    // web font: the stack resolves to a serif that is already on the machine.
    // Tracking sits at zero - letterspaced small caps are decoration, and there
    // is none here.
    typography: {
      family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
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

    // The mirror image of Ocean: no rounding at all. `pill` is square too - a
    // badge that stays round while its neighbours go sharp reads as an
    // oversight rather than a decision.
    radius: { sm: '0px', md: '0px', lg: '0px', pill: '0px' },

    border: { width: '1px', widthStrong: '2px' },

    // Elevation is close to absent. Borders already separate a sheet from the
    // page, so a shadow only has to say "this one floats" - and only the
    // largest one, for things that genuinely overlay the page, is allowed to be
    // noticed.
    shadow: {
      sm: ['0 1px 1px rgba(28, 22, 20, 0.03)', '0 1px 1px rgba(0, 0, 0, 0.3)'],
      md: [
        '0 1px 2px rgba(28, 22, 20, 0.04), 0 4px 10px -6px rgba(28, 22, 20, 0.06)',
        '0 1px 2px rgba(0, 0, 0, 0.35), 0 4px 10px -6px rgba(0, 0, 0, 0.45)',
      ],
      lg: [
        '0 1px 2px rgba(28, 22, 20, 0.04), 0 12px 28px -14px rgba(28, 22, 20, 0.12)',
        '0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 28px -14px rgba(0, 0, 0, 0.6)',
      ],
    },
  },

  components: {
    // Where Ocean keeps the switch round, Sunset carries its square corners all
    // the way in: a square knob sliding in a square slot. It is flat, too -
    // there is almost no elevation anywhere else in this theme.
    switch: {
      trackOff: ['#f4f0ec', '#231f1c'],
      trackOn: ['#b4530f', '#e8a26a'],
      borderOff: ['#dbd1c8', '#3a3330'],
      borderOn: ['#b4530f', '#e8a26a'],
      thumbOff: ['#ffffff', '#9c918a'],
      thumbOn: ['#ffffff', '#1a1006'],
      thumbShadow: ['0 1px 1px rgba(28, 22, 20, 0.12)', '0 1px 1px rgba(0, 0, 0, 0.45)'],
      trackRadius: '0px',
      thumbRadius: '0px',
    },
  },

  icons: {
    chevron:
      '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>',
  },
});
