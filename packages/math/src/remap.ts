import { clamp } from '#/clamp';

/** A closed numeric interval, ordered `[min, max]`. */
export interface Range {
  min: number;
  max: number;
}

/**
 * Maps `value` from the `source` range onto the `target` range, clamped to
 * `target`. This is the building block for fluid type and space scales: a
 * viewport width in, a font size out.
 *
 * A zero-width `source` has no meaningful ratio, so it collapses to `target.min`.
 */
export function remap(value: number, source: Range, target: Range): number {
  const span = source.max - source.min;

  if (span === 0) {
    return target.min;
  }

  const ratio = (value - source.min) / span;

  return clamp(target.min + ratio * (target.max - target.min), target.min, target.max);
}
