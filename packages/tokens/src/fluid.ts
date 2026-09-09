import { remap, type Range } from '@batik-prototype/math';

/** The viewport range every fluid token interpolates across, in pixels. */
export const VIEWPORT: Range = { min: 320, max: 1280 };

/**
 * Resolves a fluid token at a given viewport width.
 *
 * Below `across.min` the result is pinned to `size.min` and above `across.max`
 * to `size.max`, so a token never runs away at the extremes.
 */
export function fluid(viewport: number, size: Range, across: Range = VIEWPORT): number {
  return remap(viewport, across, size);
}
