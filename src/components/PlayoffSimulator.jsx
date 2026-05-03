import React, { useState } from 'react';
import { TEAMS, PLAYOFF_PATHS, REAL_PLAYOFF_RESULTS } from '../data/teams';
import { Check, AlertCircle, Globe, Flag, Trophy, Sparkles, Info } from 'lucide-react';

const TeamLabel = ({ teamId, size = 'sm' }) => {
  const team = TEAMS.find(t => t.id === teamId);
  if (!team) return <span className="text-gray-500">?</span>;
  const flagSize = size === 'lg' ? 'text-xl' : 'text-base';
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';
  return (
    <span className="flex items-center gap-1.5 min-w-0">
      <span className={flagSize}>{team.flag}</span>
      <span className={`${textSize} font-medium truncate`}>{team.name}</span>
    </span>
  );
};

const MatchRow = ({ match, winnerId }) => {
  const homeWon = match.penalties ? match.penalties.winner === match.home : match.homeScore > match.awayScore;
  const awayWon = match.penalties ? match.penalties.winner === match.away : match.awayScore > match.homeScore;
  const homeWinner = homeWon && match.home === winnerId;
  const awayWinner = awayWon && match.away === winnerId;

  return (
    <div className="bg-[#000F24] rounded-md px-2 py-1.5 border border-white/5">
      <div className="flex items-center justify-between gap-2">
        <div className={`flex-1 min-w-0 ${homeWon ? 'text-white' : 'text-gray-500'} ${homeWinner ? 'font-bold' : ''}`}>
          <TeamLabel teamId={match.home} />
        </div>
        <div className="text-xs font-mono tabular-nums text-gray-300 shrink-0">
          {match.homeScore}-{match.awayScore}
          {match.aet && <span className="text-[9px] text-gray-500 ml-1">aet</span>}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <div className={`flex-1 min-w-0 ${awayWon ? 'text-white' : 'text-gray-500'} ${awayWinner ? 'font-bold' : ''}`}>
          <TeamLabel teamId={match.away} />
        </div>
        {match.penalties && (
          <div className="text-[10px] font-mono tabular-nums text-yellow-400 shrink-0">
            pens {match.penalties.home}-{match.penalties.away}
          </div>
        )}
      </div>
    </div>
  );
};

