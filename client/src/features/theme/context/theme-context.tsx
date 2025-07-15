import { createContext } from 'react';
import type { Theme } from '../types';
import { Themes } from '@/features/theme/constants';

export type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeState = {
  theme: Themes.SYSTEM,
  setTheme: () => null,
};

export const ThemeContext = createContext<ThemeState>(initialState);
