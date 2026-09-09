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
package that overrides the tokens and nothing else.

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

| Package                                                            | What it is                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| [`@batik-prototype/core`](./packages/core#readme)                  | Components, design tokens, and the theme runtime       |
| [`@batik-prototype/theme-classic`](./themes/classic#readme)        | The default theme — slate and blue, plus a dark scheme |
| [`@batik-prototype/theme-ocean`](./themes/ocean#readme)            | Teal and cyan, generously rounded                      |
| [`@batik-prototype/theme-sunset`](./themes/sunset#readme)          | Warm amber and orange, squared off, in a serif         |
| [`@batik-prototype/example`](./apps/example#readme)                | React + Vite app that consumes all of the above        |
| [`@batik-prototype/config`](./packages/config#readme)              | Shared TypeScript and Vite+ configuration _(internal)_ |
| [`@batik-prototype/create-package`](./tools/create-package#readme) | The generator behind `vp create package` _(internal)_  |

[`themes/`](./themes#readme) is the guide to writing a theme of your own.

## How the theming works

`@batik-prototype/core` declares every colour, radius, font and spacing step as a StyleX
variable group. Components read only those variables. A theme package imports the same
groups and overrides them with `stylex.createTheme()`, and `<ThemeProvider>` applies the
result to a subtree.

Two consequences are worth stating up front:

- **Components cost nothing at runtime.** They read CSS variables, not context, so
  switching a theme re-renders one provider and repaints — it does not re-render the tree.
- **Themes are compiled with the app, not before it.** Batik packages ship their StyleX
  calls uncompiled; your bundler's StyleX plugin reads them alongside your own source. That
  is what lets a theme from npm override variables a component package declared. See
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