const PlayoffSimulator = ({ onWinnerSelect, selectedWinners }) => {
  const [showBrackets, setShowBrackets] = useState({});
  const allSelected = Object.keys(PLAYOFF_PATHS).every(key => selectedWinners[key]);
  const selectedCount = Object.keys(selectedWinners).length;
  const totalPaths = Object.keys(PLAYOFF_PATHS).length;

  const matchesOfficial = Object.keys(PLAYOFF_PATHS).every(
    key => selectedWinners[key] === REAL_PLAYOFF_RESULTS[key]?.winner
  );

  const applyOfficialResults = () => {
    Object.entries(REAL_PLAYOFF_RESULTS).forEach(([key, data]) => {
      onWinnerSelect(key, data.winner);
    });
  };

  const toggleBracket = (key) => {
    setShowBrackets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">
          Playoff <span className="text-[#00FF85]">Qualifiers</span>
        </h2>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Select the winners from each playoff path to complete the World Cup groups
        </p>

        {/* Progress */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-500">Progress</span>
            <span className={selectedCount === totalPaths ? 'text-[#00FF85]' : 'text-gray-400'}>
              {selectedCount}/{totalPaths} selected
            </span>
          </div>
          <div className="h-2 bg-[#001533] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00FF85] to-[#00CC6A] transition-all duration-500"
              style={{ width: `${(selectedCount / totalPaths) * 100}%` }}
            />
          </div>
        </div>

        {allSelected && (
          <div className="mt-4 inline-flex items-center gap-2 bg-[#00FF85]/10 text-[#00FF85] px-4 py-2 rounded-full text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
            <Check className="w-4 h-4" />
            All playoff winners selected! Go to Groups to start the tournament.
          </div>
        )}
      </div>

      {/* Official Results Banner */}
      <div className={`rounded-xl p-4 border transition-all duration-300 ${
        matchesOfficial
          ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/30'
          : 'bg-[#001533] border-white/10'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${matchesOfficial ? 'bg-yellow-500/20' : 'bg-white/5'}`}>
              <Trophy className={`w-5 h-5 ${matchesOfficial ? 'text-yellow-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                Resultados Oficiales — Marzo 2026
                {matchesOfficial && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    APLICADO
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Carga los 6 ganadores reales de los repechajes UEFA e Intercontinentales.
              </p>
            </div>
          </div>
          <button
            onClick={applyOfficialResults}
            disabled={matchesOfficial}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
              matchesOfficial
                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-500 text-[#00204C] hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {matchesOfficial ? 'Resultados aplicados' : 'Aplicar resultados oficiales'}
          </button>
        </div>
      </div>

      {/* Playoff Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Object.entries(PLAYOFF_PATHS).map(([key, path]) => {
          const isSelected = !!selectedWinners[key];
          const isUEFA = key.startsWith('UEFA');
          const real = REAL_PLAYOFF_RESULTS[key];
          const isOfficial = isSelected && selectedWinners[key] === real?.winner;
          const showBracket = showBrackets[key];

          return (
            <div
              key={key}
              className={`
                bg-[#001533] rounded-xl overflow-hidden border transition-all duration-300
                ${isSelected
                  ? isOfficial
                    ? 'border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]'
                    : 'border-[#00FF85]/50 shadow-[0_0_20px_rgba(0,255,133,0.1)]'
                  : 'border-white/5 hover:border-white/20'
                }
              `}
            >
              {/* Path Header */}
              <div className={`px-4 py-3 border-b border-white/5 flex items-center justify-between ${
                isUEFA ? 'bg-blue-500/5' : 'bg-orange-500/5'
              }`}>
                <div className="flex items-center gap-2">
                  {isUEFA ? (
                    <Flag className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-orange-400" />
                  )}
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${
                    isUEFA ? 'text-blue-400' : 'text-orange-400'
                  }`}>
                    {path.name}
                  </h3>
                </div>
                {isOfficial ? (
                  <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Official
                  </span>
                ) : isSelected ? (
                  <span className="bg-[#00FF85]/20 text-[#00FF85] text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Selected
                  </span>
                ) : (
                  <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </div>

              {/* Candidates */}
              <div className="p-4 space-y-2">
                {path.candidates.map(teamId => {
                  const team = TEAMS.find(t => t.id === teamId);
                  const isThisSelected = selectedWinners[key] === teamId;
                  const isRealWinner = real?.winner === teamId;

                  return (
                    <button
                      key={teamId}
                      onClick={() => onWinnerSelect(key, teamId)}
                      className={`
                        w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-200
                        ${isThisSelected
                          ? isRealWinner
                            ? 'bg-yellow-500 text-[#00204C] shadow-[0_0_15px_rgba(234,179,8,0.3)] font-bold transform scale-[1.02]'
                            : 'bg-[#00FF85] text-[#00204C] shadow-[0_0_15px_rgba(0,255,133,0.3)] font-bold transform scale-[1.02]'
                          : 'bg-[#000F24] text-gray-300 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/20'
                        }
                      `}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-2xl">{team?.flag}</span>
                        <div>
                          <span className="text-sm block">{team?.name}</span>
                          <span className={`text-[10px] ${isThisSelected ? 'text-[#00204C]/70' : 'text-gray-500'}`}>
                            Rank #{team?.rating}
                          </span>
                        </div>
                      </span>
                      <span className="flex items-center gap-2">
                        {isRealWinner && !isThisSelected && (
                          <span className="text-[9px] text-yellow-400/70 uppercase tracking-wider font-bold">
                            Real
                          </span>
                        )}
                        {isThisSelected && (
                          <span className="bg-[#00204C] text-current rounded-full p-1.5">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Real Bracket Toggle */}
              {real && (
                <div className="border-t border-white/5">
                  <button
                    onClick={() => toggleBracket(key)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" />
                      Bracket real ({real.date})
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {showBracket ? 'Ocultar' : 'Ver'}
                    </span>
                  </button>
                  {showBracket && (
                    <div className="px-4 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {real.semifinals.length > 0 && (
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 font-bold">
                            {real.semifinals.length === 1 ? 'Semifinal' : 'Semifinales'}
                          </div>
                          <div className="space-y-1.5">
                            {real.semifinals.map((m, i) => (
                              <MatchRow key={i} match={m} winnerId={real.winner} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 mt-2 font-bold">
                          Final
                        </div>
                        <MatchRow match={real.final} winnerId={real.winner} />
                      </div>
                      {real.note && (
                        <div className="mt-2 text-[10px] text-yellow-400/80 italic leading-relaxed">
                          {real.note}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-[#001533] rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          About Playoffs
        </h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>- <span className="text-blue-400">UEFA Paths (A-D)</span>: European playoff qualifiers competing for 4 spots</li>
          <li>- <span className="text-orange-400">Intercontinental (1-2)</span>: Teams from different confederations competing for 2 spots</li>
          <li>- <span className="text-yellow-400">Resultados oficiales</span>: aplica los ganadores reales de marzo 2026 con un click</li>
          <li>- Puedes cambiar tus selecciones manualmente en cualquier momento</li>
        </ul>
      </div>
    </div>
  );
};

export default PlayoffSimulator;
