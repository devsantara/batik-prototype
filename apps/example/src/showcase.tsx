import { Badge, Button, Card, Input } from '@batik-prototype/core';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { font } from '@batik-prototype/core/tokens/font.stylex';
import { space } from '@batik-prototype/core/tokens/space.stylex';
import * as stylex from '@stylexjs/stylex';
import { useId, type ReactNode } from 'react';

const styles = stylex.create({
  section: { display: 'flex', flexDirection: 'column', gap: space.lg },

  heading: { fontSize: font.sizeLg, fontWeight: font.weightSemibold, margin: 0 },

  caption: { color: color.muted, fontSize: font.sizeSm, margin: 0 },

  row: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: space.lg },

  stack: { display: 'flex', flexDirection: 'column', gap: space.md },

  grid: {
    display: 'grid',
    gap: space.xl,
    gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
  },

  field: { display: 'flex', flexDirection: 'column', gap: space.xs },

  label: { fontSize: font.sizeSm, fontWeight: font.weightMedium },

  hint: { color: color.muted, fontSize: font.sizeSm },

  error: { color: color.danger, fontSize: font.sizeSm },

  cardTitle: { fontSize: font.sizeMd, fontWeight: font.weightSemibold, margin: 0 },

  cardBody: { color: color.muted, fontSize: font.sizeSm, margin: 0 },
});

function Section({
  title,
  caption,
  children,
}: {
  readonly title: string;
  readonly caption: string;
  readonly children: ReactNode;
}) {
  return (
    <section {...stylex.props(styles.section)}>
      <div>
        <h2 {...stylex.props(styles.heading)}>{title}</h2>
        <p {...stylex.props(styles.caption)}>{caption}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  readonly label: string;
  readonly children: (id: string) => ReactNode;
  readonly hint?: ReactNode;
}) {
  const id = useId();

  return (
    <div {...stylex.props(styles.field)}>
      <label htmlFor={id} {...stylex.props(styles.label)}>
        {label}
      </label>
      {children(id)}
      {hint}
    </div>
  );
}

export function Showcase() {
  return (
    <>
      <Section
        title="Button"
        caption="Three variants, three sizes, and a disabled state - all of it token-driven."
      >
        <Card>
          <div {...stylex.props(styles.stack)}>
            <div {...stylex.props(styles.row)}>
              <Button>Solid</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div {...stylex.props(styles.row)}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Badge" caption="Five tones, each a wash paired with a readable foreground.">
        <Card>
          <div {...stylex.props(styles.row)}>
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Shipped</Badge>
            <Badge tone="warning">Review</Badge>
            <Badge tone="danger">Blocked</Badge>
          </div>
        </Card>
      </Section>

      <Section
        title="Input"
        caption="Placeholder, focus ring, invalid and disabled states come from the same palette."
      >
        <Card>
          <div {...stylex.props(styles.grid)}>
            <Field
              label="Workspace"
              hint={<span {...stylex.props(styles.hint)}>Lowercase, no spaces.</span>}
            >
              {(id) => <Input id={id} defaultValue="devsantara" />}
            </Field>

            <Field label="Search">
              {(id) => <Input id={id} placeholder="Search components" />}
            </Field>

            <Field
              label="Email"
              hint={<span {...stylex.props(styles.error)}>That address is missing an @.</span>}
            >
              {(id) => <Input id={id} invalid defaultValue="tech.example.com" />}
            </Field>

            <Field label="Plan">
              {(id) => <Input id={id} disabled defaultValue="Enterprise" />}
            </Field>
          </div>
        </Card>
      </Section>

      <Section
        title="Card"
        caption="Elevated leans on the shadow tokens; outlined leans on the border ones."
      >
        <div {...stylex.props(styles.grid)}>
          <Card>
            <div {...stylex.props(styles.stack)}>
              <Badge tone="accent">Elevated</Badge>
              <h3 {...stylex.props(styles.cardTitle)}>Shadow carries the lift</h3>
              <p {...stylex.props(styles.cardBody)}>
                The shadow tokens are overridden per colour scheme, because a shadow tuned for a
                white page is invisible on a near-black one.
              </p>
            </div>
          </Card>

          <Card variant="outlined">
            <div {...stylex.props(styles.stack)}>
              <Badge>Outlined</Badge>
              <h3 {...stylex.props(styles.cardTitle)}>Border carries the lift</h3>
              <p {...stylex.props(styles.cardBody)}>
                Same component, same tokens, no shadow. Switch to Ocean or Sunset to watch the
                corner radius move without either card knowing.
              </p>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
