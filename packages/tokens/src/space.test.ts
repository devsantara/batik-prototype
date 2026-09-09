import { expect, it } from 'vite-plus/test';

import { MAX_STEP, space } from '#/space';

it('resolves steps on the ramp', () => {
  expect(space(0)).toBe(0);
  expect(space(3)).toBe(8);
  expect(space(MAX_STEP)).toBe(64);
});

it('rounds fractional steps', () => {
  expect(space(2.4)).toBe(4);
});

it('clamps out-of-range steps', () => {
  expect(space(-5)).toBe(0);
  expect(space(999)).toBe(64);
});
