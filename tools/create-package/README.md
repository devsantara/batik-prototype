# `@batik/create-package`

The code generator behind `vp create package`. It scaffolds a new publishable
package under `packages/` with this workspace's conventions already in place:
the browser + library tsconfig pair, the one-line `vite.config.ts` re-export of
[`@batik/config/vite/library`](../../packages/config#readme), the two hand-written
`exports` maps, and a placeholder module with a colocated test so the package is
green from the first commit.

## Usage

From anywhere in the workspace:

```bash
# Interactive: pick "package" from the list, then answer the prompts
vp create

# Or pass the options up front
vp create package -- --name color --description "Color primitives and contrast helpers"
```

`--name` is the unscoped, kebab-case name. It decides both the published name
(`@batik/color`) and the directory (`packages/color`). `vp create` takes it from
there: workspace registration, `pnpm install`, and `vp fmt`.

Afterwards, write a changeset - CI fails a PR that changes a package without one.

```bash
pnpm changeset
```

## Development

```bash
# Run the generator directly, bypassing vp create
node bin/index.ts --name color --description "..."

# Cover the template
vp test run tools/create-package
```

The generator is a [Bingo](https://www.create.bingo) template.
[`src/template.ts`](./src/template.ts) declares the options as Zod schemas and
returns the files to write; [`bin/index.ts`](./bin/index.ts) is the CLI entry.
It is registered in the root `vite.config.ts` under `create.templates`, which is
the only place `vp create` looks for local templates.

### Why `bin/index.ts` rewrites `process.argv`

`vp create` rejects its own `--directory` for local generators and runs the bin
with the cwd set to `tools/`, so a bare run would scaffold the new package
beside the generator. The bin derives `--directory` from `--name` instead,
resolved against the workspace root rather than the cwd. Passing `--directory`
explicitly still wins.
