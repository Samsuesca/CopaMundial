import React from 'react';
import { TEAMS, PLAYOFF_PATHS } from '../data/teams';

const PlayoffSimulator = ({ onWinnerSelect, selectedWinners }) => {
    return (
        <div className="mb-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Playoff <span className="text-[#00FF85]">Qualifiers</span></h2>
                <p className="text-gray-400 mt-2">Select the winners to complete the World Cup groups</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(PLAYOFF_PATHS).map(([key, path]) => (
                    <div key={key} className="bg-[#001533] p-6 rounded-xl border border-white/5 shadow-lg hover:border-[#00FF85]/30 transition-all duration-300 group">
                        <h3 className="text-lg font-bold mb-4 text-[#00FF85] uppercase tracking-wider border-b border-white/5 pb-2">
                            {path.name}
                        </h3>
                        <div className="space-y-3">
                            {path.candidates.map(teamId => {
                                const team = TEAMS.find(t => t.id === teamId);
                                const isSelected = selectedWinners[key] === teamId;
                                return (
                                    <button
                                        key={teamId}
                                        onClick={() => onWinnerSelect(key, teamId)}
                                        className={`
                      w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-200
                      ${isSelected
                                                ? 'bg-[#00FF85] text-[#00204C] shadow-[0_0_15px_rgba(0,255,133,0.3)] font-bold transform scale-[1.02]'
                                                : 'bg-[#000F24] text-gray-300 hover:bg-white/10 hover:text-white'
                                            }
                    `}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="text-2xl">{team?.flag}</span>
                                            <span className="text-sm">{team?.name}</span>
                                        </span>
                                        {isSelected && (
                                            <span className="bg-[#00204C] text-[#00FF85] rounded-full p-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayoffSimulator;
