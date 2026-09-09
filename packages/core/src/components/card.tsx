import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

import { color } from '../tokens/color.stylex';
import { border, radius, shadow } from '../tokens/shape.stylex';
import { space } from '../tokens/space.stylex';

export type CardVariant = 'elevated' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export type CardProps = Omit<ComponentPropsWithRef<'div'>, 'className' | 'style'> & {
  /** Defaults to `'elevated'`. */
  readonly variant?: CardVariant;
  /** Defaults to `'md'`. */
  readonly padding?: CardPadding;
  /** Extra StyleX styles, merged last so they win. */
  readonly style?: StyleXStyles;
};

const styles = stylex.create({
  base: {
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    color: color.foreground,
  },
});

const variants = stylex.create({
  elevated: {
    borderColor: color.border,
    borderWidth: border.width,
    boxShadow: shadow.md,
  },
  outlined: {
    borderColor: color.borderStrong,
    borderWidth: border.width,
    boxShadow: 'none',
  },
});

const paddings = stylex.create({
  none: { padding: null },
  sm: { padding: space.md },
  md: { padding: space.xl },
  lg: { padding: space.xxl },
});

/**
 * A surface to group related content on.
 *
 * Deliberately not a compound component: a card is a box, and everything that
 * usually gets bolted onto one - a header, a title, a footer row - composes out
 * of ordinary elements without the design system having to name them.
 */
export function Card({ variant = 'elevated', padding = 'md', style, ...props }: CardProps) {
  return (
    <div {...props} {...stylex.props(styles.base, variants[variant], paddings[padding], style)} />
  );
}
