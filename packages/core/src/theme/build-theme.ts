import type { VarGroup } from '@stylexjs/stylex';

/** A resolved colour scheme. There is no `'system'` here - that is a request, not a result. */
export type ColorScheme = 'light' | 'dark';

/**
 * One token's value: the same string in every scheme, or a `[light, dark]`
 * pair.
 *
 * Any token can take either, so a theme writes a pair only where the value
 * genuinely differs - colours and shadows, usually - and never repeats a radius
 * twice.
 */
export type TokenValue = string | readonly [light: string, dark: string];

/** Any compiled variable group. `{}` is the bound StyleX itself uses for "some tokens". */
type AnyVarGroup = VarGroup<{}>;

/** Every token in a variable group, each one required. */
export type TokenValues<Group extends AnyVarGroup> = {
  readonly [Token in keyof Group['__tokens']]-?: TokenValue;
};

/**
 * The shape of a theme contract: variable groups, by section. A theme sets
 * every token of every one of them - core's own values are a fallback, not a
 * base.
 */
export type Contract = {
  /** The shared groups every component reads: colour, type, spacing, shape. */
  readonly tokens: Readonly<Record<string, AnyVarGroup>>;
  /** Groups that belong to one component, like the switch's. */
  readonly components: Readonly<Record<string, AnyVarGroup>>;
  /** The icons components draw, as masks. */
  readonly icons: AnyVarGroup;
};

/** Everything a theme sets, checked against a contract. */
export type ThemeConfig<C extends Contract> = {
  readonly tokens: { readonly [Group in keyof C['tokens']]: TokenValues<C['tokens'][Group]> };
  readonly components: {
    readonly [Group in keyof C['components']]: TokenValues<C['components'][Group]>;
  };
  /** SVG markup, one string per icon - or a `[light, dark]` pair of them. */
  readonly icons: TokenValues<C['icons']>;
};

/** Any part of a {@link ThemeConfig}, down to a single token. */
export type ThemeOverrides<C extends Contract> = {
  readonly tokens?: {
    readonly [Group in keyof C['tokens']]?: Partial<TokenValues<C['tokens'][Group]>>;
  };
  readonly components?: {
    readonly [Group in keyof C['components']]?: Partial<TokenValues<C['components'][Group]>>;
  };
  readonly icons?: Partial<TokenValues<C['icons']>>;
};

/** A CSS custom property's full name. */
type Property = `--${string}`;

/** CSS custom properties and their values, as `ThemeProvider` sets them. */
export type ThemeVars = Readonly<Record<Property, string>>;

/** A theme, built: what `ThemeProvider` applies. */
export type BuiltTheme<C extends Contract> = {
  /** Stable identifier, unique across themes. Used for `data-batik-theme` and for keying UI. */
  readonly name: string;
  /** The schemes this theme implements - both, as soon as any value is a pair. */
  readonly schemes: readonly ColorScheme[];
  /** Every variable the theme sets, resolved for each scheme. */
  readonly vars: Readonly<Record<ColorScheme, ThemeVars>>;
  /** The config it was built from, which is what extending it starts from. */
  readonly config: ThemeConfig<C>;
};

/** Where a config and the contract it is built against disagree. */
export type ContractMismatch = {
  readonly theme: string;
  /** Tokens the contract requires and the theme does not set, as `section.group.token`. */
  readonly missing: readonly string[];
  /** Tokens - or whole groups - the theme sets and the contract does not have. */
  readonly unknown: readonly string[];
};

type GroupValues = Readonly<Record<string, TokenValue | undefined>>;

/** What `defineVars()` compiles a token to, in development and production alike. */
const REFERENCE = /^var\((--[\w-]+)\)$/;

const SVG_NAMESPACE = 'xmlns="http://www.w3.org/2000/svg"';

/**
 * Build a theme against a contract: resolve every value to the custom property
 * it sets, per scheme, and report where the config and the contract disagree.
 *
 * The contract is a parameter rather than an import so this runs without the
 * StyleX compiler, which a test cannot have. `defineTheme()` is this function
 * with the real contract bound in.
 */
