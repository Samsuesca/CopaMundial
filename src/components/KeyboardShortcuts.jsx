/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState, useCallback } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

const KeyboardShortcutsModal = ({ onClose }) => {
  const { t } = useI18n();

  const shortcuts = [
    { category: t('shortcuts.navigation'), items: [
      { keys: ['1'], desc: 'Playoffs' },
      { keys: ['2'], desc: t('nav.groups') },
      { keys: ['3'], desc: t('nav.knockout') },
      { keys: ['4'], desc: t('nav.stats') },
      { keys: ['5'], desc: t('nav.stream') },
      { keys: ['6'], desc: t('nav.calendar') },
    ]},
    { category: t('shortcuts.actions'), items: [
      { keys: ['Ctrl', 'K'], desc: t('shortcuts.search') },
      { keys: ['Ctrl', 'S'], desc: t('shortcuts.save') },
      { keys: ['Ctrl', 'E'], desc: t('shortcuts.export') },
      { keys: ['T'], desc: t('shortcuts.toggleTheme') },
      { keys: ['L'], desc: t('shortcuts.toggleLang') },
      { keys: ['?'], desc: t('shortcuts.help') },
      { keys: ['R'], desc: t('shortcuts.autoSim') },
    ]},
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/10 shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-white">{t('shortcuts.title')}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {shortcuts.map((group, i) => (
          <div key={i} className="mb-5">
            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">{group.category}</h4>
            <div className="space-y-2">
              {group.items.map((s, j) => (
                <div key={j} className="flex items-center justify-between py-1">
                  <span className="text-gray-300 text-sm">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k, ki) => (
                      <kbd key={ki} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 border border-white/10 font-mono">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function useKeyboardShortcuts({ onTabChange, onSave, onExport, onCycleTheme, onCycleLang, onAutoSim }) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleKeyDown = useCallback((e) => {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') { e.preventDefault(); onSave?.(); }
      if (e.key === 'e') { e.preventDefault(); onExport?.(); }
      return;
    }

    const tabs = ['playoffs', 'groups', 'knockout', 'stats', 'stream', 'calendar'];
    if (e.key >= '1' && e.key <= '6') {
      e.preventDefault();
      onTabChange?.(tabs[parseInt(e.key) - 1]);
    }
    if (e.key === 't' || e.key === 'T') { e.preventDefault(); onCycleTheme?.(); }
    if (e.key === 'l' || e.key === 'L') { e.preventDefault(); onCycleLang?.(); }
    if (e.key === '?' || (e.key === '/' && e.shiftKey)) { e.preventDefault(); setShowShortcuts(s => !s); }
    if (e.key === 'r' || e.key === 'R') { e.preventDefault(); onAutoSim?.(); }
    if (e.key === 'Escape') setShowShortcuts(false);
  }, [onTabChange, onSave, onExport, onCycleTheme, onCycleLang, onAutoSim]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showShortcuts, setShowShortcuts };
}

export default KeyboardShortcutsModal;
