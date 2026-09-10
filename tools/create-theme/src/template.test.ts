import * as fs from 'node:fs/promises';
import path from 'node:path';

import { findWorkspaceRoot } from '@batik-prototype/create-package/workspace';
import { type Creation } from 'bingo';
import { describe, expect, it } from 'vite-plus/test';

import template from './template.ts';

type Files = Creation['files'];

const OPTIONS = { description: 'Deep violet with a soft dusk scheme', name: 'deep-violet' };

async function produce() {
  const { files } = await template.produce({ options: OPTIONS });

  return files ?? {};
}

/** Reads one generated file out of the nested creation, or fails loudly. */
function read(files: Files, ...segments: string[]): string {
  let entry: Files[string] = files;

  for (const segment of segments) {
    if (typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`not a directory: ${segments.join('/')}`);
    }

    entry = entry[segment];
  }

  if (typeof entry !== 'string') {
    throw new Error(`not a file: ${segments.join('/')}`);
  }

  return entry;
}

describe('produce', () => {
  it('prefixes the published name and lands the theme under packages/themes/', async () => {
    const manifest: unknown = JSON.parse(read(await produce(), 'package.json'));

    expect(manifest).toMatchObject({
      name: '@batik-prototype/theme-deep-violet',
      version: '0.0.0',
      description: OPTIONS.description,
      homepage:
        'https://github.com/devsantara/batik-prototype/tree/main/packages/themes/deep-violet#readme',
      repository: { directory: 'packages/themes/deep-violet' },
    });
  });

  it('peers on core and StyleX, so both halves compile against one runtime', async () => {
    const manifest: unknown = JSON.parse(read(await produce(), 'package.json'));

    expect(manifest).toMatchObject({
      peerDependencies: {
        '@batik-prototype/core': 'workspace:^',
        '@stylexjs/stylex': '^0.19.0',
      },
      devDependencies: {
        '@batik-prototype/core': 'workspace:*',
        '@stylexjs/stylex': 'catalog:',
      },
    });
  });

  it('writes both exports maps, so pnpm publish can swap source for dist', async () => {
    const manifest: unknown = JSON.parse(read(await produce(), 'package.json'));

    expect(manifest).toMatchObject({
      imports: { '#/*': './src/*.js' },
      exports: { '.': './src/index.ts' },
      publishConfig: { access: 'public', exports: { '.': './dist/index.js' } },
      sideEffects: false,
    });
  });

  it('builds with the StyleX library config rather than the plain one', async () => {
    expect(read(await produce(), 'vite.config.ts')).toBe(
      "export { default } from '@batik-prototype/config/vite/stylex-library';\n",
    );
  });

  it('camel-cases the kebab-case name into the exported identifier', async () => {
    const files = await produce();

    expect(read(files, 'src', 'index.ts')).toBe("export { deepViolet } from '#/deep-violet';\n");
    expect(read(files, 'src', 'deep-violet.ts')).toContain('export const deepViolet =');
  });

  it('generates a theme that already renders, not a stub', async () => {
    const source = read(await produce(), 'src', 'deep-violet.ts');

    // Tokens come from their own `.stylex` entry point - a barrel import would
    // hash to a variable the stylesheet never defines.
    expect(source).toContain("from '@batik-prototype/core/tokens/color.stylex'");
    expect(source).toContain("defineTheme({ name: 'deep-violet', light, dark })");

    // The dark scheme carries its own ground; overriding the accent alone would
    // leave dark text on a dark page.
    expect(source).toContain('background:');
  });

  it('copies the workspace license verbatim', async () => {
    const expected = await fs.readFile(path.join(findWorkspaceRoot(), 'LICENSE'), 'utf8');

    expect(read(await produce(), 'LICENSE')).toBe(expected);
  });
});
