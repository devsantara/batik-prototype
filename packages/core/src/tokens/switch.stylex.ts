import * as stylex from '@stylexjs/stylex';

/**
 * The switch's own surface contract.
 *
 * It is the one component with a token group to itself, and for a reason the
 * shared groups cannot cover: a switch is a *painted* control rather than a
 * composed one. Its off state is neither `surface` nor `neutralSurface` in
 * every theme, its thumb is not always the sheet colour, and its corners are
 * not always `radius.pill` - Sunset squares the ramp off, and a switch that
 * squares off with it stops reading as a switch. Wiring those to the shared
 * tokens would mean a theme could not move any of them without moving badges
 * and cards too.
 *
 * The defaults are, like every other group here, the Classic light values. A
 * theme that says nothing about the switch still gets a switch that matches it,
 * because these defaults are written in terms of the same palette.
 *
 * Sizes are deliberately absent: track and thumb dimensions are the component's
 * business, and a theme that could resize one but not the other would only be
 * able to break the geometry.
 */
export const toggle = stylex.defineVars({
  // --- Track ------------------------------------------------------------
  /** The track while the switch is off. */
  trackOff: '#e2e8f0',
  /** The track while it is on. Usually the accent, but not required to be. */
  trackOn: '#2563eb',
  /** The hairline around the off track. `transparent` for a borderless switch. */
  borderOff: '#cbd5e1',
  /** The hairline around the on track. */
  borderOn: '#2563eb',

  // --- Thumb ------------------------------------------------------------
  /** The knob while the switch is off. */
  thumbOff: '#ffffff',
  /** The knob while it is on. Held apart from `thumbOff` so a dark theme can lift it. */
  thumbOn: '#ffffff',
  /**
   * Elevation under the knob. Not `shadow.sm`: that one is tuned for a sheet
   * against a page, and a 16px knob against a track needs a tighter drop.
   */
  thumbShadow: '0 1px 2px rgba(15, 23, 42, 0.2)',

  // --- Shape ------------------------------------------------------------
  /** The track's corners. */
  trackRadius: '999px',
  /** The knob's corners, kept separate so a theme can square one and not the other. */
  thumbRadius: '999px',
});
