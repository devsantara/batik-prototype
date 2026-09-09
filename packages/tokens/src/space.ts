import { clamp } from '@batik-prototype/math';

/** The spacing ramp, in pixels. Index is the step. */
const STEPS = [0, 2, 4, 8, 12, 16, 24, 32, 48, 64] as const;

/** Largest addressable step on the spacing ramp. */
export const MAX_STEP = STEPS.length - 1;

/**
 * Resolves a step on the spacing ramp. Fractional steps round to the nearest
 * whole step, and out-of-range steps clamp to the ends of the ramp.
 */
export function space(step: number): number {
  const index = clamp(Math.round(step), 0, MAX_STEP);

  // `noUncheckedIndexedAccess` is on, so the lookup is `number | undefined`
  // even though `index` is provably in range.
  return STEPS[index] ?? 0;
}
