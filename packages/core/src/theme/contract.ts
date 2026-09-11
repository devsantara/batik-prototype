import type { Contract } from '#/theme/build-theme';

import { color } from '../tokens/color.stylex';
import { font } from '../tokens/font.stylex';
import { icon } from '../tokens/icon.stylex';
import { border, radius, shadow } from '../tokens/shape.stylex';
import { space } from '../tokens/space.stylex';
import { toggle } from '../tokens/switch.stylex';

/**
 * The theme contract: every variable group a theme sets, under the name a
 * theme sets it by - and a theme sets all of it, every token of every group.
 *
 * One object serves both halves of `defineTheme()`. Its type is what stops a
 * theme compiling when core adds a token or a group; its value is what
 * `defineTheme()` walks at runtime to find each token's CSS variable, and to
 * catch a theme package built for an older core. Adding a group is one line
 * here.
 *
 * `breakpoint` is not in it: it is `defineConsts`, resolved at build time, and
 * no theme can move it.
 */
export const contract = {
  tokens: {
    colors: color,
    typography: font,
    spacing: space,
    radius,
    border,
    shadow,
  },
  components: {
    switch: toggle,
  },
  icons: icon,
} satisfies Contract;
