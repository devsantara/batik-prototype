---
'@batik-prototype/core': minor
---

Add the design system: `Button`, `Input`, `Card` and `Badge`, the design token contract
they read from, and the React runtime that applies a theme.

Tokens are StyleX variable groups, published one `.stylex` entry point per concern, so a
theme package can override them by name. `ThemeProvider` applies a theme to a subtree and
resolves `'system'` against the OS; `defineTheme` and `resolveTheme` are the React-free
authoring contract, also available at `@batik-prototype/core/theme`.

The variable defaults are the Classic light palette, so an app that installs nothing else
already renders a finished-looking UI.
