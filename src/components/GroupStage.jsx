import React, { useState } from 'react';
import MatchInput from './MatchInput';
import { ChevronDown, ChevronUp, Info, Trophy, AlertCircle } from 'lucide-react';

const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#00204C] border border-[#00FF85]/30 rounded-lg text-xs text-gray-300 whitespace-nowrap shadow-xl animate-in fade-in zoom-in-95 duration-200">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#00204C]" />
        </div>
      )}
    </div>
  );
};

const GroupCard = ({ group, groupMatches, groupStandings, teams, onMatchUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate group stats
  const groupTeamIds = group.teams;
  const groupTeamObjects = groupTeamIds.map(id => teams.find(t => t.id === id));
  const avgRanking = groupTeamObjects.reduce((acc, t) => acc + (t?.rating || 100), 0) / groupTeamObjects.length;
  const dangerScore = Math.round(avgRanking);

  // Determine group difficulty
  let dangerColor = 'text-green-400';
  let dangerLabel = 'Easy';
  let dangerBg = 'bg-green-500/10';
  if (dangerScore < 20) {
    dangerColor = 'text-red-500';
    dangerLabel = 'Death';
    dangerBg = 'bg-red-500/10';
  } else if (dangerScore < 35) {
    dangerColor = 'text-orange-400';
    dangerLabel = 'Hard';
    dangerBg = 'bg-orange-500/10';
  } else if (dangerScore < 50) {
    dangerColor = 'text-yellow-400';
    dangerLabel = 'Medium';
    dangerBg = 'bg-yellow-500/10';
  }

  // Calculate completion
  const completedMatches = groupMatches.filter(m => m.finished).length;
  const totalMatches = groupMatches.length;
  const isComplete = completedMatches === totalMatches;

  // Check for unresolved playoffs
  const hasUnresolvedPlayoff = groupTeamIds.some(id => id.startsWith('PLAYOFF_'));

  return (
    <div className={`bg-[#001533] rounded-xl overflow-hidden border transition-all duration-300 ${
      isComplete
        ? 'border-[#00FF85]/30 shadow-[0_0_20px_rgba(0,255,133,0.1)]'
        : hasUnresolvedPlayoff
          ? 'border-yellow-500/30'
          : 'border-white/5 hover:border-[#00FF85]/30'
    }`}>
      {/* Header */}
      <div
        className="bg-gradient-to-r from-[#00204C] to-[#001533] p-4 border-b border-white/5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-xl md:text-2xl font-black text-white italic">
              Group <span className="text-[#00FF85]">{group.id}</span>
            </h3>
            {isComplete && (
              <span className="bg-[#00FF85]/20 text-[#00FF85] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                Complete
              </span>
            )}
            {hasUnresolvedPlayoff && (
              <Tooltip content="Select playoff winner in Playoffs tab">
                <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 cursor-help">
                  <AlertCircle className="w-3 h-3" />
                  Pending
                </span>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Tooltip content={`Average team ranking: ${dangerScore}. Lower = harder group.`}>
              <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${dangerBg} cursor-help`}>
                <span className={`text-xs font-bold uppercase ${dangerColor}`}>
                  {dangerLabel}
                </span>
              </div>
            </Tooltip>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-[#000F24] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00FF85] transition-all duration-500"
            style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
          />
        </div>
        <div className="mt-1 text-[10px] text-gray-500">
          {completedMatches}/{totalMatches} matches played
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Standings Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="px-2 py-2 w-2">#</th>
                  <th className="px-2 py-2">Team</th>
                  <th className="px-1 py-2 text-center hidden md:table-cell">
                    <Tooltip content="FIFA Ranking"><span className="cursor-help">Rank</span></Tooltip>
                  </th>
                  <th className="px-1 py-2 text-center">
                    <Tooltip content="Matches Played"><span className="cursor-help">MP</span></Tooltip>
                  </th>
                  <th className="px-1 py-2 text-center hidden sm:table-cell">
                    <Tooltip content="Wins"><span className="cursor-help">W</span></Tooltip>
                  </th>
                  <th className="px-1 py-2 text-center hidden sm:table-cell">
                    <Tooltip content="Draws"><span className="cursor-help">D</span></Tooltip>
                  </th>
                  <th className="px-1 py-2 text-center hidden sm:table-cell">
                    <Tooltip content="Losses"><span className="cursor-help">L</span></Tooltip>
                  </th>
                  <th className="px-1 py-2 text-center">
                    <Tooltip content="Goal Difference"><span className="cursor-help">GD</span></Tooltip>
                  </th>
                  <th className="px-1 py-2 text-center text-white">
                    <Tooltip content="Points"><span className="cursor-help">Pts</span></Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {groupStandings.map((teamStats, index) => {
                  const team = teams.find(t => t.id === teamStats.id);
                  const isQualified = index < 2;
                  const isThird = index === 2;
                  const isPlayoff = teamStats.id.startsWith('PLAYOFF_');

                  return (
                    <tr key={teamStats.id} className={`
                      transition-colors hover:bg-white/5
                      ${isQualified ? 'bg-[#00FF85]/5' : ''}
                      ${isThird ? 'bg-yellow-500/5' : ''}
                    `}>
                      <td className="px-2 py-2.5 font-bold text-gray-500">{index + 1}</td>
                      <td className="px-2 py-2.5 font-medium text-white">
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-base md:text-lg">{team?.flag || '🏳️'}</span>
                          <span className={`truncate max-w-[80px] md:max-w-[120px] ${isPlayoff ? 'text-yellow-400 italic' : ''}`}>
                            {isPlayoff ? 'TBD (Playoff)' : (team?.name || teamStats.id)}
                          </span>
                          {isQualified && (
                            <Tooltip content="Qualified for Round of 32">
                              <span className="w-2 h-2 rounded-full bg-[#00FF85] flex-shrink-0 cursor-help" />
                            </Tooltip>
                          )}
                          {isThird && (
                            <Tooltip content="May qualify as best 3rd place">
                              <span className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0 cursor-help" />
                            </Tooltip>
                          )}
                        </div>
                      </td>
                      <td className="px-1 py-2 text-center text-xs text-gray-500 hidden md:table-cell">
                        {team?.rating || '-'}
                      </td>
                      <td className="px-1 py-2 text-center">{teamStats.played}</td>
                      <td className="px-1 py-2 text-center hidden sm:table-cell">{teamStats.won}</td>
                      <td className="px-1 py-2 text-center hidden sm:table-cell">{teamStats.drawn}</td>
                      <td className="px-1 py-2 text-center hidden sm:table-cell">{teamStats.lost}</td>
                      <td className={`px-1 py-2 text-center font-medium ${
                        teamStats.gd > 0 ? 'text-green-400' : teamStats.gd < 0 ? 'text-red-400' : ''
                      }`}>
                        {teamStats.gd > 0 ? '+' : ''}{teamStats.gd}
                      </td>
                      <td className="px-1 py-2 text-center font-bold text-white text-base">{teamStats.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-[10px] text-gray-500 border-t border-white/5 pt-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF85]" />
              <span>Qualified</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Possible qualification</span>
            </div>
          </div>

          {/* Matches */}
          <div className="space-y-2 md:space-y-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-3 h-3" />
              Matches
            </h4>
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
      )}
    </div>
  );
};

const GroupStage = ({ groups, matches, teams, standings, onMatchUpdate }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">
          Group <span className="text-[#00FF85]">Stage</span>
        </h2>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          12 groups of 4 teams. Top 2 + 8 best 3rd place teams qualify.
        </p>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {groups.map(group => {
          const groupMatches = matches.filter(m => m.group === group.id);
          const groupStandings = standings[group.id] || [];

          return (
            <GroupCard
              key={group.id}
              group={group}
              groupMatches={groupMatches}
              groupStandings={groupStandings}
              teams={teams}
              onMatchUpdate={onMatchUpdate}
            />
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-[#001533] rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-bold text-gray-400 mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          How Group Stage Works
        </h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>- Each team plays 3 matches (once against each other team in the group)</li>
          <li>- Win = 3 points, Draw = 1 point, Loss = 0 points</li>
          <li>- Teams are ranked by: Points, then Goal Difference, then Goals For</li>
          <li>- Top 2 teams from each group automatically qualify for the Round of 32</li>
          <li>- The 8 best 3rd-place teams also qualify</li>
        </ul>
      </div>
    </div>
  );
};

export default GroupStage;
