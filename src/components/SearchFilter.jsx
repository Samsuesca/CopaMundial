import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TEAMS } from '../data/teams';
import { useI18n } from '../context/I18nContext';

const SearchFilter = ({ onSelectTeam, onSelectGroup }) => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const groups = 'ABCDEFGHIJKL'.split('');

  const results = query.length > 0 ? [
    ...TEAMS.filter(team =>
      team.name.toLowerCase().includes(query.toLowerCase()) ||
      team.id.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8).map(t => ({ type: 'team', data: t })),
    ...groups.filter(g =>
      `group ${g}`.toLowerCase().includes(query.toLowerCase()) ||
      `grupo ${g}`.toLowerCase().includes(query.toLowerCase())
    ).map(g => ({ type: 'group', data: g })),
  ] : [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 text-sm border border-white/10"
        aria-label="Search"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t('search.placeholder')}</span>
        <kbd className="hidden sm:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-2">Ctrl+K</kbd>
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => { setIsOpen(false); setQuery(''); }} />
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[var(--color-bg-darker)] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent text-white outline-none text-sm"
              autoFocus
            />
            <button onClick={() => { setIsOpen(false); setQuery(''); }} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {results.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (r.type === 'team') onSelectTeam?.(r.data);
                    else onSelectGroup?.(r.data);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  {r.type === 'team' ? (
                    <>
                      <span className="text-xl">{r.data.flag}</span>
                      <div>
                        <div className="text-white text-sm font-medium">{r.data.name}</div>
                        <div className="text-gray-500 text-xs">Rank #{r.data.rating}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">📋</span>
                      <div className="text-white text-sm font-medium">Group {r.data}</div>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          {query.length > 0 && results.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              {t('search.noResults')}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchFilter;
