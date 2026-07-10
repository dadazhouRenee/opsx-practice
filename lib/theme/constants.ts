import { ColorTheme } from './types';

export const THEME_COLORS: ColorTheme[] = ['blue', 'green', 'purple', 'orange'];

export const THEME_COLORS_CONFIG = {
  blue: {
    name: '蓝色',
    primary: '217 91% 60%',
    primaryForeground: '0 0% 100%',
  },
  green: {
    name: '绿色',
    primary: '142 71% 45%',
    primaryForeground: '0 0% 100%',
  },
  purple: {
    name: '紫色',
    primary: '262 83% 58%',
    primaryForeground: '0 0% 100%',
  },
  orange: {
    name: '橙色',
    primary: '25 95% 53%',
    primaryForeground: '0 0% 100%',
  },
} as const;

export const DEFAULT_COLOR_THEME: ColorTheme = 'blue';
