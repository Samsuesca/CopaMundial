import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { themeId, cycleTheme } = useTheme();

  const icons = { dark: Moon, light: Sun, midnight: Sparkles };
  const Icon = icons[themeId] || Moon;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      title={`Theme: ${themeId}`}
      aria-label={`Current theme: ${themeId}. Click to change.`}
    >
      <Icon className="w-4 h-4 text-[var(--color-primary)]" />
    </button>
  );
};

export default ThemeToggle;
