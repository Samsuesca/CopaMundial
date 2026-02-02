import React, { useState } from 'react';
import {
  Monitor,
  Volume2,
  VolumeX,
  Palette,
  Maximize,
  Eye,
  Copy,
  Check,
  Zap,
  Trophy,
  Target,
  Settings
} from 'lucide-react';
import LiveScoreboard from './LiveScoreboard';
import { Confetti, GoalExplosion, ChampionCelebration } from './Celebrations';

const StreamerControls = ({ matches, teams, currentMatch, onSelectMatch }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCelebration, setShowCelebration] = useState(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('default');

  const themes = {
    default: { primary: '#00FF85', bg: '#00204C' },
    red: { primary: '#FF4444', bg: '#1a0000' },
    blue: { primary: '#4488FF', bg: '#000a1a' },
    gold: { primary: '#FFD700', bg: '#1a1500' },
    purple: { primary: '#9944FF', bg: '#0a001a' },
  };

  const copyOverlayUrl = () => {
    const url = `${window.location.origin}/overlay`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerCelebration = (type) => {
    setShowCelebration(type);
    setTimeout(() => setShowCelebration(null), type === 'champion' ? 6000 : 3000);
  };

  // Get active matches (with teams assigned)
  const activeMatches = matches?.filter(m => m.home && m.away) || [];
  const knockoutMatches = activeMatches.filter(m => !m.id.startsWith('G'));

  return (
    <div className="bg-[#001533] rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex items-center gap-2">
        <Monitor className="w-5 h-5 text-white" />
        <span className="text-white font-bold uppercase tracking-wider text-sm">Streamer Controls</span>
        <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded">BETA</span>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Acciones Rapidas
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => triggerCelebration('goal')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00FF85]/20 text-[#00FF85] rounded-lg font-bold hover:bg-[#00FF85]/30 transition-colors"
            >
              <Target className="w-4 h-4" />
              GOL!
            </button>
            <button
              onClick={() => triggerCelebration('confetti')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-lg font-bold hover:bg-yellow-500/30 transition-colors"
            >
              🎉 Confetti
            </button>
            <button
              onClick={() => triggerCelebration('champion')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 text-purple-400 rounded-lg font-bold hover:bg-purple-500/30 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Campeon
            </button>
            <button
              onClick={() => setShowOverlay(!showOverlay)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-colors ${
                showOverlay
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
              }`}
            >
              <Eye className="w-4 h-4" />
              {showOverlay ? 'Ocultar' : 'Mostrar'} Overlay
            </button>
          </div>
        </div>

        {/* Match Selector */}
        <div>
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
            Partido en Pantalla
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {knockoutMatches.slice(0, 8).map(match => {
              const home = teams?.find(t => t.id === match.home);
              const away = teams?.find(t => t.id === match.away);
              const isSelected = currentMatch?.id === match.id;

              return (
                <button
                  key={match.id}
                  onClick={() => onSelectMatch?.(match)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#00FF85]/20 border-2 border-[#00FF85]'
                      : 'bg-[#000F24] border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{home?.flag}</span>
                    <span className="text-white text-sm font-medium">
                      {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
                    </span>
                    <span>{away?.flag}</span>
                  </div>
                  <span className="text-xs text-gray-500">{match.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sound Toggle */}
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sonido</h4>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                soundEnabled
                  ? 'bg-[#00FF85]/20 text-[#00FF85]'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              {soundEnabled ? 'Activado' : 'Silenciado'}
            </button>
          </div>

          {/* Theme Selector */}
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tema</h4>
            <div className="flex gap-2">
              {Object.entries(themes).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => setTheme(name)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    theme === name ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: colors.primary }}
                  title={name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* OBS Integration */}
        <div className="bg-[#000F24] rounded-lg p-4">
          <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Settings className="w-3 h-3" />
            Integracion OBS
          </h4>
          <p className="text-gray-400 text-xs mb-3">
            Usa esta URL como Browser Source en OBS para mostrar el overlay:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/overlay`}
              className="flex-1 bg-[#001533] border border-white/10 rounded px-3 py-2 text-sm text-gray-300"
            />
            <button
              onClick={copyOverlayUrl}
              className="px-4 py-2 bg-[#00FF85] text-[#00204C] rounded font-bold hover:bg-[#00CC6A] transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Tamaño recomendado: 1920x1080 para pantalla completa, 800x200 para widget
          </p>
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => document.documentElement.requestFullscreen?.()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Maximize className="w-5 h-5" />
          Pantalla Completa
        </button>
      </div>

      {/* Overlay Preview */}
      {showOverlay && currentMatch && (
        <LiveScoreboard
          match={currentMatch}
          teams={teams}
          onClose={() => setShowOverlay(false)}
          isOverlay={true}
        />
      )}

      {/* Celebrations */}
      {showCelebration === 'confetti' && (
        <Confetti count={150} duration={3000} onComplete={() => setShowCelebration(null)} />
      )}
      {showCelebration === 'goal' && (
        <GoalExplosion onComplete={() => setShowCelebration(null)} />
      )}
      {showCelebration === 'champion' && (
        <ChampionCelebration onComplete={() => setShowCelebration(null)} />
      )}
    </div>
  );
};

export default StreamerControls;
