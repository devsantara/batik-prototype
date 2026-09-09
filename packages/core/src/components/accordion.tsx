import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import {
  useId,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

import { color } from '../tokens/color.stylex';
import { font } from '../tokens/font.stylex';
import { border, radius } from '../tokens/shape.stylex';
import { space } from '../tokens/space.stylex';

export type AccordionVariant = 'contained' | 'separated';

export type AccordionItem = {
  /** Identifies the row across renders. */
  readonly id: string;
  /** The always-visible row that toggles the panel. */
  readonly title: ReactNode;
  /** Revealed while the row is open. */
  readonly content: ReactNode;
  /** Whether the row starts open. Defaults to `false`. */
  readonly defaultOpen?: boolean;
  /** A row that cannot be toggled. Defaults to `false`. */
  readonly disabled?: boolean;
};

export type AccordionProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style'
> & {
  /** The rows, in the order they render. */
  readonly items: readonly AccordionItem[];
  /** How the rows are grouped. Defaults to `'contained'`. */
  readonly variant?: AccordionVariant;
  /** Whether opening a row closes the rest. Defaults to `false`. */
  readonly exclusive?: boolean;
  /** Extra StyleX styles, merged last so they win. */
  readonly style?: StyleXStyles;
};

const styles = stylex.create({
  group: {
    display: 'flex',
    flexDirection: 'column',
  },

  item: {
    backgroundColor: color.surface,
    color: color.foreground,
    fontFamily: font.family,
  },

  itemSeparated: {
    borderColor: color.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: border.width,
    overflow: 'hidden',
  },

  // On the row rather than the summary, because a summary that ignores the
  // pointer cannot set a cursor either.
  itemDisabled: {
    cursor: 'not-allowed',
  },

  summary: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': color.surfaceHover },
    cursor: 'pointer',
    display: 'flex',
    fontSize: font.sizeMd,
    fontWeight: font.weightMedium,
    gap: space.md,
    justifyContent: 'space-between',
    lineHeight: font.lineHeightTight,

    // Two ways of saying the same thing, because browsers disagree on which one
    // hides the disclosure triangle: any `display` other than `list-item` drops
    // it in WebKit, `list-style` drops it everywhere else.
    listStyleType: 'none',

    outlineColor: color.ring,
    // Inset, unlike Button's. `contained` clips the group, so a ring drawn
    // outside the row would be cut off by that `overflow: hidden`.
    outlineOffset: '-2px',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: border.widthStrong,
    paddingBlock: space.md,
    paddingInline: space.xl,
    transitionDuration: '120ms',
    transitionProperty: 'background-color',
  },

  summaryDisabled: {
    color: color.muted,
    // Cheaper than cancelling the click: a summary the pointer cannot reach
    // cannot be toggled, and `tabIndex={-1}` takes the keyboard route away too.
    // Both routes have to go, since Enter on a focused summary *is* a click.
    pointerEvents: 'none',
  },

  panel: {
    fontSize: font.sizeMd,
    lineHeight: font.lineHeightNormal,
    paddingBlockEnd: space.xl,
    paddingBlockStart: space.xs,
    paddingInline: space.xl,
  },

  chevron: {
    color: color.muted,
    flexShrink: 0,
    height: '1rem',
    transform: 'rotate(0deg)',
    transitionDuration: '120ms',
    transitionProperty: 'transform',
    width: '1rem',
  },

  chevronOpen: {
    transform: 'rotate(180deg)',
  },
});

const groups = stylex.create({
  // The background is the divider: the group paints itself in the border
  // colour and the rows cover all of it but the `gap`, leaving a hairline
  // between neighbours and none above the first or below the last.
  contained: {
    backgroundColor: color.border,
    borderColor: color.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: border.width,
    gap: border.width,
    overflow: 'hidden',
  },

  separated: {
    gap: space.md,
  },
});

function Chevron({ open }: { readonly open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      {...stylex.props(styles.chevron, open && styles.chevronOpen)}
    >
      <path
        d="m4 6 4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

type RowProps = {
  readonly item: AccordionItem;
  readonly variant: AccordionVariant;
  /** The `exclusive` group this row belongs to, or `undefined` for none. */
  readonly name: string | undefined;
};

function Row({ item, variant, name }: RowProps) {
  // A mirror of the element's own state, never the source of it: `open` below
  // is an initial value and `details` takes it from there, including the rows
  // the browser closes on its own inside an `exclusive` group - each of those
  // fires `toggle` too, so this stays in step without being told.
  //
  // It exists because only the chevron needs to know. Turning it in CSS
  // instead, off the ancestor `[open]`, would reach every chevron underneath an
  // open row - and rotate the closed ones of a nested Accordion with it.
  const [open, setOpen] = useState(item.defaultOpen ?? false);

  function handleToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    setOpen(event.currentTarget.open);
  }

  return (
    <details
      name={name}
      open={item.defaultOpen}
      onToggle={handleToggle}
      {...stylex.props(
        styles.item,
        variant === 'separated' && styles.itemSeparated,
        item.disabled && styles.itemDisabled,
      )}
    >
      <summary
        aria-disabled={item.disabled || undefined}
        tabIndex={item.disabled ? -1 : undefined}
        {...stylex.props(styles.summary, item.disabled && styles.summaryDisabled)}
      >
        <span>{item.title}</span>
        <Chevron open={open} />
      </summary>
      <div {...stylex.props(styles.panel)}>{item.content}</div>
    </details>
  );
}

/**
 * A stack of disclosure rows.
 *
 * Rows arrive as data rather than as children, which is the one place this
 * component departs from the rest of the set. A compound `<Accordion.Item>`
 * would have to read the group's variant and its `exclusive` group name out of
 * React context on every render, and nothing else here does that. Passing an
 * array keeps the whole component a function of its props.
 *
 * Underneath it is `<details>` and `<summary>`, so the keyboard, the screen
 * reader and find-in-page behaviour are the platform's rather than ours.
 */
export function Accordion({
  items,
  variant = 'contained',
  exclusive = false,
  style,
  ...props
}: AccordionProps) {
  // One name per Accordion, which is the whole of `exclusive`: the browser
  // closes the open row when another of the same name opens, so nothing here
  // has to track which row that was.
  const name = useId();

  return (
    <div {...props} {...stylex.props(styles.group, groups[variant], style)}>
      {items.map((item) => (
        <Row key={item.id} item={item} variant={variant} name={exclusive ? name : undefined} />
      ))}
    </div>
  );
}
