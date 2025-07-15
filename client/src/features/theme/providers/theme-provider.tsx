import { useEffect, useMemo, useState } from 'react';
import type { Theme } from '../types';
import { ThemeContext, type ThemeState } from '../context/theme-context';
import { Themes } from '../constants';

type ThemeProviderProps = {
  readonly children: React.ReactNode;
  readonly defaultTheme?: Theme;
  readonly storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = Themes.SYSTEM,
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(
      Themes.LIGHT.toLowerCase(),
      Themes.DARK.toLowerCase(),
    );

    if (theme === Themes.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: light)')
        .matches
        ? Themes.DARK
        : Themes.LIGHT;

      root.classList.add(systemTheme.toLowerCase());
      return;
    }

    root.classList.add(theme.toLowerCase());
  }, [theme]);

  const value: ThemeState = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
    }),
    [theme, storageKey],
  );

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
