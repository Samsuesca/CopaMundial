import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

const LanguageSelector = () => {
  const { lang, setLang, availableLanguages } = useI18n();
  const [open, setOpen] = useState(false);

  const current = availableLanguages.find(l => l.id === lang);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
        title="Language"
        aria-label={`Language: ${current?.label}`}
      >
        <span className="text-sm">{current?.flag}</span>
        <span className="text-xs text-[var(--color-primary)] font-bold uppercase hidden sm:inline">{lang}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-[var(--color-bg-darker)] border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
            {availableLanguages.map(l => (
              <button
                key={l.id}
                onClick={() => { setLang(l.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  lang === l.id ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
