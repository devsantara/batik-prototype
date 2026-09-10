<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://assets.devsantara.com/batik-prototype/logo-dark.png">
    <img alt="@devsantara/batik-prototype logo" src="https://assets.devsantara.com/batik-prototype/logo-light.png" height="128">
  </picture>
  <h1>devsantara/batik-prototype</h1>
  <p>Token-first design system for StyleX.</p>
  <a href="https://github.com/devsantara"><img alt="Made by Devsantara" src="https://img.shields.io/badge/Made_By-Devsantara-0F172A.svg?style=for-the-badge&labelColor=000000"></a>
  <a href="./LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/devsantara/batik-prototype?style=for-the-badge&labelColor=000000"></a>
  <a href="https://github.com/devsantara/batik-prototype/graphs/contributors"><img alt="contributors" src="https://img.shields.io/github/contributors/devsantara/batik-prototype?style=for-the-badge&labelColor=000000"></a>
</div>

## What this is

A themeable design system built on [StyleX](https://stylexjs.com). One set of components,
one token contract, and as many installable themes as you care to write — each a separate
package that gives every token a value, and does nothing else.

**[Live demo](https://devsantara.github.io/batik-prototype/)** — every component, in all
three themes, in light and dark.

```bash
pnpm add @batik-prototype/core @batik-prototype/theme-ocean @stylexjs/stylex
```

```tsx
import { Badge, Button, Card, Input, ThemeProvider } from '@batik-prototype/core';
import { ocean } from '@batik-prototype/theme-ocean';

<ThemeProvider theme={ocean} colorScheme="system">
  <Card>
    <Badge tone="success">Ready</Badge>
    <Input placeholder="Search" />
    <Button>Save</Button>
  </Card>
</ThemeProvider>;
```

## Packages

| Package                                                              | What it is                                                    |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`@batik-prototype/core`](./packages/core#readme)                    | Components, the token contract, and the theme runtime         |
| [`@batik-prototype/theme-classic`](./packages/themes/classic#readme) | Slate and blue, small rounded corners — the one to start from |
| [`@batik-prototype/theme-ocean`](./packages/themes/ocean#readme)     | Near-monochrome slate, one teal accent, fully rounded         |
| [`@batik-prototype/theme-sunset`](./packages/themes/sunset#readme)   | Warm greys, one terracotta accent, square corners, serif      |
| [`@batik-prototype/example`](./apps/example#readme)                  | React + Vite app that consumes all of the above               |
| [`@batik-prototype/config`](./packages/config#readme)                | Shared TypeScript and Vite+ configuration _(internal)_        |
| [`@batik-prototype/create-package`](./tools/create-package#readme)   | The generator behind `vp create package` _(internal)_         |
| [`@batik-prototype/create-theme`](./tools/create-theme#readme)       | The generator behind `vp create theme` _(internal)_           |

[`themes/`](./packages/themes#readme) is the guide to writing a theme of your own.

## How the theming works

`@batik-prototype/core` declares every colour, radius, font and spacing step as a StyleX
variable, unset by default. Components read only those variables. A theme package is
plain data: a value for every one of them, handed to `defineTheme()`, and `<ThemeProvider>`
sets those values on a subtree.

Three consequences are worth stating up front:

- **The default is unstyled, and every theme answers to one contract.** An app
  with no theme renders its components truly unstyled. A theme has to set every token core names, so
  adding one to core stops every theme compiling until it does — and a theme package
  installed against a newer core says at load which tokens it is missing. See
  [the contract](./packages/themes#the-contract).
- **Components cost nothing at runtime.** They read CSS variables, not context, so
  switching a theme re-renders one provider and repaints — it does not re-render the tree.
- **Components are compiled with the app, not before it.** Core ships its StyleX calls
  uncompiled; your bundler's StyleX plugin reads them alongside your own source, and
  `defineTheme()` reads back the variable names it settles on. See
  [Setting up the compiler](./packages/core#setting-up-the-compiler).

## Working in this repo

```bash
vp install            # after every pull
vp check              # format, lint, type check
vp check --fix        # and fix what can be fixed
vp test run
vp run -r build       # every package, plus the publish gates
pnpm dev              # the example app, and watch builds for the packages
```

Every change to a published package needs a changeset — CI fails a PR without one.

```bash
pnpm changeset
```

## Automation

Three workflows, all triggered by a push to `main`. Nothing is versioned, published or
deployed from anyone's machine.

| Workflow                                         | Does                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| [`ci.yml`](./.github/workflows/ci.yml)           | `vp check`, `vp test run`, `vp run -r build`, and the changeset gate |
| [`release.yml`](./.github/workflows/release.yml) | Opens the version PR, then publishes to npm once it merges           |
| [`deploy.yml`](./.github/workflows/deploy.yml)   | Builds the example app and deploys it to GitHub Pages                |

### Releasing

The changesets action drives it, in two passes over the same workflow:

1. A push to `main` with changesets pending opens (or updates) a
   **`chore(release): version packages`** PR. That PR is where `changeset version` runs —
   it bumps the versions, writes each `CHANGELOG.md` and deletes the changesets it
   consumed.
2. Merging that PR leaves no changesets, so the same workflow runs `pnpm run release`
   instead: `vp run -r build` — which is also what runs publint, attw and the
   unused-dependency gate — then `pnpm publish -r`.

Publishing is pnpm rather than `changeset publish` because `publishConfig.exports` and the
`workspace:^` rewrite are pnpm features; npm ignores both and would publish an `exports`
map still pointing at `./src/index.ts`.

Two secrets make it work. `NPM_TOKEN` needs read and write on the `@batik-prototype` scope
and must not be 2FA-gated, since the publish is non-interactive. `GITHUB_TOKEN` is
supplied automatically. Provenance is signed with the workflow's OIDC token, which is why
the job asks for `id-token: write`.

### Deploying

Every push to `main` rebuilds the example app and publishes it to Pages. There is nothing
to switch on first: `configure-pages` enables Pages and points it at Actions on the first
run.

The build reads its base path from that same step rather than hard-coding one, so a rename
or a custom domain needs no edit. It also calls `vp build` directly instead of going
through the `build` task — a task result is cached on its tracked inputs, and a `--base`
flag is not one, so the task could replay a bundle built for `/` whose asset URLs would
all 404 under a project site.
