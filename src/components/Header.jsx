import React from 'react';
import { Trophy, Users, Swords, BarChart3, Menu, X, Radio } from 'lucide-react';
import { useState } from 'react';

const Header = ({ activeTab, onTabChange, stats }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'playoffs', label: 'Playoffs', icon: Users },
    { id: 'groups', label: 'Groups', icon: Trophy },
    { id: 'knockout', label: 'Knockout', icon: Swords },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'stream', label: 'Stream', icon: Radio, special: true },
  ];

  const handleTabChange = (tab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#001533] border-b border-[#00FF85]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Trophy className="w-8 h-8 text-[#00FF85]" />
              {stats.champion && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">
                World Cup <span className="text-[#00FF85]">2026</span>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase">Simulator</p>
                {stats.groupProgress > 0 && (
                  <span className="text-[10px] bg-[#00FF85]/20 text-[#00FF85] px-2 py-0.5 rounded-full">
                    {Math.round((stats.groupProgress + stats.knockoutProgress) / 2)}% Complete
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1 bg-[#00204C] p-1 rounded-lg border border-white/10">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isStream = tab.special;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold uppercase transition-all ${
                    activeTab === tab.id
                      ? isStream
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'bg-[#00FF85] text-[#00204C] shadow-[0_0_15px_rgba(0,255,133,0.3)]'
                      : isStream
                        ? 'text-purple-400 hover:text-pink-400 hover:bg-purple-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isStream && activeTab !== tab.id ? 'animate-pulse' : ''}`} />
                  {tab.label}
                  {tab.id === 'groups' && stats.completedGroupMatches > 0 && (
                    <span className={`text-[10px] ${activeTab === tab.id ? 'text-[#00204C]/70' : 'text-gray-500'}`}>
                      ({stats.completedGroupMatches}/{stats.totalGroupMatches})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isStream = tab.special;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold uppercase transition-all ${
                      activeTab === tab.id
                        ? isStream
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                          : 'bg-[#00FF85] text-[#00204C] shadow-[0_0_15px_rgba(0,255,133,0.3)]'
                        : isStream
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-[#00204C] text-gray-400 hover:text-white border border-white/10'
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
      <div className="h-1 bg-[#00204C]">
        <div
          className="h-full bg-gradient-to-r from-[#00FF85] to-[#00CC6A] transition-all duration-500"
          style={{ width: `${(stats.groupProgress + stats.knockoutProgress) / 2}%` }}
        />
      </div>
    </header>
  );
};

export default Header;
