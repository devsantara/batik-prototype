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

  it('peers on core alone, so a theme is checked against the core the app installed', async () => {
    const text = read(await produce(), 'package.json');
    const manifest: unknown = JSON.parse(text);

    expect(manifest).toMatchObject({
      peerDependencies: { '@batik-prototype/core': 'workspace:^' },
      devDependencies: { '@batik-prototype/core': 'workspace:*' },
    });

    // A theme is data. Declaring StyleX would also trip the unused-dependency gate.
    expect(text).not.toContain('@stylexjs/stylex');
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

  it('builds with the plain library config, having no StyleX to ship', async () => {
    expect(read(await produce(), 'vite.config.ts')).toBe(
      "export { default } from '@batik-prototype/config/vite/library';\n",
    );
  });

  it('camel-cases the kebab-case name into the exported identifier', async () => {
    const files = await produce();

    expect(read(files, 'src', 'index.ts')).toBe("export { deepViolet } from '#/deep-violet';\n");
    expect(read(files, 'src', 'deep-violet.ts')).toContain('export const deepViolet =');
  });

  it('generates a complete theme, not a stub', async () => {
    const source = read(await produce(), 'src', 'deep-violet.ts');

    // Data against the contract: one import, no StyleX, no token files.
    expect(source).toContain("import { defineTheme } from '@batik-prototype/core/theme';");
    expect(source).not.toContain('stylex');
    expect(source).toContain("export const deepViolet = defineTheme('deep-violet', {");

    // Every required section: the contract requires all of them.
    for (const section of ['colors:', 'typography:', 'spacing:', 'radius:', 'border:', 'shadow:']) {
      expect(source).toContain(section);
    }

    expect(source).toContain('icons:');
    expect(source).toContain('components:');
    expect(source).toContain('thumbRadius:');

    // A dark scheme, carried as pairs.
    expect(source).toContain("background: ['#f8fafc', '#140f1f'],");
  });

  it('copies the workspace license verbatim', async () => {
    const expected = await fs.readFile(path.join(findWorkspaceRoot(), 'LICENSE'), 'utf8');

    expect(read(await produce(), 'LICENSE')).toBe(expected);
  });
});
