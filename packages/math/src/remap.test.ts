import { expect, it } from 'vite-plus/test';

import { remap } from '#/remap';

const viewport = { min: 320, max: 1280 };
const fontSize = { min: 16, max: 24 };

it('maps a value across ranges', () => {
  expect(remap(800, viewport, fontSize)).toBe(20);
});

it('clamps to the target range', () => {
  expect(remap(0, viewport, fontSize)).toBe(16);
  expect(remap(4000, viewport, fontSize)).toBe(24);
});

it('collapses a zero-width source to the target minimum', () => {
  expect(remap(5, { min: 1, max: 1 }, fontSize)).toBe(16);
});
