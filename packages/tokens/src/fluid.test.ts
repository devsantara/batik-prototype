import { expect, it } from 'vite-plus/test';

import { fluid, VIEWPORT } from '#/fluid';

const bodySize = { min: 16, max: 24 };

it('interpolates across the default viewport', () => {
  expect(fluid(800, bodySize)).toBe(20);
});

it('pins to the size bounds outside the viewport', () => {
  expect(fluid(0, bodySize)).toBe(16);
  expect(fluid(4000, bodySize)).toBe(24);
});

it('accepts a custom viewport range', () => {
  expect(fluid(500, bodySize, { min: 0, max: 1000 })).toBe(20);
  expect(VIEWPORT.min).toBe(320);
});
