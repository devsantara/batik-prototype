import path from 'node:path';

import {
  readWorkspace,
  THEMES_DIRECTORY,
  type RootManifest,
} from '@batik-prototype/create-package/workspace';
import { createTemplate } from 'bingo';
import { z } from 'zod';

import pkgJson from '../package.json' with { type: 'json' };

/** The same lowercase kebab-case shape every other package in this workspace uses. */
const NAME_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/**
 * The version a generated theme starts at. Changesets owns every number after
 * this one, and the first release takes it to `0.1.0`.
 */
const INITIAL_VERSION = '0.0.0';

/** The `@stylexjs/stylex` range a generated theme peers on, matching the rest of the repo. */
const STYLEX_RANGE = '^0.19.0';

export default createTemplate({
  about: {
    name: pkgJson.name,
    description: pkgJson.description,
  },

  options: {
    name: z
      .string()
      .regex(NAME_PATTERN, 'Use a lowercase kebab-case name, without the scope (e.g. `violet`)')
      .describe(
        'Theme name without the `theme-` prefix, and the directory name under packages/themes/',
      ),
    description: z
      .string()
      .min(1)
      .describe('One-line description, used in package.json and the README heading'),
  },

  prepare({ options }) {
    return {
      // `bin/index.ts` derives the target directory from `--name` for the
      // flag-driven path. Interactively it runs the other way round: Bingo asks
      // for the directory before it asks for any option, so take the name from
      // whatever directory was chosen rather than asking for it twice.
      name: () => {
        const { directory } = options as { directory?: string };

        return options.name ?? (directory === undefined ? undefined : path.basename(directory));
      },
    };
  },

  async produce({ options }) {
    const { license, manifest } = await readWorkspace();

    const directory = `${THEMES_DIRECTORY}/${options.name}`;

    // The workspace root is `batik-prototype` and its packages are
    // `@batik-prototype/*`, so the scope is the root package name rather than a
    // second thing to keep in sync. Themes carry a `theme-` prefix so
    // `@batik-prototype/theme-violet` reads as one on an install line.
    const packageName = `@${manifest.name}/theme-${options.name}`;

    return {
      files: {
        LICENSE: license,
        'README.md': readme(packageName, options.name, options.description),
        'package.json': json(
          packageManifest({
            description: options.description,
            directory,
            name: options.name,
            packageName,
            root: manifest,
          }),
        ),
        'tsconfig.json': `{
  "extends": [
    "@batik-prototype/config/typescript/tsconfig.browser.json",
    "@batik-prototype/config/typescript/tsconfig.library.json"
  ],
  "include": ["src"]
}
`,
        // Not the plain library config: a StyleX package ships its
        // `createTheme()` calls for the consuming app to compile, so it builds
        // unminified. See packages/config#the-stylex-variant.
        'vite.config.ts':
          "export { default } from '@batik-prototype/config/vite/stylex-library';\n",
        src: {
          'index.ts': `export { ${exportName(options.name)} } from '#/${options.name}';\n`,
          [`${options.name}.ts`]: theme(options.name),
        },
      },
      // `vp create` only wires a generated package into the workspace when it
      // was handed a `--directory` itself, which it never is here - bin/index.ts
      // derives one instead. Install from the new theme: pnpm picks it up
      // through the `packages/themes/*` glob and links @batik-prototype/core.
      scripts: ['vp install'],
      suggestions: [
        `Write the first changeset for ${packageName}: pnpm changeset`,
        `Retint packages/themes/${options.name}/src/${options.name}.ts - the generated theme already renders`,
        `Add ${exportName(options.name)} to the theme picker in apps/example/src/app.tsx`,
      ],
    };
  },
});

function json(value: unknown): string {
  return `${JSON.stringify(value, undefined, 2)}\n`;
}

