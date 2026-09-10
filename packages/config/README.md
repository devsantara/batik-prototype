# `@batik-prototype/config`

Every shared build configuration in the Batik monorepo: the TypeScript presets and the
Vite+ build config. Internal (`private`), consumed through `workspace:*`.

```
src/typescript/   tsconfig presets, extended by each package's tsconfig.json
src/vite/         Vite+ configs, re-exported by each package's vite.config.ts
```

Everything shipped lives under `src/`, the same shape as every other package in the repo,
so `package.json`, `tsconfig.json` and `README.md` are the only files at the root. `src/`
is a source directory in the loose sense here — nothing is compiled out of it. The
tsconfigs are data and the Vite+ configs are consumed as raw TypeScript, so what a
consumer resolves is the file as written.

The two halves are independent — a package can use either on its own — but they are
deliberately kept in step with each other. `vite.library.config.ts` pins `target: es2022`
because `tsconfig.browser.json` type-checks against `lib: ES2022`; the root
`vite.config.ts` scopes oxlint's `node` env to the same files `tsconfig.node.json`
grants `@types/node` to. Splitting them across two packages made those pairings easy to
drift apart.

## TypeScript

The presets split along the two axes that actually vary across the repo — **where code
runs** and **whether it publishes types** — so each file has exactly one job.

| File                    | Subpath                                                    | Adds                                               |
| ----------------------- | ---------------------------------------------------------- | -------------------------------------------------- |
| `tsconfig.base.json`    | `@batik-prototype/config/typescript/tsconfig.base.json`    | Strictness, module semantics, check-only emit      |
| `tsconfig.browser.json` | `@batik-prototype/config/typescript/tsconfig.browser.json` | `lib: ES2022 + DOM`, on top of `base`              |
| `tsconfig.node.json`    | `@batik-prototype/config/typescript/tsconfig.node.json`    | `lib: ES2024`, `types: ["node"]`, on top of `base` |
| `tsconfig.react.json`   | `@batik-prototype/config/typescript/tsconfig.react.json`   | `jsx: react-jsx`, on top of `browser`              |
| `tsconfig.library.json` | `@batik-prototype/config/typescript/tsconfig.library.json` | `declaration`, `declarationMap` _(overlay)_        |

The subpaths keep the filename but hide `src/`, so moving a file never moves the specifier
consumers write. That does mean `extends` resolves **only** through `exports` — the key no
longer matches its own path, so a resolver that falls back to a literal directory lookup
finds nothing. Verified against both checkers this repo runs: tsgolint (`vp check`) and
`tsc` 7.0.2 resolve it, and `tsc --showConfig` on `@batik-prototype/theme-ocean` confirms the whole
`base` → `browser` → `library` chain is applied rather than silently skipped. A tool
pinned to classic `node10` resolution would not find these; nothing here is.

`tsconfig.library.json` is an **overlay**, not a standalone config. It carries no environment, so
it is always listed _after_ an environment config in an `extends` array (TypeScript 5.0+;
later entries win).

### Recipes

Token, theme, and utility packages — publishable, no JSX:

```jsonc
// packages/themes/ocean/tsconfig.json
{
  "extends": [
    "@batik-prototype/config/typescript/tsconfig.browser.json",
    "@batik-prototype/config/typescript/tsconfig.library.json",
  ],
  "include": ["src"],
}
```

Component and hook packages — publishable, JSX:

```jsonc
// packages/core/tsconfig.json
{
  "extends": [
    "@batik-prototype/config/typescript/tsconfig.react.json",
    "@batik-prototype/config/typescript/tsconfig.library.json",
  ],
  "include": ["src"],
}
```

Docs and example apps — not published, so no `tsconfig.library.json`:

```jsonc
// apps/docs/tsconfig.json
{
  "extends": "@batik-prototype/config/typescript/tsconfig.react.json",
  "compilerOptions": {
    // `types` is `[]` by default; apps opt into the ambient types they need.
    "types": ["vite/client"],
  },
  "include": ["src"],
}
```

CLIs, codemods, and other Node-only packages:

```jsonc
{
  "extends": [
    "@batik-prototype/config/typescript/tsconfig.node.json",
    "@batik-prototype/config/typescript/tsconfig.library.json",
  ],
  "include": ["src"],
}
```

Every package needs its own `tsconfig.json`. `include` stays in the package because it is
the one thing the shared configs cannot guess; `exclude` is inherited from `tsconfig.base.json` and
already covers `node_modules`, `dist`, `build`, `coverage`, `.next`, and `.output`.

