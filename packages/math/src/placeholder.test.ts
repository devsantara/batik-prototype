import { describe, expect, it } from 'vite-plus/test';

import { PACKAGE_NAME } from '#/placeholder';

describe('PACKAGE_NAME', () => {
  it('is the published package name', () => {
    expect(PACKAGE_NAME).toBe('@batik-prototype/math');
  });
});
