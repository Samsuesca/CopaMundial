import React from 'react';
import { Trophy, Users, Swords, BarChart3, Menu, X, Radio, Calendar, Award, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import SearchFilter from './SearchFilter';
import { useI18n } from '../context/I18nContext';

const Header = ({ activeTab, onTabChange, stats, onShowAchievements, onShowShortcuts }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  const tabs = [
    { id: 'playoffs', label: t('nav.playoffs'), icon: Users },
    { id: 'groups', label: t('nav.groups'), icon: Trophy },
    { id: 'knockout', label: t('nav.knockout'), icon: Swords },
    { id: 'stats', label: t('nav.stats'), icon: BarChart3 },
    { id: 'calendar', label: t('nav.calendar'), icon: Calendar },
    { id: 'stream', label: t('nav.stream'), icon: Radio, special: true },
  ];

  const handleTabChange = (tab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[var(--color-bg-darker)] border-b border-[var(--color-primary)]/20 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Trophy className="w-8 h-8 text-[var(--color-primary)]" aria-hidden="true" />
              {stats.champion && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">
                {t('header.title')} <span className="text-[var(--color-primary)]">{t('header.year')}</span>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase">{t('header.simulator')}</p>
                {stats.groupProgress > 0 && (
                  <span className="text-[10px] bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded-full">
                    {Math.round((stats.groupProgress + stats.knockoutProgress) / 2)}% {t('nav.complete')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-1 bg-[var(--color-bg-dark)] p-1 rounded-lg border border-white/10" role="tablist" aria-label="Main navigation">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isStream = tab.special;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold uppercase transition-all ${
                    activeTab === tab.id
                      ? isStream
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-[0_0_15px_rgba(0,255,133,0.3)]'
                      : isStream
                        ? 'text-purple-400 hover:text-pink-400 hover:bg-purple-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isStream && activeTab !== tab.id ? 'animate-pulse' : ''}`} />
                  {tab.label}
                  {tab.id === 'groups' && stats.completedGroupMatches > 0 && (
                    <span className={`text-[10px] ${activeTab === tab.id ? 'text-[var(--color-bg-dark)]/70' : 'text-gray-500'}`}>
                      ({stats.completedGroupMatches}/{stats.totalGroupMatches})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right toolbar */}
          <div className="flex items-center gap-1">
            <div className="hidden md:block">
              <SearchFilter
                onSelectTeam={() => onTabChange('groups')}
                onSelectGroup={() => onTabChange('groups')}
              />
            </div>
            <ThemeToggle />
            <LanguageSelector />
            <button
              onClick={onShowAchievements}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
              title="Achievements"
              aria-label="Show achievements"
            >
              <Award className="w-4 h-4 text-yellow-400" />
            </button>
            <button
              onClick={onShowShortcuts}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
              title="Keyboard shortcuts (?)"
              aria-label="Show keyboard shortcuts"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300" role="tablist">
            <div className="grid grid-cols-3 gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isStream = tab.special;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs font-bold uppercase transition-all ${
                      activeTab === tab.id
                        ? isStream
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                          : 'bg-[var(--color-primary)] text-[var(--color-bg-dark)] shadow-[0_0_15px_rgba(0,255,133,0.3)]'
                        : isStream
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-[var(--color-bg-dark)] text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isStream && activeTab !== tab.id ? 'animate-pulse' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[var(--color-bg-dark)]" role="progressbar" aria-valuenow={Math.round((stats.groupProgress + stats.knockoutProgress) / 2)} aria-valuemin="0" aria-valuemax="100">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] transition-all duration-500"
          style={{ width: `${(stats.groupProgress + stats.knockoutProgress) / 2}%` }}
        />
      </div>
    </header>
  );
};

export default Header;
