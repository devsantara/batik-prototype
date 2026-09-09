# `@batik-prototype/ayam`

hanya seekor ayam

```ts
import { PACKAGE_NAME } from '@batik-prototype/ayam';
```

| Export         | Signature |
| -------------- | --------- |
| `PACKAGE_NAME` | `string`  |

## Scripts

```bash
vp run build          # vp pack - production build, then attw + publint + unused
vp run dev            # vp pack --watch
vp test run           # from the repo root, runs this package's tests too
```

[`@batik-prototype/math`](../math#readme) documents why a package in this repo is wired
the way it is - the tsconfig split, the two `exports` maps, and the `#/` alias.
