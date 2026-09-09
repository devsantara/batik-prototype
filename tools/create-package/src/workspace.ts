import { existsSync } from 'node:fs';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Where a generated package lands, relative to the workspace root. Matches the
 * `packages/*` glob in pnpm-workspace.yaml.
 */
export const PACKAGES_DIRECTORY = 'packages';

/**
 * Where a generated theme lands. Matches the `themes/*` glob in
 * pnpm-workspace.yaml, and is consumed by `@batik-prototype/create-theme`
 * through this module's `./workspace` export.
 */
export const THEMES_DIRECTORY = 'themes';

/** The file that marks the workspace root. */
const WORKSPACE_MARKER = 'pnpm-workspace.yaml';

// Not `import.meta.dirname`: this module is also loaded by Vitest, whose module
// runner only guarantees `import.meta.url`.
const HERE = path.dirname(fileURLToPath(import.meta.url));

/**
 * The subset of the root manifest a generated package inherits, so the
 * workspace stays the single source of truth for who publishes these packages
 * and where they live.
 */
export interface RootManifest {
  author: string;
  bugs: { url: string };
  homepage: string;
  license: string;
  name: string;
  repository: { type: string; url: string };
}

/**
 * Walks up from `from` until it finds the workspace root.
 *
 * `vp create` runs a local generator with its cwd set to the generator's parent
 * directory rather than the workspace root, so every path this generator
 * resolves is anchored here instead of at `process.cwd()`.
 */
export function findWorkspaceRoot(from: string = HERE): string {
  let directory = from;

  while (!existsSync(path.join(directory, WORKSPACE_MARKER))) {
    const parent = path.dirname(directory);

    if (parent === directory) {
      throw new Error(`batik: no ${WORKSPACE_MARKER} found above ${from}`);
    }

    directory = parent;
  }

  return directory;
}

/**
 * Reads the workspace root's `package.json` and `LICENSE`.
 *
 * Generated packages copy both rather than hard-coding them, so a change to the
 * author, the repository URL or the license text reaches the next package
 * without a matching edit here.
 */
export async function readWorkspace(
  root: string = findWorkspaceRoot(),
): Promise<{ license: string; manifest: RootManifest }> {
  const [manifest, license] = await Promise.all([
    fs.readFile(path.join(root, 'package.json'), 'utf8'),
    fs.readFile(path.join(root, 'LICENSE'), 'utf8'),
  ]);

  return { license, manifest: JSON.parse(manifest) as RootManifest };
}
