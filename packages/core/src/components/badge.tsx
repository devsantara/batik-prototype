import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

import { color } from '../tokens/color.stylex';
import { font } from '../tokens/font.stylex';
import { radius } from '../tokens/shape.stylex';
import { space } from '../tokens/space.stylex';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export type BadgeProps = Omit<ComponentPropsWithRef<'span'>, 'className' | 'style'> & {
  /** Which status the badge reads as. Defaults to `'neutral'`. */
  readonly tone?: BadgeTone;
  /** Extra StyleX styles, merged last so they win. */
  readonly style?: StyleXStyles;
};

const styles = stylex.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.pill,
    display: 'inline-flex',
    fontFamily: font.family,
    fontSize: font.sizeSm,
    fontWeight: font.weightMedium,
    gap: space.xs,
    letterSpacing: font.trackingWide,
    lineHeight: font.lineHeightTight,
    paddingBlock: space.xs,
    paddingInline: space.md,
    whiteSpace: 'nowrap',
  },
});

// Every tone is a wash paired with the copy colour that stays readable on it,
// so the component never has to derive a foreground - and a theme can retune
// contrast without this file knowing.
const tones = stylex.create({
  neutral: { backgroundColor: color.neutralSurface, color: color.onNeutralSurface },
  accent: { backgroundColor: color.accentSurface, color: color.onAccentSurface },
  success: { backgroundColor: color.successSurface, color: color.onSuccessSurface },
  warning: { backgroundColor: color.warningSurface, color: color.onWarningSurface },
  danger: { backgroundColor: color.dangerSurface, color: color.onDangerSurface },
});

/** A small status label. */
export function Badge({ tone = 'neutral', style, ...props }: BadgeProps) {
  return <span {...props} {...stylex.props(styles.base, tones[tone], style)} />;
}