**Keep `vite.config.ts` out of a package's `include`.** It is tempting to add it so the
build config is type-checked, but a package's program is a browser program with
`types: []`, and `vite.config.ts` imports Vite+, whose declarations reference Node's types.
TypeScript merges ambient globals across a whole program, so one config file pulls
`process`, `Buffer` and `__dirname` into scope for every file in `src` — and the isolation
these presets are built to enforce fails open, silently. The root `tsconfig.json` picks up
`packages/*/vite.config.ts` as a Node program instead, so the build configs are still
checked, just not in the same program as the code they build.

### Decisions worth knowing

**TypeScript only type-checks.** `noEmit` is on everywhere. tsdown (`vp pack`) builds the
packages and Vite (`vp build`) builds the apps. `tsconfig.library.json` still sets `declaration` and
`declarationMap` because tsdown _reads_ those flags to decide what to generate — it never
asks `tsc` to emit.

**No `baseUrl`, no `paths`.** tsgolint — the type checker behind `vp check` — does not
support `baseUrl`, and Vite+ will silently disable type-aware linting if it finds one. Use
the `imports` field in a package's `package.json` for internal aliases (`#/…`), which the
root `vite.config.ts` already treats as the internal import group:

```jsonc
// packages/<name>/package.json
{
  "imports": {
    "#/*": "./src/*.js",
  },
}
```

The `.js` extension is load-bearing and counter-intuitive. An extensionless target
(`"./src/*"`) resolves in no tool at all, and `"./src/*.ts"` reaches `.ts` files but not
`.tsx`, so it breaks the moment a component is added. `.js` is the specifier TypeScript
maps back onto `.ts` _and_ `.tsx` sources, and Vite resolves it the same way. The alias is
source-only: tsdown inlines it, so `#/` never appears in `dist`.

**Bundler module resolution.** `module: "preserve"` + `moduleResolution: "bundler"`,
because every file here is processed by Rolldown before anyone runs it. Relative imports
therefore need no `.js` extension. A package that is genuinely executed by Node without a
bundle step should override `"module": "nodenext"`.

**`target`/`lib` is a shipping contract, not a preference.** `tsconfig.browser.json` pins ES2022 —
the floor Batik ships against. Raising it raises the syntax and APIs every consumer's
browser must support. `tsconfig.node.json` uses ES2024 to match the Node 24 pinned in the root
`devEngines`.

**`types: []` by default.** Ambient type packages are opted into, never inherited by
accident, so browser code cannot quietly reach for Node globals. This only holds if the
package's program contains no Node-typed file — see the note on `vite.config.ts` above.
The root `vite.config.ts` scopes oxlint's `node` env the same way, so the lint layer and
the type layer agree on which files may use Node globals.

**Strictness** is `@tsconfig/strictest` plus TypeScript 7's own `tsc --init`
recommendations, with `erasableSyntaxOnly` added: no `enum`, no `namespace`, no parameter
properties — the constructs Rolldown and Node's type stripping cannot erase.

### Two opinionated flags left off

Both are one line to turn on, per package or in the shared config.

**`noPropertyAccessFromIndexSignature`** — part of `@tsconfig/strictest`, but TypeScript
classifies it as a style option and it forces `process.env['NODE_ENV']` and
`import.meta.env['VITE_X']` bracket access everywhere. Off by default.

**`isolatedDeclarations`** — makes tsdown generate `.d.ts` with oxc instead of `tsc`, which
is dramatically faster, and forces every export to carry an explicit type. The cost is
real: `export function f(x: number) { return x + 1 }` becomes an error until it is
annotated. `tsconfig.library.json` already sets `declaration`, which this option requires, so opting
in is exactly:

```jsonc
{
  "extends": [
    "@batik-prototype/config/typescript/tsconfig.react.json",
    "@batik-prototype/config/typescript/tsconfig.library.json",
  ],
  "compilerOptions": { "isolatedDeclarations": true },
}
```

### Notes

`declarationMap` is on for published packages so that go-to-definition lands on real source
across the workspace. For that to keep working after publish, a package must ship its
sources — `"files": ["dist", "src"]`.

Requires TypeScript >= 5.8 (`${configDir}` needs 5.5, `erasableSyntaxOnly` needs 5.8). The
workspace pins 7.0.2.

## Vite+

One file per package shape, the same way the tsconfigs split by environment.

| File                            | Subpath                                       | For                                     |
| ------------------------------- | --------------------------------------------- | --------------------------------------- |
| `vite.library.config.ts`        | `@batik-prototype/config/vite/library`        | Publishable packages built by `vp pack` |
| `vite.stylex-library.config.ts` | `@batik-prototype/config/vite/stylex-library` | Publishable packages that author StyleX |

Each file is a config object, not a factory — the same relationship `tsconfig.library.json` has to a
package's tsconfig. Every publishable package's `vite.config.ts` is exactly this:

```ts
export { default } from '@batik-prototype/config/vite/library';
```

It carries both halves of a package build: the `pack` policy that tsdown reads, and the
`build` / `dev` tasks that `vp run` reads.

### The StyleX variant

