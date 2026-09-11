# `@batik-prototype/create-theme`

The code generator behind `vp create theme`. It scaffolds a Batik theme package under
`packages/themes/` with the workspace conventions already in place — the browser + library tsconfig
pair, the [library build config](../../packages/config#readme), the two hand-written
`exports` maps, and a peer dependency on `@batik-prototype/core`.

## Usage

From anywhere in the workspace:

```bash
# Interactive: pick "theme" from the list, then answer the prompts
vp create

# Or pass the options up front
vp create theme -- --name violet --description "Deep violet with a soft dusk scheme"
```

`--name` is the unscoped, kebab-case name. It decides the published name
(`@batik-prototype/theme-violet`), the directory (`packages/themes/violet`) and the exported
identifier (`violet`, camel-cased from kebab). `vp create` takes it from there: workspace
registration, `pnpm install`, and `vp fmt`.

Afterwards, write a changeset — CI fails a PR that changes a package without one.

```bash
pnpm changeset
```

## The generated theme is complete

The point of difference from
[`create-package`](../create-package#readme), which scaffolds a placeholder: this generator
emits a working theme, not a stub — and it has to. A theme is every value the contract names or it
does not compile; core's own values are all unset. The generated one starts from Classic's
neutrals with a violet accent, plus a violet dark ground, and a violet switch to match —
every component token included, since components are part of the contract like everything
else.

So `vp create theme` followed by `vp run @batik-prototype/example#dev` shows you the new
theme before you have chosen a single colour. Everything after that is editing values in one
file.

## Development

```bash
# Run the generator directly, bypassing vp create
node bin/index.ts --name violet --description "..."

# Cover the template
vp test run tools/create-theme
```

The generator is a [Bingo](https://www.create.bingo) template.
[`src/template.ts`](./src/template.ts) declares the options as Zod schemas and returns the
files to write; [`bin/index.ts`](./bin/index.ts) is the CLI entry. It is registered in the
root `vite.config.ts` under `create.templates`, which is the only place `vp create` looks
for local templates.

The workspace helpers — finding the repo root, reading the root manifest and LICENSE — come
from [`@batik-prototype/create-package/workspace`](../create-package/src/workspace.ts)
rather than being copied. Both generators have to agree on where the workspace root is and
who publishes these packages, and one of them had to own that.

`bin/index.ts` rewrites `process.argv` for the same reason `create-package`'s does; see
[that README](../create-package#why-binindexts-rewrites-processargv).
