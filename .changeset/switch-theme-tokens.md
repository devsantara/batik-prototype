---
'@batik-prototype/core': minor
'@batik-prototype/theme-classic': minor
'@batik-prototype/theme-ocean': minor
'@batik-prototype/theme-sunset': minor
---

Give `Switch` its own token group, `toggle`, at `@batik-prototype/core/tokens/switch.stylex`: track and knob colours per state, the knob's drop shadow, and separate track and thumb radii. Classic, Ocean and Sunset each override it, so the switch now looks like its theme rather than like the same control recoloured — Ocean keeps a round track over a hairline groove, Sunset squares it into a slot, and both dark schemes invert the knob against a light accent.
