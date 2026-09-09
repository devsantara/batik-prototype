#!/usr/bin/env node

import path from 'node:path';
import { parseArgs } from 'node:util';

import { THEMES_DIRECTORY, findWorkspaceRoot } from '@batik-prototype/create-package/workspace';
import { runTemplateCLI, type Template } from 'bingo';

import template from '../src/template.ts';

// `vp create` refuses to forward its own `--directory` to a local generator and
// runs this bin from the generator's parent directory, so a bare
// `vp create theme -- --name violet` would otherwise scaffold into tools/.
// Derive the destination from the theme name instead, anchored at the workspace
// root rather than the cwd, and leave an explicit --directory alone.
//
// `strict: false` because everything else on the command line - the template's
// own options, and the `--skip-requests` vp appends - belongs to Bingo, which
// parses process.argv again with the template's schema.
const { values } = parseArgs({
  allowPositionals: true,
  args: process.argv.slice(2),
  options: {
    directory: { type: 'string' },
    name: { type: 'string' },
  },
  strict: false,
});

if (values.directory === undefined && typeof values.name === 'string') {
  const target = path.join(findWorkspaceRoot(), THEMES_DIRECTORY, values.name);

  process.argv.push('--directory', target);
}

// runTemplateCLI accepts the base `Template` type, which is wider than the
// strongly typed template returned by createTemplate(). Cast through `unknown`
// to bridge the two.
process.exitCode = await runTemplateCLI(template as unknown as Template);