export function buildTheme<C extends Contract>(
  contract: C,
  name: string,
  config: ThemeConfig<C>,
  onMismatch: (mismatch: ContractMismatch) => void = reportMismatch,
): BuiltTheme<C> {
  const light: Record<Property, string> = {};
  const dark: Record<Property, string> = {};
  const missing: string[] = [];
  const unknown: string[] = [];
  let hasDark = false;

  function fill(
    section: string,
    group: AnyVarGroup,
    values: GroupValues | undefined,
    encode: (value: string) => string = (value) => value,
  ): void {
    const properties = propertiesOf(group, section);

    for (const [token, property] of properties) {
      const value = values?.[token];

      if (value === undefined) {
        missing.push(`${section}.${token}`);
        continue;
      }

      const [lightValue, darkValue] = typeof value === 'string' ? [value, value] : value;

      hasDark ||= typeof value !== 'string';
      light[property] = encode(lightValue);
      dark[property] = encode(darkValue);
    }

    for (const token of Object.keys(values ?? {})) {
      if (!properties.has(token)) {
        unknown.push(`${section}.${token}`);
      }
    }
  }

  // Looked up by name below, which the mapped config types cannot be.
  const tokenGroups: Readonly<Record<string, AnyVarGroup>> = contract.tokens;
  const componentGroups: Readonly<Record<string, AnyVarGroup>> = contract.components;
  const tokens = config.tokens as Readonly<Record<string, GroupValues | undefined>>;
  // `??` for a theme package built before core had any component groups.
  const components = (config.components ?? {}) as Readonly<Record<string, GroupValues | undefined>>;

  for (const [group, vars] of Object.entries(tokenGroups)) {
    fill(`tokens.${group}`, vars, tokens[group]);
  }

  for (const [group, vars] of Object.entries(componentGroups)) {
    fill(`components.${group}`, vars, components[group]);
  }

  fill('icons', contract.icons, config.icons as GroupValues, iconUrl);

  for (const group of Object.keys(tokens)) {
    if (!Object.hasOwn(tokenGroups, group)) {
      unknown.push(`tokens.${group}`);
    }
  }

  for (const group of Object.keys(components)) {
    if (!Object.hasOwn(componentGroups, group)) {
      unknown.push(`components.${group}`);
    }
  }

  if (missing.length > 0 || unknown.length > 0) {
    onMismatch({ theme: name, missing, unknown });
  }

  return {
    name,
    schemes: hasDark ? ['light', 'dark'] : ['light'],
    vars: { light, dark },
    config,
  };
}

/**
 * A config with some of its values replaced.
 *
 * Two levels deep - a section's groups, then a group's tokens - and no deeper.
 * A token's value is replaced whole, so overriding a `[light, dark]` pair with
 * one string gives that string in both schemes.
 */
export function mergeConfig<C extends Contract>(
  base: ThemeConfig<C>,
  overrides: ThemeOverrides<C>,
): ThemeConfig<C> {
  return {
    tokens: mergeGroups(base.tokens, overrides.tokens),
    components: mergeGroups(base.components, overrides.components),
    icons: { ...base.icons, ...overrides.icons },
  } as ThemeConfig<C>;
}

function mergeGroups(base: object | undefined, overrides: object | undefined) {
  const merged: Record<string, object | undefined> = { ...base };

  for (const [group, values] of entriesOf(overrides)) {
    merged[group] = { ...merged[group], ...(values as object) };
  }

  return merged;
}

/**
 * A group's tokens, each with the custom property it compiles to - read off
 * the compiled group itself.
 *
 * At runtime a var group is a plain object of `var(--name)` strings, which is
 * what makes `color.accent` usable as a value in `stylex.create()`, plus
 * StyleX's own bookkeeping, which is not a reference and is skipped.
 */
function propertiesOf(group: AnyVarGroup, section: string): ReadonlyMap<string, Property> {
  const properties = new Map<string, Property>();

  for (const [token, reference] of entriesOf(group)) {
    const property = typeof reference === 'string' ? REFERENCE.exec(reference)?.[1] : undefined;

    if (property !== undefined) {
      properties.set(token, property as Property);
    }
  }

  // Either the StyleX plugin never ran over the contract - rare, since
  // `defineVars()` throws first - or StyleX changed what a compiled variable
  // looks like. Either way no theme can work, so say so here rather than render
  // a page with no theme applied.
  if (properties.size === 0) {
    throw new Error(`Batik: \`${section}\` has no compiled StyleX variables to set.`);
  }

  return properties;
}

function entriesOf(value: unknown): [string, unknown][] {
  return typeof value === 'object' && value !== null ? Object.entries(value) : [];
}

/**
 * SVG markup as the `url()` a CSS mask can take.
 *
 * An SVG loaded as an image is parsed as XML, where markup without its
 * namespace is not an SVG at all - so the namespace is added if it is missing,
 * as it usually is from an `<svg>` copied out of HTML. Percent-encoding the
 * whole thing is longer than escaping only what a data URL forbids, but it
 * cannot be got wrong.
 */
function iconUrl(svg: string): string {
  const markup = svg.trim();
  const namespaced = markup.includes('xmlns=')
    ? markup
    : markup.replace(/^<svg\b/, `<svg ${SVG_NAMESPACE}`);

  return `url("data:image/svg+xml,${encodeURIComponent(namespaced)}")`;
}

/**
 * What a theme that does not match its contract gets by default: a message in
 * the console, not an exception.
 *
 * This is what an app sees after upgrading `@batik-prototype/core` past the
 * theme package it has installed. The app cannot fix it by editing code, only
 * by updating the theme, and throwing would take the whole page down over what
 * is at worst a few properties left unstyled.
 */
function reportMismatch({ theme, missing, unknown }: ContractMismatch): void {
  const lines = [
    `Batik: theme "${theme}" does not match the token contract of the installed @batik-prototype/core.`,
  ];

  if (missing.length > 0) {
    lines.push(`  Not set, so these are left unstyled: ${missing.join(', ')}`);
  }

  if (unknown.length > 0) {
    lines.push(`  Not in the contract, so these do nothing: ${unknown.join(', ')}`);
  }

  lines.push('If the theme comes from a package, update it to a version built for this core.');

  if (missing.length > 0) {
    console.error(lines.join('\n'));
  } else {
    console.warn(lines.join('\n'));
  }
}
