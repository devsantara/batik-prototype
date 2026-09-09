import { expect, it } from 'vite-plus/test';

import { lerp } from '#/lerp';

it('interpolates between the endpoints', () => {
  expect(lerp(0, 10, 0)).toBe(0);
  expect(lerp(0, 10, 0.5)).toBe(5);
  expect(lerp(0, 10, 1)).toBe(10);
});

it('extrapolates outside [0, 1]', () => {
  expect(lerp(0, 10, 2)).toBe(20);
});
