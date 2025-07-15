import { useContext } from 'react';
import { ThemeContext } from '../context/theme-context';
import type { Theme } from '../types';

export type UseThemeReturn = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

/**
 * Custom hook to get the current theme and set the theme
 * @returns The current theme and the function to set the theme
 */
export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return {
    theme: context.theme,
    setTheme: context.setTheme,
  };
}
