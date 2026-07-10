'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useColorTheme } from '@/lib/theme/use-theme';
import { THEME_COLORS, THEME_COLORS_CONFIG } from '@/lib/theme/constants';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { color, setColor } = useColorTheme();

  return (
    <div className="space-y-6">
      {/* 明暗模式选择器 */}
      <div className="space-y-3">
        <Label>明暗模式</Label>
        <div className="flex gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setTheme('light')}
          >
            <Sun className="mr-2 h-4 w-4" />
            浅色
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setTheme('dark')}
          >
            <Moon className="mr-2 h-4 w-4" />
            深色
          </Button>
        </div>
      </div>

      {/* 主题颜色选择器 */}
      <div className="space-y-3">
        <Label>主题颜色</Label>
        <div className="grid grid-cols-2 gap-6">
          {THEME_COLORS.map((themeColor) => {
            const config = THEME_COLORS_CONFIG[themeColor];
            const isSelected = color === themeColor;

            return (
              <button
                key={themeColor}
                onClick={() => setColor(themeColor)}
                className={`
                  relative h-20 rounded-lg transition-all
                  ${isSelected ? 'ring-2 ring-offset-2 ring-primary scale-102' : 'hover:scale-105'}
                `}
                style={{
                  backgroundColor: `hsl(${config.primary})`,
                }}
                aria-label={`选择${config.name}主题`}
              >
                <span className="text-white font-medium text-sm drop-shadow-md">
                  {config.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
