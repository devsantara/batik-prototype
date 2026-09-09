---
'@batik-prototype/math': patch
'@batik-prototype/tokens': patch
---

Ship readable, unminified builds. Minifying a library mangles identifiers in
consumers' stack traces and buys nothing — the consuming app minifies anyway,
with whole-program context a single package cannot have.

Package tarballs now carry `LICENSE` and `CHANGELOG.md` alongside the existing
`README.md`.
