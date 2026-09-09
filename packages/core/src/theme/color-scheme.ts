import { useSyncExternalStore } from 'react';

import type { ColorScheme } from '#/theme/define-theme';

/** What an app asks for. `'system'` defers to the OS, the other two force a scheme. */
export type ColorSchemePreference = ColorScheme | 'system';

const DARK = '(prefers-color-scheme: dark)';

function subscribe(onStoreChange: () => void): () => void {
  const query = globalThis.matchMedia(DARK);

  query.addEventListener('change', onStoreChange);

  return () => {
    query.removeEventListener('change', onStoreChange);
  };
}

function getSnapshot(): ColorScheme {
  return globalThis.matchMedia(DARK).matches ? 'dark' : 'light';
}

/**
 * There is no OS preference to read while rendering on the server, and
 * guessing dark would flash the whole page on hydration for the majority who
 * are not in it. Light is the safer wrong answer.
 */
function getServerSnapshot(): ColorScheme {
  return 'light';
}

/**
 * The colour scheme the OS is currently asking for, kept live.
 *
 * `useSyncExternalStore` rather than an effect and a piece of state: the media
 * query is external state that can change between render and commit, and this
 * is the hook that reads it without tearing.
 */
export function usePreferredColorScheme(): ColorScheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
