import { describe, expect, it } from 'vite-plus/test';

import { defineTheme, resolveTheme, type ThemeStyles } from '#/theme/define-theme';

// A compiled theme is an opaque object at runtime and `resolveTheme` only ever
// passes it through, so labelled stand-ins are enough to assert the routing.
const base = { theme: 'base' } as unknown as ThemeStyles;
const light = { theme: 'light' } as unknown as ThemeStyles;
const dark = { theme: 'dark' } as unknown as ThemeStyles;

describe('defineTheme', () => {
  it('reports both schemes when the theme defines a dark one', () => {
    expect(defineTheme({ name: 'ocean', light, dark }).schemes).toEqual(['light', 'dark']);
  });

  it('reports light only when the theme has no dark scheme', () => {
    expect(defineTheme({ name: 'ocean', light }).schemes).toEqual(['light']);
  });

  it('reports both schemes for a theme that overrides dark alone', () => {
    // The Classic case: the token defaults already are its light scheme.
    expect(defineTheme({ name: 'classic', dark }).schemes).toEqual(['light', 'dark']);
  });
});

describe('resolveTheme', () => {
  it('applies the base styles before the scheme styles', () => {
    expect(resolveTheme({ name: 'ocean', base, light, dark }, 'light')).toEqual([base, light]);
  });

  it('applies the dark styles in the dark scheme', () => {
    expect(resolveTheme({ name: 'ocean', base, light, dark }, 'dark')).toEqual([base, dark]);
  });

  it('falls back to the light styles for a theme with no dark scheme', () => {
    // Not back to the token defaults: switching schemes must not switch themes.
    expect(resolveTheme({ name: 'ocean', light }, 'dark')).toEqual([undefined, light]);
  });

  it('resolves to nothing when the theme leans on the token defaults', () => {
    expect(resolveTheme({ name: 'classic', dark }, 'light')).toEqual([undefined, undefined]);
  });
});
