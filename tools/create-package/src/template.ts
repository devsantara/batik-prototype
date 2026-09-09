import path from 'node:path';

import { createTemplate } from 'bingo';
import { z } from 'zod';

import pkgJson from '../package.json' with { type: 'json' };
import { PACKAGES_DIRECTORY, readWorkspace, type RootManifest } from './workspace.ts';

/**
 * npm allows far more than this, but every package in this workspace is a
 * lowercase kebab-case word that doubles as its directory name.
 */
const NAME_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

/**
 * The version a generated package starts at. Changesets owns every number after
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
      .regex(NAME_PATTERN, 'Use a lowercase kebab-case name, without the scope (e.g. `color`)')
      .describe('Package name without the scope, and the directory name under packages/'),
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

    const directory = `${PACKAGES_DIRECTORY}/${options.name}`;

    // The workspace root is `batik-prototype` and its packages are `@batik-prototype/*`, so the
    // scope is the root package name rather than a second thing to keep in sync.
    const packageName = `@${manifest.name}/${options.name}`;

    return {
      files: {
        LICENSE: license,
        'README.md': readme(packageName, options.description),
        'package.json': json(
          packageManifest({
            description: options.description,
            directory,
            name: options.name,
            packageName,
            root: manifest,
          }),
        ),
        // Written out rather than stringified so it lands exactly as `vp fmt`
        // would leave it: the environment preset first, the library overlay -
        // which is what turns on `declaration` - second.
        'tsconfig.json': `{
  "extends": [
    "@batik-prototype/config/typescript/tsconfig.browser.json",
    "@batik-prototype/config/typescript/tsconfig.library.json"
  ],
  "include": ["src"]
}
`,
        // The shared config carries the whole `pack` policy and the build/dev
        // tasks. Override it by merging a local config over this one; see
        // packages/tokens for an example.
        'vite.config.ts': "export { default } from '@batik-prototype/config/vite/library';\n",
        src: {
          'index.ts': `export { PACKAGE_NAME } from '#/placeholder';\n`,
          'placeholder.ts': placeholder(packageName),
          'placeholder.test.ts': placeholderTest(packageName),
        },
      },
      // `vp create` only wires a generated package into the workspace when it
      // was handed a `--directory` itself, which it never is here - bin/index.ts
      // derives one instead. Install from the new package: pnpm picks it up
      // through the `packages/*` glob and links @batik-prototype/config.
      scripts: ['vp install'],
      suggestions: [
        `Write the first changeset for ${packageName}: pnpm changeset`,
        `Replace src/placeholder.ts and its test with the package's first real export`,
      ],
    };
  },
});

function json(value: unknown): string {
  return `${JSON.stringify(value, undefined, 2)}\n`;
}

/**
 * The manifest every publishable package in this workspace shares.
 *
 * The two `exports` maps are deliberate and hand-written: the top-level one
 * points at source so a sibling package resolves this one without a build, and
 * `pnpm publish` swaps in `publishConfig.exports` so consumers get `dist`. See
 * packages/math/README.md for the full reasoning behind each field.
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
    keywords: [name, 'design system'].sort(),
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
    devDependencies: { '@batik-prototype/config': 'workspace:*' },
  };
}

function placeholder(packageName: string): string {
  return `/**
 * Placeholder export, so a freshly generated package builds, type checks and
 * tests green before it has any content of its own. Delete this file and its
 * test alongside the first real export.
 */
export const PACKAGE_NAME = '${packageName}';
`;
}

function placeholderTest(packageName: string): string {
  return `import { describe, expect, it } from 'vite-plus/test';

import { PACKAGE_NAME } from '#/placeholder';

describe('PACKAGE_NAME', () => {
  it('is the published package name', () => {
    expect(PACKAGE_NAME).toBe('${packageName}');
  });
});
`;
}

function readme(packageName: string, description: string): string {
  return `# \`${packageName}\`

${description}

\`\`\`ts
import { PACKAGE_NAME } from '${packageName}';
\`\`\`

| Export         | Signature |
| -------------- | --------- |
| \`PACKAGE_NAME\` | \`string\`  |

## Scripts

\`\`\`bash
vp run build          # vp pack - production build, then attw + publint + unused
vp run dev            # vp pack --watch
vp test run           # from the repo root, runs this package's tests too
\`\`\`

[\`@batik-prototype/math\`](../math#readme) documents why a package in this repo is wired
the way it is - the tsconfig split, the two \`exports\` maps, and the \`#/\` alias.
`;
}
