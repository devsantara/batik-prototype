---
'@batik-prototype/core': minor
---

Add `Accordion`, a stack of disclosure rows in the same token-driven shape as the rest of
the set: `contained` groups the rows on one surface and divides them with the border token,
`separated` gives each row its own outline.

It is `<details>` and `<summary>` underneath, so the keyboard, the screen reader and
find-in-page behaviour are the platform's. `exclusive` names the group rather than tracking
which row is open, which is why the rows arrive as an `items` array instead of as children:
nothing has to read the group's name or variant out of React context to render.
