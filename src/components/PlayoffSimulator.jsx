import React from 'react';
import { TEAMS, PLAYOFF_PATHS } from '../data/teams';
import { Check, AlertCircle, Globe, Flag } from 'lucide-react';

const PlayoffSimulator = ({ onWinnerSelect, selectedWinners }) => {
  const allSelected = Object.keys(PLAYOFF_PATHS).every(key => selectedWinners[key]);
  const selectedCount = Object.keys(selectedWinners).length;
  const totalPaths = Object.keys(PLAYOFF_PATHS).length;

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

      {/* Playoff Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Object.entries(PLAYOFF_PATHS).map(([key, path]) => {
          const isSelected = !!selectedWinners[key];
          const isUEFA = key.startsWith('UEFA');

          return (
            <div
              key={key}
              className={`
                bg-[#001533] rounded-xl overflow-hidden border transition-all duration-300
                ${isSelected
                  ? 'border-[#00FF85]/50 shadow-[0_0_20px_rgba(0,255,133,0.1)]'
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
                {isSelected ? (
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

                  return (
                    <button
                      key={teamId}
                      onClick={() => onWinnerSelect(key, teamId)}
                      className={`
                        w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-200
                        ${isThisSelected
                          ? 'bg-[#00FF85] text-[#00204C] shadow-[0_0_15px_rgba(0,255,133,0.3)] font-bold transform scale-[1.02]'
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
                      {isThisSelected && (
                        <span className="bg-[#00204C] text-[#00FF85] rounded-full p-1.5">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
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
          <li>- Select one winner from each path to complete the 48-team lineup</li>
          <li>- You can change your selections at any time before entering match results</li>
        </ul>
      </div>
    </div>
  );
};

export default PlayoffSimulator;
