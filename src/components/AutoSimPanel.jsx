import React, { useState } from 'react';
import { Cpu, Shuffle, Zap, Dices, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { simulateGroupMatches, simulateKnockoutMatch } from '../utils/autoSimulator';
import { unlockManualAchievement } from '../utils/achievements';
import { playSoundIfEnabled, playSuccessSound } from '../utils/sounds';

const AutoSimPanel = ({ state, actions }) => {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [randomFactor, setRandomFactor] = useState(0.5);
  const [simulating, setSimulating] = useState(false);

  const handleSimulateGroups = () => {
    setSimulating(true);
    const simulated = simulateGroupMatches(state.groupMatches, randomFactor);
    simulated.forEach(m => {
      if (m.finished && m.homeScore !== null) {
        actions.updateGroupMatch(m.id, 'homeScore', String(m.homeScore));
        actions.updateGroupMatch(m.id, 'awayScore', String(m.awayScore));
      }
    });
    unlockManualAchievement('simulator');
    playSoundIfEnabled(playSuccessSound);
    setTimeout(() => setSimulating(false), 500);
  };

  const handleSimulateKnockout = () => {
    setSimulating(true);
    // Simulate knockout matches sequentially (round by round)
    const rounds = ['R32', 'R16', 'QF', 'SF', 'Final', '3rdPlace'];
    let delay = 0;
    rounds.forEach(round => {
      setTimeout(() => {
        const matchesInRound = state.knockoutMatches.filter(m =>
          m.id.startsWith(round) || m.id === round
        );
        matchesInRound.forEach(m => {
          if (m.home && m.away && m.homeScore === null) {
            const result = simulateKnockoutMatch(m, randomFactor);
            actions.updateKnockoutMatch(result.id, 'homeScore', String(result.homeScore));
            actions.updateKnockoutMatch(result.id, 'awayScore', String(result.awayScore));
            if (result.penaltyWinner) {
              setTimeout(() => actions.setPenaltyWinner(result.id, result.penaltyWinner), 50);
            }
          }
        });
      }, delay);
      delay += 300;
    });
    unlockManualAchievement('simulator');
    playSoundIfEnabled(playSuccessSound);
    setTimeout(() => setSimulating(false), delay + 500);
  };

  const handleSimulateAll = () => {
    handleSimulateGroups();
    setTimeout(handleSimulateKnockout, 1000);
  };

  return (
    <div className="bg-[var(--color-bg-darker)] rounded-xl border border-white/5 overflow-hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">{t('autosim.title')}</span>
          <span className="text-xs text-gray-500">{t('autosim.description')}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Random Factor Slider */}
          <div className="mb-4">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
              Factor de Aleatoriedad: {Math.round(randomFactor * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={randomFactor}
              onChange={(e) => setRandomFactor(parseFloat(e.target.value))}
              className="w-full accent-purple-400"
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>Realista</span>
              <span>Caótico</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={handleSimulateAll}
              disabled={simulating}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-500/20 text-purple-400 rounded-lg font-bold text-sm hover:bg-purple-500/30 transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {t('autosim.simulateAll')}
            </button>
            <button
              onClick={handleSimulateGroups}
              disabled={simulating}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500/20 text-blue-400 rounded-lg font-bold text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              {t('autosim.simulateGroups')}
            </button>
            <button
              onClick={handleSimulateKnockout}
              disabled={simulating}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-green-500/20 text-green-400 rounded-lg font-bold text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              <Shuffle className="w-4 h-4" />
              {t('autosim.simulateKnockout')}
            </button>
            <button
              onClick={() => { setRandomFactor(1.0); handleSimulateAll(); }}
              disabled={simulating}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-orange-500/20 text-orange-400 rounded-lg font-bold text-sm hover:bg-orange-500/30 transition-colors disabled:opacity-50"
            >
              <Dices className="w-4 h-4" />
              {t('autosim.randomize')}
            </button>
          </div>

          {simulating && (
            <div className="mt-3 text-center text-sm text-purple-400 animate-pulse">
              Simulando partidos...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoSimPanel;
