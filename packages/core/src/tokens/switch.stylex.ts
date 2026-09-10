import * as stylex from '@stylexjs/stylex';

/**
 * The switch's own surface contract.
 *
 * It is the one component with a token group to itself, and for a reason the
 * shared groups cannot cover: a switch is a *painted* control rather than a
 * composed one. Its off state is neither `surface` nor `neutralSurface` in
 * every theme, its thumb is not always the sheet colour, and its corners are
 * not always `radius.pill`. Reading those straight from the shared tokens
 * would mean a theme could not move any of them without moving badges and
 * cards too.
 *
 * Like every group, it is part of the contract in full: a theme sets all nine,
 * down to the knob's corners, so no switch arrives in a theme half-styled. Unset by
 * default, like every token.
 *
 * Sizes are deliberately absent: track and thumb dimensions are the component's
 * business, and a theme that could resize one but not the other would only be
 * able to break the geometry.
 */
export const toggle = stylex.defineVars({
  // --- Track ------------------------------------------------------------
  /** The track while the switch is off. */
  trackOff: 'initial',
  /** The track while it is on. */
  trackOn: 'initial',
  /** The hairline around the off track. `transparent` for a borderless switch. */
  borderOff: 'initial',
  /** The hairline around the on track. */
  borderOn: 'initial',

  // --- Thumb ------------------------------------------------------------
  /** The knob while the switch is off. */
  thumbOff: 'initial',
  /** The knob while it is on. Held apart from `thumbOff` so a dark theme can lift it. */
  thumbOn: 'initial',
  /**
   * Elevation under the knob. Not `shadow.sm`: that one is tuned for a sheet
   * against a page, and a 16px knob against a track needs a tighter drop.
   */
  thumbShadow: 'initial',

  // --- Shape ------------------------------------------------------------
  /** The track's corners. */
  trackRadius: 'initial',
  /** The knob's corners, kept separate so a theme can square one and not the other. */
  thumbRadius: 'initial',
});
