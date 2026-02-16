/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const themes = {
  dark: {
    id: 'dark',
    label: 'Oscuro',
    bgPrimary: '#00204C',
    bgSecondary: '#001533',
    bgTertiary: '#000F24',
    textPrimary: 'rgba(255, 255, 255, 0.87)',
    textSecondary: '#9CA3AF',
    accent: '#00FF85',
    accentDark: '#00CC6A',
  },
  light: {
    id: 'light',
    label: 'Claro',
    bgPrimary: '#F0F4F8',
    bgSecondary: '#FFFFFF',
    bgTertiary: '#E2E8F0',
    textPrimary: '#1A202C',
    textSecondary: '#4A5568',
    accent: '#00CC6A',
    accentDark: '#009F52',
  },
  midnight: {
    id: 'midnight',
    label: 'Medianoche',
    bgPrimary: '#0F0F1A',
    bgSecondary: '#1A1A2E',
    bgTertiary: '#0A0A14',
    textPrimary: 'rgba(255, 255, 255, 0.9)',
    textSecondary: '#8888AA',
    accent: '#6C63FF',
    accentDark: '#5A52D5',
  },
};

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    try {
      return localStorage.getItem('wc2026_theme') || 'dark';
    } catch { return 'dark'; }
  });

  const theme = themes[themeId] || themes.dark;

  useEffect(() => {
    localStorage.setItem('wc2026_theme', themeId);
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    root.style.setProperty('--color-primary', theme.accent);
    root.style.setProperty('--color-primary-dark', theme.accentDark);
    root.style.setProperty('--color-bg-dark', theme.bgPrimary);
    root.style.setProperty('--color-bg-darker', theme.bgSecondary);
    root.style.setProperty('--color-bg-darkest', theme.bgTertiary);
    root.style.setProperty('--color-text', theme.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
  }, [themeId, theme]);

  const cycleTheme = () => {
    const ids = Object.keys(themes);
    const next = ids[(ids.indexOf(themeId) + 1) % ids.length];
    setThemeId(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId, cycleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
