import React from 'react';
import MatchInput from './MatchInput';

const GroupStage = ({ groups, matches, teams, standings, onMatchUpdate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {groups.map(group => {
                const groupMatches = matches.filter(m => m.group === group.id);
                const groupStandings = standings[group.id] || [];

                // Calculate Average Ranking (Danger Score)
                const groupTeamIds = group.teams;
                const groupTeamObjects = groupTeamIds.map(id => teams.find(t => t.id === id));
                const avgRanking = groupTeamObjects.reduce((acc, t) => acc + (t?.rating || 100), 0) / groupTeamObjects.length;
                const dangerScore = Math.round(avgRanking);

                // Determine Danger Level Color
                let dangerColor = 'text-green-400';
                if (dangerScore < 20) dangerColor = 'text-red-500'; // Very Hard (Low avg rank)
                else if (dangerScore < 40) dangerColor = 'text-orange-400'; // Hard
                else if (dangerScore < 60) dangerColor = 'text-yellow-400'; // Medium

                return (
                    <div key={group.id} className="bg-[#001533] rounded-xl overflow-hidden border border-white/5 shadow-lg hover:border-[#00FF85]/30 transition-all duration-300">
                        <div className="bg-gradient-to-r from-[#00204C] to-[#001533] p-4 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-white italic">Group <span className="text-[#00FF85]">{group.id}</span></h3>
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wider mt-1">
                                    <span className="text-gray-400">Avg Rank:</span>
                                    <span className={`font-bold ${dangerColor}`}>{dangerScore}</span>
                                </div>
                            </div>
                            <div className="h-1 w-12 bg-[#00FF85] rounded-full"></div>
                        </div>

                        {/* Standings Table */}
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-400 mb-6">
                                    <thead className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                                        <tr>
                                            <th className="px-2 py-2">Team</th>
                                            <th className="px-1 py-2 text-center text-[10px]">Rank</th>
                                            <th className="px-1 py-2 text-center">MP</th>
                                            <th className="px-1 py-2 text-center">W</th>
                                            <th className="px-1 py-2 text-center">D</th>
                                            <th className="px-1 py-2 text-center">L</th>
                                            <th className="px-1 py-2 text-center">GD</th>
                                            <th className="px-1 py-2 text-center text-white">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {groupStandings.map((teamStats, index) => {
                                            const team = teams.find(t => t.id === teamStats.id);
                                            const isQualified = index < 2;
                                            const isThird = index === 2;

                                            return (
                                                <tr key={teamStats.id} className={`
                          ${isQualified ? 'bg-[#00FF85]/5' : ''} 
                          transition-colors hover:bg-white/5
                        `}>
                                                    <td className="px-2 py-3 font-medium text-white flex items-center gap-3">
                                                        <span className="text-lg">{team?.flag || '🏳️'}</span>
                                                        <span className="truncate max-w-[100px]">{team?.name || teamStats.id}</span>
                                                        {isQualified && <span className="w-1.5 h-1.5 rounded-full bg-[#00FF85]"></span>}
                                                        {isThird && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
                                                    </td>
                                                    <td className="px-1 py-2 text-center text-xs text-gray-500">{team?.rating || '-'}</td>
                                                    <td className="px-1 py-2 text-center">{teamStats.played}</td>
                                                    <td className="px-1 py-2 text-center">{teamStats.won}</td>
                                                    <td className="px-1 py-2 text-center">{teamStats.drawn}</td>
                                                    <td className="px-1 py-2 text-center">{teamStats.lost}</td>
                                                    <td className="px-1 py-2 text-center">{teamStats.gd}</td>
                                                    <td className="px-1 py-2 text-center font-bold text-white text-base">{teamStats.points}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Matches */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Matches</h4>
                                {groupMatches.map(match => (
                                    <MatchInput
                                        key={match.id}
                                        match={match}
                                        homeTeam={teams.find(t => t.id === match.home)}
                                        awayTeam={teams.find(t => t.id === match.away)}
                                        onScoreChange={onMatchUpdate}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GroupStage;
