'use client';

import { useContext } from 'react';
import { ColorThemeContext } from './color-theme-provider';

export function useColorTheme() {
  const context = useContext(ColorThemeContext);

  if (!context) {
    throw new Error('useColorTheme must be used within ColorThemeProvider');
  }

  return context;
}
