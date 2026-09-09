/**
 * Linearly interpolates between `from` and `to`.
 *
 * `amount` is not clamped, so values outside `[0, 1]` extrapolate.
 */
export function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}
