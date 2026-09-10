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
        // The plain library config, not the StyleX one: a theme is data, with
        // no StyleX calls in it for a consuming app to compile.
        'vite.config.ts': "export { default } from '@batik-prototype/config/vite/library';\n",
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
 * `@batik-prototype/core` is a peer rather than a dependency, and that is what
 * makes a theme work: `defineTheme()` checks a theme against the contract of
 * whichever core the app installed, so there has to be exactly one. A theme
 * has no StyleX of its own to declare - it is data, and core brings the StyleX
 * it is checked against.
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
    },
    devDependencies: {
      '@batik-prototype/config': 'workspace:*',
      '@batik-prototype/core': 'workspace:*',
    },
  };
}

/**
 * A complete, working theme rather than a stub.
 *
 * Complete because it has to be: the contract's types refuse a theme that
 * leaves a token out, and core's own values are all unset. It starts from Classic's neutrals with a violet accent, plus a violet
 * dark ground, so a freshly generated theme renders correctly before anyone
 * has decided anything. It sets every
 * component token too: components are part of the contract like everything
 * else.
 */
function theme(name: string): string {
  return `import { defineTheme } from '@batik-prototype/core/theme';

// A complete theme: every token the contract names has a value, because the
// contract requires one - core's own values are all unset. It starts as Classic with a violet accent and a violet dark ground -
// retint it from here.
//
// A value is one string for both schemes or a [light, dark] pair. Write every
// value as one string for a light-only theme; schemes then reports ['light']
// and a scheme toggle can disable itself. The contract is explained in
// packages/themes/README.md.
export const ${exportName(name)} = defineTheme('${name}', {
  tokens: {
    colors: {
      background: ['#f8fafc', '#140f1f'],
      surface: ['#ffffff', '#1e1730'],
      surfaceHover: ['#f1f5f9', '#2a2142'],

      foreground: ['#0f172a', '#ede9fe'],
      muted: ['#64748b', '#a99fc4'],

      border: ['#e2e8f0', '#2a2142'],
      borderStrong: ['#cbd5e1', '#3d3159'],
      ring: ['#8b5cf6', '#a78bfa'],

      accent: ['#7c3aed', '#a78bfa'],
      accentHover: ['#6d28d9', '#c4b5fd'],
      accentActive: ['#5b21b6', '#ddd6fe'],
      onAccent: ['#ffffff', '#140f1f'],

      danger: ['#dc2626', '#fb7185'],

      neutralSurface: ['#f1f5f9', '#2a2142'],
      onNeutralSurface: ['#334155', '#ddd6fe'],
      accentSurface: ['#ede9fe', '#3d3159'],
      onAccentSurface: ['#5b21b6', '#ddd6fe'],
      successSurface: ['#dcfce7', '#14532d'],
      onSuccessSurface: ['#166534', '#bbf7d0'],
      warningSurface: ['#fef3c7', '#713f12'],
      onWarningSurface: ['#92400e', '#fde68a'],
      dangerSurface: ['#fee2e2', '#881337'],
      onDangerSurface: ['#991b1b', '#fecdd3'],
    },

    typography: {
      family:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      familyMono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',

      sizeSm: '0.8125rem',
      sizeMd: '0.9375rem',
      sizeLg: '1.0625rem',

      weightRegular: '400',
      weightMedium: '500',
      weightSemibold: '600',

      lineHeightTight: '1.25',
      lineHeightNormal: '1.5',

      trackingWide: '0.01em',
    },

    spacing: { xs: '4px', sm: '6px', md: '10px', lg: '14px', xl: '20px', xxl: '28px' },

    radius: { sm: '3px', md: '4px', lg: '6px', pill: '4px' },

    border: { width: '1px', widthStrong: '2px' },

    shadow: {
      sm: ['0 1px 2px rgba(15, 23, 42, 0.06)', '0 1px 2px rgba(0, 0, 0, 0.5)'],
      md: ['0 2px 8px rgba(15, 23, 42, 0.08)', '0 2px 8px rgba(0, 0, 0, 0.55)'],
      lg: ['0 12px 32px rgba(15, 23, 42, 0.12)', '0 12px 32px rgba(0, 0, 0, 0.6)'],
    },
  },

  components: {
    switch: {
      trackOff: ['#e2e8f0', '#2a2142'],
      trackOn: ['#7c3aed', '#a78bfa'],
      borderOff: ['#cbd5e1', '#3d3159'],
      borderOn: ['#7c3aed', '#a78bfa'],
      thumbOff: ['#ffffff', '#a99fc4'],
      thumbOn: ['#ffffff', '#140f1f'],
      thumbShadow: ['0 1px 2px rgba(15, 23, 42, 0.2)', '0 1px 2px rgba(0, 0, 0, 0.5)'],
      trackRadius: '4px',
      thumbRadius: '2px',
    },
  },

  icons: {
    chevron:
      '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>',
  },
});
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

| Section        | Sets                                      |
| -------------- | ----------------------------------------- |
| \`tokens\`     | every token, colours and shadows as pairs |
| \`components\` | every token - the switch                  |
| \`icons\`      | \`chevron\`                               |

## Next

The generated theme is complete and already renders - retint it in
[\`src/${name}.ts\`](./src/${name}.ts). Every token has a value because the contract
requires one; [\`themes/\`](../README.md) explains the contract, the \`[light, dark]\` pairs,
and when a theme should name a component token.

## Scripts

\`\`\`bash
vp run build          # vp pack - production build, then attw + publint + unused
vp run dev            # vp pack --watch
\`\`\`
`;
}
