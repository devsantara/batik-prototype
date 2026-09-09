import {
  Button,
  ThemeProvider,
  useColorScheme,
  type ColorSchemePreference,
} from '@batik-prototype/core';
import { breakpoint } from '@batik-prototype/core/tokens/breakpoint.stylex';
import { color } from '@batik-prototype/core/tokens/color.stylex';
import { font } from '@batik-prototype/core/tokens/font.stylex';
import { border, radius } from '@batik-prototype/core/tokens/shape.stylex';
import { space } from '@batik-prototype/core/tokens/space.stylex';
import { classic } from '@batik-prototype/theme-classic';
import { ocean } from '@batik-prototype/theme-ocean';
import { sunset } from '@batik-prototype/theme-sunset';
import * as stylex from '@stylexjs/stylex';
import { useState, type ReactNode } from 'react';

import { Showcase } from '#/showcase';

// Installing a theme is the whole integration: import it, and hand it to the
// provider. Nothing in @batik-prototype/core knows these three exist.
const THEMES = [classic, ocean, sunset];

const SCHEMES: readonly ColorSchemePreference[] = ['system', 'light', 'dark'];

const styles = stylex.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },

  header: {
    alignItems: { default: 'flex-start', [breakpoint.md]: 'center' },
    backgroundColor: color.surface,
    borderBottomColor: color.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: border.width,
    display: 'flex',
    flexDirection: { default: 'column', [breakpoint.md]: 'row' },
    gap: space.xl,
    justifyContent: 'space-between',
    paddingBlock: space.xl,
    paddingInline: space.xxl,
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },

  wordmark: { display: 'flex', flexDirection: 'column', gap: space.xs },

  title: { fontSize: '1.25rem', fontWeight: font.weightSemibold, margin: 0 },

  subtitle: { color: color.muted, fontSize: font.sizeSm, margin: 0 },

  switchers: { display: 'flex', flexWrap: 'wrap', gap: space.xl },

  switcher: { display: 'flex', flexDirection: 'column', gap: space.sm },

  legend: {
    color: color.muted,
    fontSize: font.sizeSm,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackingWide,
  },

  // A segmented control, built out of Buttons rather than a component the
  // design system does not have yet.
  segmented: {
    backgroundColor: color.neutralSurface,
    borderRadius: radius.md,
    display: 'flex',
    gap: space.xs,
    padding: space.xs,
  },

  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.xxl,
    marginInline: 'auto',
    maxWidth: '68rem',
    paddingBlock: space.xxl,
    paddingInline: space.xl,
    width: '100%',
  },
});

function Switcher({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <div {...stylex.props(styles.switcher)}>
      <span {...stylex.props(styles.legend)}>{legend}</span>
      <div {...stylex.props(styles.segmented)}>{children}</div>
    </div>
  );
}

type ToolbarProps = {
  readonly themeName: string;
  readonly onThemeChange: (name: string) => void;
  readonly scheme: ColorSchemePreference;
  readonly onSchemeChange: (scheme: ColorSchemePreference) => void;
  readonly supportsDark: boolean;
};

function Toolbar({ themeName, onThemeChange, scheme, onSchemeChange, supportsDark }: ToolbarProps) {
  // Resolved, never `'system'` - this is what the page is actually rendering.
  const resolved = useColorScheme();

  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.wordmark)}>
        <h1 {...stylex.props(styles.title)}>Batik</h1>
        <p {...stylex.props(styles.subtitle)}>
          One component set, three installable themes, {resolved} right now.
        </p>
      </div>

      <div {...stylex.props(styles.switchers)}>
        <Switcher legend="Theme">
          {THEMES.map((option) => (
            <Button
              key={option.name}
              size="sm"
              variant={option.name === themeName ? 'solid' : 'ghost'}
              onClick={() => {
                onThemeChange(option.name);
              }}
            >
              {option.name}
            </Button>
          ))}
        </Switcher>

        <Switcher legend="Scheme">
          {SCHEMES.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={option === scheme ? 'solid' : 'ghost'}
              // `schemes` is derived by `defineTheme`, so a theme that ships no
              // dark scheme disables the control instead of silently doing
              // nothing when it is pressed.
              disabled={option === 'dark' && !supportsDark}
              onClick={() => {
                onSchemeChange(option);
              }}
            >
              {option}
            </Button>
          ))}
        </Switcher>
      </div>
    </header>
  );
}

export function App() {
  const [themeName, setThemeName] = useState(classic.name);
  const [scheme, setScheme] = useState<ColorSchemePreference>('system');

  const theme = THEMES.find((candidate) => candidate.name === themeName) ?? classic;
  const supportsDark = theme.schemes.includes('dark');

  return (
    <ThemeProvider theme={theme} colorScheme={scheme} style={styles.page}>
      <Toolbar
        themeName={themeName}
        onThemeChange={setThemeName}
        scheme={scheme}
        onSchemeChange={setScheme}
        supportsDark={supportsDark}
      />

      <main {...stylex.props(styles.main)}>
        <Showcase />
      </main>
    </ThemeProvider>
  );
}
