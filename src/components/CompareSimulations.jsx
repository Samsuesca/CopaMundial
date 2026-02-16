import React, { useState } from 'react';
import { GitCompare, X, Trophy, Target } from 'lucide-react';
import { TEAMS } from '../data/teams';

const CompareSimulations = ({ savedSimulations, onClose }) => {
  const [selected, setSelected] = useState([]);

  const getTeam = (id) => TEAMS.find(t => t.id === id);

  const toggleSelect = (sim) => {
    if (selected.find(s => s.id === sim.id)) {
      setSelected(selected.filter(s => s.id !== sim.id));
    } else if (selected.length < 3) {
      setSelected([...selected, sim]);
    }
  };

  const getSimStats = (sim) => {
    const data = sim.data;
    const totalGoals = (data.groupMatches || []).reduce((acc, m) => {
      if (m.finished) return acc + (m.homeScore || 0) + (m.awayScore || 0);
      return acc;
    }, 0) + (data.knockoutMatches || []).reduce((acc, m) => {
      if (m.homeScore !== null && m.awayScore !== null) return acc + m.homeScore + m.awayScore;
      return acc;
    }, 0);

    const finalMatch = (data.knockoutMatches || []).find(m => m.id === 'Final');
    const champion = finalMatch?.winner;
    const completedMatches = (data.groupMatches || []).filter(m => m.finished).length +
      (data.knockoutMatches || []).filter(m => m.winner).length;

    return { totalGoals, champion, completedMatches };
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/10 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-white">Comparar Simulaciones</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSimulations.length < 2 ? (
          <div className="text-center py-8 text-gray-500">
            <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Necesitas al menos 2 simulaciones guardadas para comparar</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-4">Selecciona hasta 3 simulaciones para comparar:</p>

            {/* Selection */}
            <div className="space-y-2 mb-6">
              {savedSimulations.map(sim => (
                <button
                  key={sim.id}
                  onClick={() => toggleSelect(sim)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selected.find(s => s.id === sim.id)
                      ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/10'
                      : 'border-white/10 hover:border-white/30 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">{sim.name}</span>
                    <span className="text-gray-500 text-xs">{new Date(sim.savedAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Comparison Table */}
            {selected.length >= 2 && (
              <div className="bg-[var(--color-bg-darkest)] rounded-xl p-4 border border-white/5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase">
                      <th className="text-left py-2 px-2">Métrica</th>
                      {selected.map(s => (
                        <th key={s.id} className="text-center py-2 px-2">{s.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2 px-2 text-gray-400">Campeón</td>
                      {selected.map(s => {
                        const stats = getSimStats(s);
                        const team = stats.champion ? getTeam(stats.champion) : null;
                        return (
                          <td key={s.id} className="py-2 px-2 text-center">
                            {team ? (
                              <span className="flex items-center justify-center gap-1">
                                <span>{team.flag}</span>
                                <span className="text-white font-medium text-xs">{team.name}</span>
                              </span>
                            ) : <span className="text-gray-600">-</span>}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-gray-400">Goles Totales</td>
                      {selected.map(s => {
                        const stats = getSimStats(s);
                        return <td key={s.id} className="py-2 px-2 text-center text-[var(--color-primary)] font-bold">{stats.totalGoals}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-gray-400">Partidos Jugados</td>
                      {selected.map(s => {
                        const stats = getSimStats(s);
                        return <td key={s.id} className="py-2 px-2 text-center text-white">{stats.completedMatches}</td>;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompareSimulations;
