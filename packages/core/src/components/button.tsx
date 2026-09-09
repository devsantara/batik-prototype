import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

// Token groups are imported by relative path, not through the `#/` alias the
// rest of this package uses. StyleX resolves `.stylex` imports itself, with
// Node's own algorithm, and `#/*` maps to `./src/*.js` - a specifier that only
// a bundler's TypeScript-aware resolution can follow. See the README.
import { color } from '../tokens/color.stylex';
import { font } from '../tokens/font.stylex';
import { border, radius } from '../tokens/shape.stylex';
import { space } from '../tokens/space.stylex';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'className' | 'style'> & {
  /** How much visual weight the button carries. Defaults to `'solid'`. */
  readonly variant?: ButtonVariant;
  /** Defaults to `'md'`. */
  readonly size?: ButtonSize;
  /**
   * Extra StyleX styles, merged last so they win.
   *
   * `className` and `style` are removed from the underlying button props on
   * purpose: mixing either with a `stylex.props()` spread silently drops one of
   * the two, so this is the one supported way to reach in.
   */
  readonly style?: StyleXStyles;
};

const styles = stylex.create({
  base: {
    alignItems: 'center',
    appearance: 'none',
    borderStyle: 'solid',
    borderWidth: border.width,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font.family,
    fontWeight: font.weightMedium,
    gap: space.sm,
    justifyContent: 'center',
    lineHeight: font.lineHeightTight,
    outlineColor: color.ring,
    outlineOffset: '2px',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: border.widthStrong,
    textDecoration: 'none',
    transitionDuration: '120ms',
    transitionProperty: 'background-color, border-color, color',
    whiteSpace: 'nowrap',
  },

  // Applied after the variant, and repeating each interaction state, because
  // StyleX keys an atomic class on property *and* condition: overriding the
  // default `backgroundColor` alone would leave the variant's `:hover` class
  // untouched and a disabled button would still light up under the pointer.
  disabled: {
    backgroundColor: {
      default: color.neutralSurface,
      ':hover': color.neutralSurface,
      ':active': color.neutralSurface,
    },
    borderColor: color.border,
    color: color.muted,
    cursor: 'not-allowed',
  },
});

const sizes = stylex.create({
  sm: {
    borderRadius: radius.sm,
    fontSize: font.sizeSm,
    paddingBlock: space.xs,
    paddingInline: space.md,
  },
  md: {
    borderRadius: radius.md,
    fontSize: font.sizeMd,
    paddingBlock: space.sm,
    paddingInline: space.lg,
  },
  lg: {
    borderRadius: radius.md,
    fontSize: font.sizeLg,
    paddingBlock: space.md,
    paddingInline: space.xl,
  },
});

const variants = stylex.create({
  solid: {
    backgroundColor: {
      default: color.accent,
      ':hover': color.accentHover,
      ':active': color.accentActive,
    },
    borderColor: 'transparent',
    color: color.onAccent,
  },
  outline: {
    backgroundColor: { default: color.surface, ':hover': color.surfaceHover },
    borderColor: color.borderStrong,
    color: color.foreground,
  },
  ghost: {
    backgroundColor: { default: 'transparent', ':hover': color.surfaceHover },
    borderColor: 'transparent',
    color: color.foreground,
  },
});

/**
 * A button.
 *
 * Every colour, radius and step of padding comes from a token, so a theme
 * restyles all three variants without this file changing.
 */
export function Button({
  variant = 'solid',
  size = 'md',
  // Defaulted because a bare <button> inside a form submits it, which is almost
  // never what a design-system button is being asked to do.
  type = 'button',
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      {...stylex.props(
        styles.base,
        sizes[size],
        variants[variant],
        disabled && styles.disabled,
        style,
      )}
    />
  );
}
