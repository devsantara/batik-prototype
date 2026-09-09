import * as fs from 'node:fs/promises';
import path from 'node:path';

import { type Creation } from 'bingo';
import { describe, expect, it } from 'vite-plus/test';

import template from './template.ts';
import { findWorkspaceRoot } from './workspace.ts';

type Files = Creation['files'];

const OPTIONS = { description: 'Color primitives and contrast helpers', name: 'color' };

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
  it('scopes the package name and the directory to the workspace root', async () => {
    const manifest: unknown = JSON.parse(read(await produce(), 'package.json'));

    expect(manifest).toMatchObject({
      name: '@batik/color',
      version: '0.0.0',
      description: OPTIONS.description,
      homepage: 'https://github.com/devsantara/batik/tree/main/packages/color#readme',
      keywords: ['color', 'design system'],
      repository: { directory: 'packages/color' },
    });
  });

  it('writes both exports maps, so pnpm publish can swap source for dist', async () => {
    const manifest: unknown = JSON.parse(read(await produce(), 'package.json'));

    expect(manifest).toMatchObject({
      imports: { '#/*': './src/*.js' },
      exports: { '.': './src/index.ts' },
      publishConfig: { access: 'public', exports: { '.': './dist/index.js' } },
      files: ['dist', 'src', '!src/**/*.test.ts', 'README.md', 'CHANGELOG.md', 'LICENSE'],
      sideEffects: false,
    });
  });

  it('copies the workspace license verbatim', async () => {
    const expected = await fs.readFile(path.join(findWorkspaceRoot(), 'LICENSE'), 'utf8');

    expect(read(await produce(), 'LICENSE')).toBe(expected);
  });

  it('extends the shared browser and library tsconfigs', async () => {
    const tsconfig: unknown = JSON.parse(read(await produce(), 'tsconfig.json'));

    expect(tsconfig).toEqual({
      extends: [
        '@batik/config/typescript/tsconfig.browser.json',
        '@batik/config/typescript/tsconfig.library.json',
      ],
      include: ['src'],
    });
  });

  it('re-exports the shared library build config', async () => {
    expect(read(await produce(), 'vite.config.ts')).toBe(
      "export { default } from '@batik/config/vite/library';\n",
    );
  });

  it('ships a placeholder module reachable through the #/ alias and its test', async () => {
    const files = await produce();

    expect(read(files, 'src', 'index.ts')).toContain("from '#/placeholder'");
    expect(read(files, 'src', 'placeholder.ts')).toContain("'@batik/color'");
    expect(read(files, 'src', 'placeholder.test.ts')).toContain("from 'vite-plus/test'");
  });
});
