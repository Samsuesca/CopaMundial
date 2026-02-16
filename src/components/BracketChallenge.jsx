import React, { useState } from 'react';
import { Clock, Star } from 'lucide-react';
import { TEAMS } from '../data/teams';

const BracketChallenge = ({ state }) => {
  const [predictions, setPredictions] = useState(() => {
    try {
      const saved = localStorage.getItem('wc2026_predictions');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const getTeam = (id) => TEAMS.find(t => t.id === id);

  const handlePredict = (matchId, teamId) => {
    const updated = { ...predictions, [matchId]: teamId };
    setPredictions(updated);
    try { localStorage.setItem('wc2026_predictions', JSON.stringify(updated)); } catch { /* ignore */ }
  };

  // Calculate score
  const score = state.knockoutMatches.reduce((acc, m) => {
    if (m.winner && predictions[m.id] === m.winner) {
      const roundMultiplier = m.id.startsWith('R32') ? 1 :
        m.id.startsWith('R16') ? 2 :
        m.id.startsWith('QF') ? 4 :
        m.id.startsWith('SF') ? 8 :
        m.id === 'Final' ? 16 : 1;
      return acc + roundMultiplier;
    }
    return acc;
  }, 0);

  const correctPredictions = state.knockoutMatches.filter(m => m.winner && predictions[m.id] === m.winner).length;
  const totalPredictions = Object.keys(predictions).length;

  // Upcoming matches (no winner yet, both teams known)
  const upcomingMatches = state.knockoutMatches.filter(m => m.home && m.away && !m.winner).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="bg-gradient-to-r from-yellow-600/20 via-amber-600/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Bracket Challenge
          </h3>
          <div className="text-right">
            <div className="text-3xl font-black text-yellow-400">{score}</div>
            <div className="text-xs text-gray-400">puntos</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-[var(--color-primary)] font-bold text-xl">{totalPredictions}</div>
            <div className="text-gray-500 text-xs">Predicciones</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-green-400 font-bold text-xl">{correctPredictions}</div>
            <div className="text-gray-500 text-xs">Correctas</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-white font-bold text-xl">
              {totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0}%
            </div>
            <div className="text-gray-500 text-xs">Precisión</div>
          </div>
        </div>
      </div>

      {/* Upcoming Predictions */}
      {upcomingMatches.length > 0 && (
        <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/5">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Próximos Partidos - Haz tu Predicción
          </h4>
          <div className="space-y-3">
            {upcomingMatches.map(m => {
              const home = getTeam(m.home);
              const away = getTeam(m.away);
              const predicted = predictions[m.id];

              return (
                <div key={m.id} className="bg-[var(--color-bg-darkest)] rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-2">{m.id}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePredict(m.id, m.home)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                        predicted === m.home
                          ? 'bg-[var(--color-primary)]/20 border-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent'
                      }`}
                    >
                      <span>{home?.flag}</span>
                      <span className="text-xs font-medium truncate">{home?.name}</span>
                    </button>
                    <span className="text-gray-600 text-xs font-bold">VS</span>
                    <button
                      onClick={() => handlePredict(m.id, m.away)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                        predicted === m.away
                          ? 'bg-[var(--color-primary)]/20 border-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent'
                      }`}
                    >
                      <span>{away?.flag}</span>
                      <span className="text-xs font-medium truncate">{away?.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resolved predictions */}
      {correctPredictions > 0 && (
        <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/5">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Resultados de Predicciones
          </h4>
          <div className="space-y-2">
            {state.knockoutMatches.filter(m => m.winner && predictions[m.id]).map(m => {
              const correct = predictions[m.id] === m.winner;
              const team = getTeam(predictions[m.id]);
              return (
                <div key={m.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                  correct ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-12">{m.id}</span>
                    <span>{team?.flag}</span>
                    <span className="text-sm text-white">{team?.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${correct ? 'text-green-400' : 'text-red-400'}`}>
                    {correct ? 'Correcto' : 'Incorrecto'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="bg-[var(--color-bg-darker)] rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-bold text-gray-400 mb-2">Puntuación</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>- Dieciseisavos: 1 punto por acierto</li>
          <li>- Octavos: 2 puntos por acierto</li>
          <li>- Cuartos: 4 puntos por acierto</li>
          <li>- Semifinales: 8 puntos por acierto</li>
          <li>- Final: 16 puntos por acierto</li>
        </ul>
      </div>
    </div>
  );
};

export default BracketChallenge;