`vite.stylex-library.config.ts` is `vite.library.config.ts` with `minify` turned off, and it
is the config every runtime Batik package uses — `@batik-prototype/core` and all three
themes.

The reason is that a StyleX package does not ship compiled CSS. It ships its
`stylex.create()`, `defineVars()` and `createTheme()` calls intact, and the _consuming_
app's StyleX plugin reads them out of `dist`, hashes them, and emits one stylesheet for the
whole dependency graph. That is what lets a theme installed from npm override variables a
component package declared.

Minification is not known to break that — object keys and the StyleX import binding both
survive it — but it turns the one input a downstream build depends on into something no
human can check when a variable fails to resolve. Shipping it readable costs nothing: the
app minifies afterwards anyway, with whole-program context a single package cannot have.

### Overriding

Merge a local config over it. `mergeConfig` deep merges and the **second argument wins**, so
a package overrides just what it needs:

```ts
import libraryConfig from '@batik-prototype/config/vite/library';
import { defineConfig, mergeConfig } from 'vite-plus';

export default mergeConfig(
  libraryConfig,
  defineConfig({
    pack: { target: 'es2020' },
    run: { tasks: { docs: { command: 'typedoc' } } },
  }),
);
```

The local `target` replaces the shared one, and `docs` lands alongside the shared `build`
and `dev` tasks.

One sharp edge: `mergeConfig` **concatenates arrays** rather than replacing them, so a local
`pack.entry` adds to the default rather than replacing it — a package merging
`entry: ['src/css.ts']` builds both `src/index.ts` and `src/css.ts`. That is usually what
you want. A package that needs a different set outright has to spread instead of merge:

```ts
export default defineConfig({
  ...libraryConfig,
  pack: { ...libraryConfig.pack, entry: ['src/cli.ts'] },
});
```

### Why a config object and not a plugin

A Vite plugin is the more idiomatic home for shared behavior, and it half-works — a plugin's
`config` hook can supply `pack`. Two things ruled it out, both verified against Vite+ 0.3.1:

- **`run.tasks` never reaches the plugin pipeline.** The task graph is resolved statically,
  before any plugin runs; the `config` hook does not execute on that path at all. A plugin
  that returns `run.tasks` leaves `vp run` listing no tasks for the package and
  `vp run build` reporting `Task "build" not found`. Merging a config object works because
  it happens at config-evaluation time, so the exported object already contains the tasks.
- **A plugin's `pack` block wins over the package's own.** Vite merges plugin-returned
  config _over_ user config, so a package writing `pack: { target: 'es2015' }` silently
  keeps the plugin's value. Shared policy a package cannot locally override is backwards.
  `mergeConfig` has the precedence the right way round for free.

### Decisions worth knowing

**Only non-defaults are set.** `format` is already esm, and `treeshake`, `clean`, `report`
and `failOnWarn` are already on. Anything absent is already correct.

**`minify` stays off.** Libraries ship readable code. Minifying here mangles identifiers in
consumers' stack traces and buys nothing — the consuming app minifies anyway, with
whole-program context a single package cannot have.

**`platform: 'neutral'`.** tsdown defaults to `node`, which resolves Node builtins and picks
Node main fields. A design-system package has to run anywhere. This also sets the output
extensions to `.js`/`.d.ts`, which is what the `publishConfig.exports` maps point at.

**`target: 'es2022'` is pinned explicitly.** Left alone, tsdown reads `engines.node`, and
with no `engines` field it downlevels nothing. Pinning it to the same floor
`tsconfig.browser.json` type-checks against keeps the shipped syntax and the checked
syntax in step.

**The three publish gates are promoted to errors.** publint, attw and unplugin-unused are
all off by default, and attw and unused default to _warn_ — they print the problem and then
exit 0, so a package shipping no type declarations at all would sail through CI.
`level: 'error'` makes them fail the build. All three resolve from the workspace root's
devDependencies.

**`build` is a task, not a script.** Tasks are cached by default and scripts are not, and a
name can only be one or the other. `input: [{ auto: true }, '!dist/**']` keeps the output a
build just wrote from invalidating the fingerprint that produced it. `dev` opts out of
caching entirely, since a watcher never exits 0.

### Note

These files are loaded by Vite+'s config loader as raw source, which resolves specifiers
literally — it does not apply TypeScript's `.js` → `.ts` mapping that the bundler does. The
repo-wide `#/*` alias therefore does not resolve here.

Relative imports between them do work, as long as they name the `.ts` file they actually
mean — which is how `vite.stylex-library.config.ts` builds on `vite.library.config.ts`
instead of copying it. TypeScript rejects a `.ts` specifier by default, so this package's
own `tsconfig.json` turns on `allowImportingTsExtensions`. That is safe because `noEmit` is
on everywhere: nothing downstream ever sees the specifier.