/** `deep-violet` -> `deepViolet`, so the generated file exports a usable identifier. */
function exportName(name: string): string {
  const [first = '', ...rest] = name.split('-');

  return first + rest.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

/**
 * The manifest every theme package shares.
 *
 * `@batik-prototype/core` and `@stylexjs/stylex` are peers rather than
 * dependencies, and that is what makes a theme work: both halves have to be
 * compiled against one copy of StyleX, or the variables a theme overrides hash
 * differently from the ones the components read. Declaring StyleX as a peer is
 * also what puts a theme on the list of packages the StyleX plugin transforms.
 */
function packageManifest(context: {
  description: string;
  directory: string;
  name: string;
  packageName: string;
  root: RootManifest;
}) {
  const { description, directory, name, packageName, root } = context;

  return {
    name: packageName,
    version: INITIAL_VERSION,
    description,
    // Sorted, because `sortPackageJson` in the root `fmt` config sorts them
    // anyway - emit what the formatter would leave behind.
    keywords: [name, 'design system', 'design tokens', 'stylex', 'theme'].sort(),
    homepage: `${root.homepage.replace(/#readme$/, '')}/tree/main/${directory}#readme`,
    bugs: root.bugs,
    license: root.license,
    author: root.author,
    repository: { ...root.repository, directory },
    files: ['dist', 'src', '!src/**/*.test.ts', 'README.md', 'CHANGELOG.md', 'LICENSE'],
    type: 'module',
    sideEffects: false,
    imports: { '#/*': './src/*.js' },
    exports: {
      '.': './src/index.ts',
      './package.json': './package.json',
    },
    publishConfig: {
      exports: {
        '.': './dist/index.js',
        './package.json': './package.json',
      },
      access: 'public',
    },
    peerDependencies: {
      '@batik-prototype/core': 'workspace:^',
      '@stylexjs/stylex': STYLEX_RANGE,
    },
    devDependencies: {
      '@batik-prototype/config': 'workspace:*',
      '@batik-prototype/core': 'workspace:*',
      '@stylexjs/stylex': 'catalog:',
    },
  };
}

/**
 * A complete, working theme rather than a stub.
 *
 * The light scheme changes only the accent, because every other default in
 * `@batik-prototype/core` is already a finished palette - so a freshly generated
 * theme renders correctly before anyone has decided anything. The dark scheme
 * has to say more: a dark accent over the default near-white surfaces would be
 * unreadable, so it carries a neutral dark ground to retint.
 */
function theme(name: string): string {
  return `import { defineTheme } from '@batik-prototype/core/theme';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import * as stylex from '@stylexjs/stylex';

// Anything this theme does not override keeps its default from
// @batik-prototype/core, which is a complete palette - so only the accent needs
// to change for the theme to look like its own thing. The full list of what you
// can reach is in packages/themes/README.md.
const light = stylex.createTheme(color, {
  accent: '#7c3aed',
  accentHover: '#6d28d9',
  accentActive: '#5b21b6',
  onAccent: '#ffffff',

  ring: '#8b5cf6',
  accentSurface: '#ede9fe',
  onAccentSurface: '#5b21b6',
});

// The dark scheme has to carry its own ground: the defaults are a light palette,
// so overriding the accent alone would leave dark text on a dark page.
//
// Delete this call and the \`dark\` slot below for a light-only theme. \`schemes\`
// then reports ['light'] and a scheme toggle can disable itself.
const dark = stylex.createTheme(color, {
  background: '#140f1f',
  surface: '#1e1730',
  surfaceHover: '#2a2142',

  foreground: '#ede9fe',
  muted: '#a99fc4',

  border: '#2a2142',
  borderStrong: '#3d3159',
  ring: '#a78bfa',

  accent: '#a78bfa',
  accentHover: '#c4b5fd',
  accentActive: '#ddd6fe',
  onAccent: '#140f1f',

  danger: '#fb7185',

  neutralSurface: '#2a2142',
  onNeutralSurface: '#ddd6fe',
  accentSurface: '#3d3159',
  onAccentSurface: '#ddd6fe',
  successSurface: '#14532d',
  onSuccessSurface: '#bbf7d0',
  warningSurface: '#713f12',
  onWarningSurface: '#fde68a',
  dangerSurface: '#881337',
  onDangerSurface: '#fecdd3',
});

// A third slot, \`base\`, applies in every scheme - radii, type, spacing. See
// packages/themes/ocean for one that uses it.
export const ${exportName(name)} = defineTheme({ name: '${name}', light, dark });
`;
}

function readme(packageName: string, name: string, description: string): string {
  return `# \`${packageName}\`

${description}

\`\`\`bash
pnpm add ${packageName}
\`\`\`

\`\`\`tsx
import { ThemeProvider } from '@batik-prototype/core';
import { ${exportName(name)} } from '${packageName}';

<ThemeProvider theme={${exportName(name)}} colorScheme="system">
  {children}
</ThemeProvider>;
\`\`\`

| Slot    | Overrides |
| ------- | --------- |
| \`base\`  | nothing   |
| \`light\` | \`color\`   |
| \`dark\`  | \`color\`   |

## Next

The generated theme already renders - retint it in
[\`src/${name}.ts\`](./src/${name}.ts), then widen it. \`shadow\`, \`radius\`, \`font\`
and \`space\` are all overridable; [\`themes/\`](../README.md) explains which slot each
one belongs in and why.

## Scripts

\`\`\`bash
vp run build          # vp pack - production build, then attw + publint + unused
vp run dev            # vp pack --watch
\`\`\`
`;
}
