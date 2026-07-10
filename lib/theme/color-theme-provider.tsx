'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { ColorTheme } from './types';
import { DEFAULT_COLOR_THEME } from './constants';

interface ColorThemeContextValue {
  color: ColorTheme;
  setColor: (color: ColorTheme) => void;
}

export const ColorThemeContext = createContext<ColorThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'color-theme';

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [color, setColorState] = useState<ColorTheme>(DEFAULT_COLOR_THEME);

  // 从 localStorage 读取主题偏好
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['blue', 'green', 'purple', 'orange'].includes(stored)) {
        setColorState(stored as ColorTheme);
      }
    } catch (error) {
      // localStorage 不可用时静默失败，使用默认主题
      console.warn('Failed to read color theme from localStorage:', error);
    }
  }, []);

  // 保存到 localStorage 并更新 data-theme 属性
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, color);
    } catch (error) {
      console.warn('Failed to save color theme to localStorage:', error);
    }

    // 更新 document.documentElement 的 data-theme 属性
    document.documentElement.setAttribute('data-theme', color);
  }, [color]);

  const setColor = (newColor: ColorTheme) => {
    setColorState(newColor);
  };

  return (
    <ColorThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ColorThemeContext.Provider>
  );
}
