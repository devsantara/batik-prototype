---
'@batik-prototype/core': minor
---

**Breaking:** core ships no default styling at all instead of a default theme, and a theme is built with `defineTheme(name, config)`.

- Token variables default to `initial` — unset — rather than Classic light. An app with no theme renders its components truly unstyled, in the browser's own light or dark; there is no default look.
- `defineTheme(name, { tokens, components, icons })` replaces `defineTheme({ name, base, light, dark })`. A theme is plain data, and complete: every token under `tokens`, `components` and `icons` is required by the config's type — core's defaults are unset, not a base — and any value can be a `[light, dark]` pair.
- `extendTheme(base, name, overrides)` builds a theme from an existing one.
- A theme is checked again at load against the installed core, so a theme package built for an older contract reports the tokens it does not set instead of quietly leaving them unstyled.
- `Accordion`'s chevron is the theme's `icons.chevron`, drawn as a mask, from the new `@batik-prototype/core/tokens/icon.stylex` group.
- `resolveTheme`, `ThemeDefinition` and `ThemeStyles` are removed; a built theme's variables are on `theme.vars`.
