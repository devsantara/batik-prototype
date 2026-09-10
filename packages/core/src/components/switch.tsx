import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { useState, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from 'react';

import { color } from '../tokens/color.stylex';
import { font } from '../tokens/font.stylex';
import { border } from '../tokens/shape.stylex';
import { space } from '../tokens/space.stylex';
import { toggle } from '../tokens/switch.stylex';

export type SwitchSize = 'sm' | 'md' | 'lg';

export type SwitchProps = Omit<
  ComponentPropsWithRef<'input'>,
  'children' | 'className' | 'size' | 'style' | 'type'
> & {
  /** Defaults to `'md'`. */
  readonly size?: SwitchSize;
  /** Copy rendered beside the track, inside the same label. */
  readonly children?: ReactNode;
  /** Extra StyleX styles, merged last so they win. Applied to the label. */
  readonly style?: StyleXStyles;
};

const styles = stylex.create({
  // The label is the control: it wraps the input, so clicking the copy toggles
  // the switch without an `htmlFor`/`id` pair the caller has to supply.
  root: {
    alignItems: 'center',
    color: color.foreground,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font.family,
    fontWeight: font.weightMedium,
    gap: space.md,
    lineHeight: font.lineHeightTight,
  },

  rootDisabled: {
    color: color.muted,
    cursor: 'not-allowed',
  },

  // Visually hidden rather than `display: none`, which would take the input out
  // of the tab order and off the accessibility tree - the checkbox *is* the
  // control, and everything painted below is decoration.
  input: {
    height: '1px',
    margin: 0,
    opacity: 0,
    position: 'absolute',
    width: '1px',
  },

  track: {
    alignItems: 'center',
    backgroundColor: toggle.trackOff,
    borderColor: toggle.borderOff,
    borderRadius: toggle.trackRadius,
    borderStyle: 'solid',
    borderWidth: border.width,
    display: 'inline-flex',
    flexShrink: 0,
    outlineColor: color.ring,
    outlineOffset: '2px',
    outlineStyle: 'none',
    outlineWidth: border.widthStrong,
    transitionDuration: '120ms',
    transitionProperty: 'background-color, border-color',
  },

  trackChecked: {
    backgroundColor: toggle.trackOn,
    borderColor: toggle.borderOn,
  },

  // The ring is drawn on the track because the input it belongs to is
  // invisible; `:focus-visible` on a hidden element paints nothing.
  trackFocused: {
    outlineStyle: 'solid',
  },

  // Dimmed rather than recoloured, so a theme gets the disabled state of its
  // own switch for free instead of having to tune two more tokens for it.
  trackDisabled: {
    opacity: 0.55,
  },

  thumb: {
    backgroundColor: toggle.thumbOff,
    borderRadius: toggle.thumbRadius,
    boxShadow: toggle.thumbShadow,
    transitionDuration: '120ms',
    transitionProperty: 'background-color, transform',
  },

  thumbChecked: {
    backgroundColor: toggle.thumbOn,
  },
});

// Track and thumb are sized in one place so the travel distance stays the
// track's inner width minus the thumb, whatever a theme does to `border.width`.
const tracks = stylex.create({
  sm: { height: '16px', padding: '2px', width: '28px' },
  md: { height: '20px', padding: '2px', width: '36px' },
  lg: { height: '24px', padding: '3px', width: '44px' },
});

const thumbs = stylex.create({
  sm: { height: '12px', width: '12px' },
  md: { height: '16px', width: '16px' },
  lg: { height: '18px', width: '18px' },
});

const offsets = stylex.create({
  sm: { transform: 'translateX(12px)' },
  md: { transform: 'translateX(16px)' },
  lg: { transform: 'translateX(20px)' },
});

const labels = stylex.create({
  sm: { fontSize: font.sizeSm },
  md: { fontSize: font.sizeMd },
  lg: { fontSize: font.sizeLg },
});

/**
 * An on/off control.
 *
 * Underneath it is a checkbox carrying `role="switch"`, so the form, the
 * keyboard and the screen reader are the platform's. React state here only
 * mirrors the input - it decides which way the thumb sits, never whether the
 * control is on.
 */
export function Switch({
  size = 'md',
  checked,
  defaultChecked = false,
  disabled = false,
  children,
  style,
  onChange,
  onFocus,
  onBlur,
  ...props
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const [focused, setFocused] = useState(false);

  const isChecked = checked ?? uncontrolledChecked;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setUncontrolledChecked(event.currentTarget.checked);
    onChange?.(event);
  }

  return (
    <label {...stylex.props(styles.root, labels[size], disabled && styles.rootDisabled, style)}>
      <input
        // Redundant next to a checkbox's own `checked`, which already maps to
        // `aria-checked` - spelled out so a static check can see it.
        aria-checked={isChecked}
        checked={checked}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        disabled={disabled}
        role="switch"
        type="checkbox"
        {...props}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onChange={handleChange}
        onFocus={(event) => {
          // `:focus-visible` rather than `:focus`, so a pointer press does not
          // leave a ring behind the way keyboard navigation should.
          setFocused(event.currentTarget.matches(':focus-visible'));
          onFocus?.(event);
        }}
        {...stylex.props(styles.input)}
      />
      <span
        {...stylex.props(
          styles.track,
          tracks[size],
          isChecked && styles.trackChecked,
          focused && styles.trackFocused,
          disabled && styles.trackDisabled,
        )}
      >
        <span
          {...stylex.props(
            styles.thumb,
            thumbs[size],
            isChecked && styles.thumbChecked,
            isChecked && offsets[size],
          )}
        />
      </span>
      {children}
    </label>
  );
}
