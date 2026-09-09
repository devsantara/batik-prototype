import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

import { color } from '../tokens/color.stylex';
import { font } from '../tokens/font.stylex';
import { border, radius } from '../tokens/shape.stylex';
import { space } from '../tokens/space.stylex';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'className' | 'size' | 'style'> & {
  /**
   * Defaults to `'md'`.
   *
   * This shadows the native `size` attribute, which sets a width in characters
   * and is vestigial in a design system that sizes with tokens.
   */
  readonly size?: InputSize;
  /** Paints the error affordance and sets `aria-invalid`, keeping the two in step. */
  readonly invalid?: boolean;
  /** Extra StyleX styles, merged last so they win. */
  readonly style?: StyleXStyles;
};

const styles = stylex.create({
  base: {
    appearance: 'none',
    backgroundColor: color.surface,
    borderColor: { default: color.border, ':hover': color.borderStrong, ':focus': color.ring },
    borderStyle: 'solid',
    borderWidth: border.width,
    color: color.foreground,
    fontFamily: font.family,
    lineHeight: font.lineHeightNormal,
    outlineColor: color.ring,
    outlineOffset: '1px',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: border.widthStrong,
    transitionDuration: '120ms',
    transitionProperty: 'background-color, border-color',
    width: '100%',

    // A pseudo-element, so it is a top-level key. Pseudo-*classes* are not -
    // they nest inside a property's value, the way `:hover` does above.
    '::placeholder': { color: color.muted },
  },

  disabled: {
    backgroundColor: color.neutralSurface,
    borderColor: { default: color.border, ':hover': color.border },
    color: color.muted,
    cursor: 'not-allowed',
  },

  invalid: {
    borderColor: { default: color.danger, ':hover': color.danger, ':focus': color.danger },
    outlineColor: color.danger,
  },
});

const sizes = stylex.create({
  sm: {
    borderRadius: radius.sm,
    fontSize: font.sizeSm,
    paddingBlock: space.xs,
    paddingInline: space.sm,
  },
  md: {
    borderRadius: radius.md,
    fontSize: font.sizeMd,
    paddingBlock: space.sm,
    paddingInline: space.md,
  },
  lg: {
    borderRadius: radius.md,
    fontSize: font.sizeLg,
    paddingBlock: space.md,
    paddingInline: space.lg,
  },
});

/** A single-line text field. */
export function Input({
  size = 'md',
  invalid = false,
  disabled = false,
  style,
  ...props
}: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      disabled={disabled}
      {...props}
      {...stylex.props(
        styles.base,
        sizes[size],
        invalid && styles.invalid,
        disabled && styles.disabled,
        style,
      )}
    />
  );
}
