import { useEffect, useState } from 'react';
import { ThemeMode } from '../types/system.types';

const THEME_KEY = 'theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    return stored ?? 'system';
  });

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;

    if (mode === 'dark') {
      root.classList.add('dark-theme');
    } else if (mode === 'light') {
      root.classList.remove('dark-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark-theme', prefersDark);
    }
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
  };

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = () => {
      if (localStorage.getItem(THEME_KEY) === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [theme]);

  return { theme, setTheme };
};
