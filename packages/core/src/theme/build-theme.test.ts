import type { VarGroup } from '@stylexjs/stylex';
import { describe, expect, it } from 'vite-plus/test';

import {
  buildTheme,
  mergeConfig,
  type ContractMismatch,
  type ThemeConfig,
  type ThemeOverrides,
} from '#/theme/build-theme';

/**
 * A stand-in for a compiled var group. At runtime `defineVars()` leaves an
 * object of `var(--name)` strings plus StyleX's own bookkeeping, and that is
 * all `buildTheme` reads - so this exercises it without the compiler, which a
 * test cannot run.
 */
function group<const Token extends string>(prefix: string, tokens: readonly Token[]) {
  const vars = Object.fromEntries(tokens.map((token) => [token, `var(--${prefix}-${token})`]));

  return { ...vars, __varGroupHash__: prefix } as unknown as VarGroup<Record<Token, string>>;
}

const contract = {
  tokens: {
    colors: group('c', ['accent', 'surface']),
    radius: group('r', ['md']),
  },
  components: {
    switch: group('s', ['track', 'thumb']),
  },
  icons: group('i', ['chevron']),
};

type Config = ThemeConfig<typeof contract>;

const CHEVRON = '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>';

const complete: Config = {
  tokens: {
    colors: { accent: ['#0e7490', '#5eead4'], surface: '#ffffff' },
    radius: { md: '6px' },
  },
  components: { switch: { track: '#f1f4f5', thumb: '#ffffff' } },
  icons: { chevron: CHEVRON },
};

/** Builds against the stand-in contract, collecting mismatches rather than logging them. */
function build(config: Config) {
  const mismatches: ContractMismatch[] = [];
  const theme = buildTheme(contract, 'test', config, (mismatch) => {
    mismatches.push(mismatch);
  });

  return { theme, mismatches };
}

describe('buildTheme', () => {
  it('sets a single value in both schemes and splits a pair between them', () => {
    const { theme } = build(complete);

    expect(theme.vars.light).toMatchObject({
      '--c-accent': '#0e7490',
      '--c-surface': '#ffffff',
      '--r-md': '6px',
    });
    expect(theme.vars.dark).toMatchObject({
      '--c-accent': '#5eead4',
      '--c-surface': '#ffffff',
      '--r-md': '6px',
    });
  });

  it('reports a dark scheme only when some value is a pair', () => {
    const flat: Config = {
      ...complete,
      tokens: { ...complete.tokens, colors: { accent: '#0e7490', surface: '#ffffff' } },
    };

    expect(build(complete).theme.schemes).toEqual(['light', 'dark']);
    expect(build(flat).theme.schemes).toEqual(['light']);
  });

  it('sets component tokens like any other', () => {
    expect(build(complete).theme.vars.light).toMatchObject({
      '--s-track': '#f1f4f5',
      '--s-thumb': '#ffffff',
    });
  });

  it('reports a component token the theme does not set', () => {
    const partial = {
      ...complete,
      components: { switch: { track: '#f1f4f5' } },
    } as unknown as Config;

    expect(build(partial).mismatches).toEqual([
      { theme: 'test', missing: ['components.switch.thumb'], unknown: [] },
    ]);
  });

  it('reports every token of a component group a theme has never heard of', () => {
    // Core added a component: a theme package built before it has no entry at all.
    const older = { tokens: complete.tokens, icons: complete.icons } as unknown as Config;

    expect(build(older).mismatches).toEqual([
      {
        theme: 'test',
        missing: ['components.switch.track', 'components.switch.thumb'],
        unknown: [],
      },
    ]);
  });

  it('turns an icon into a url() a mask can take, namespacing the SVG', () => {
    const url = build(complete).theme.vars.light['--i-chevron'] ?? '';
    const prefix = 'url("data:image/svg+xml,';

    expect(url.startsWith(prefix) && url.endsWith('")')).toBe(true);
    expect(decodeURIComponent(url.slice(prefix.length, -2))).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>',
    );
  });

  it('reports nothing for a theme that matches the contract', () => {
    expect(build(complete).mismatches).toEqual([]);
  });

  it('reports the tokens a theme built for an older contract does not set', () => {
    // What an app sees after upgrading core past its theme package. The type
    // said nothing, because the theme was checked against the old contract.
    const stale = {
      ...complete,
      tokens: { ...complete.tokens, colors: { accent: '#0e7490' } },
    } as unknown as Config;

    expect(build(stale).mismatches).toEqual([
      { theme: 'test', missing: ['tokens.colors.surface'], unknown: [] },
    ]);
  });

  it('reports tokens and whole groups the contract does not have', () => {
    const newer = {
      ...complete,
      tokens: { ...complete.tokens, radius: { md: '6px', xl: '20px' }, motion: { fast: '120ms' } },
    } as unknown as Config;

    expect(build(newer).mismatches).toEqual([
      { theme: 'test', missing: [], unknown: ['tokens.radius.xl', 'tokens.motion'] },
    ]);
  });

  it('refuses a contract the StyleX compiler has not seen', () => {
    const uncompiled = {
      ...contract,
      icons: { chevron: null } as unknown as VarGroup<Record<'chevron', string>>,
    };

    expect(() => buildTheme(uncompiled, 'test', complete, () => {})).toThrow(/icons/);
  });
});

/** `mergeConfig` over the stand-in contract, which it cannot infer back out of a config. */
function merge(overrides: ThemeOverrides<typeof contract>): Config {
  return mergeConfig<typeof contract>(complete, overrides);
}

describe('mergeConfig', () => {
  it('replaces the tokens it names and keeps every other', () => {
    const merged = merge({ tokens: { colors: { surface: '#fafafa' } } });

    expect(merged.tokens.colors).toEqual({ accent: ['#0e7490', '#5eead4'], surface: '#fafafa' });
    expect(merged.tokens.radius).toEqual({ md: '6px' });
    expect(merged.icons).toEqual({ chevron: CHEVRON });
  });

  it('replaces a pair whole, so one string applies in both schemes', () => {
    const { theme } = build(merge({ tokens: { colors: { accent: '#7c3aed' } } }));

    expect(theme.vars.dark['--c-accent']).toBe('#7c3aed');
    expect(theme.schemes).toEqual(['light']);
  });

  it('replaces the component tokens it names and keeps the rest', () => {
    const merged = merge({ components: { switch: { thumb: '#fafafa' } } });

    expect(merged.components).toEqual({ switch: { track: '#f1f4f5', thumb: '#fafafa' } });
  });
});
