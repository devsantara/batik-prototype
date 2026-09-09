import * as stylex from '@stylexjs/stylex';

/**
 * Every colour a Batik component can render, and the only colours it may.
 *
 * The default values are the **Classic light** palette. That is what makes
 * Classic the default theme rather than a convention: an app that installs
 * nothing but `@batik-prototype/core` already renders a finished-looking UI,
 * and `@batik-prototype/theme-classic` only has to add the dark scheme.
 *
 * A theme replaces these with `stylex.createTheme(color, { ... })`. Anything it
 * leaves out keeps the value below, so a theme is free to restyle three tokens
 * and inherit the other twenty.
 */
export const color = stylex.defineVars({
  // --- Surfaces ---------------------------------------------------------
  /** The page behind everything else. */
  background: '#f8fafc',
  /** A raised sheet: cards, menus, the inside of an input. */
  surface: '#ffffff',
  /** `surface` under a pointer. */
  surfaceHover: '#f1f5f9',

  // --- Content ----------------------------------------------------------
  /** Body copy and headings. */
  foreground: '#0f172a',
  /** Secondary copy: hints, placeholders, disabled labels. */
  muted: '#64748b',

  // --- Lines ------------------------------------------------------------
  border: '#e2e8f0',
  /** Borders that have to be seen: a hovered input, a divider under a header. */
  borderStrong: '#cbd5e1',
  /** The focus ring, which is the one colour that must never be subtle. */
  ring: '#3b82f6',

  // --- Accent -----------------------------------------------------------
  // The single brand colour. A theme that changes nothing else should change
  // this, which is why the interaction states are tokens rather than a
  // computed lighten/darken a theme could not intercept.
  accent: '#2563eb',
  accentHover: '#1d4ed8',
  accentActive: '#1e40af',
  /** Copy drawn on top of `accent`. */
  onAccent: '#ffffff',

  // --- Status -----------------------------------------------------------
  /** Border and copy for an invalid field. */
  danger: '#dc2626',

  // --- Tonal surfaces ---------------------------------------------------
  // Badge fills. Each pairs a wash with the copy colour that stays readable on
  // it, so a component never has to guess a contrasting foreground.
  neutralSurface: '#f1f5f9',
  onNeutralSurface: '#334155',
  accentSurface: '#dbeafe',
  onAccentSurface: '#1e40af',
  successSurface: '#dcfce7',
  onSuccessSurface: '#166534',
  warningSurface: '#fef3c7',
  onWarningSurface: '#92400e',
  dangerSurface: '#fee2e2',
  onDangerSurface: '#991b1b',
});
