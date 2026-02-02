import React from 'react';

// Compact scoreboard widget for OBS overlay (transparent background)
const CompactWidget = ({ match, teams, style = 'minimal' }) => {
  const homeTeam = teams?.find(t => t.id === match?.home);
  const awayTeam = teams?.find(t => t.id === match?.away);

  if (!match) return null;

  if (style === 'minimal') {
    return (
      <div className="inline-flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#00FF85]/30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{homeTeam?.flag || '🏳️'}</span>
          <span className="text-white font-bold text-sm">{homeTeam?.name?.slice(0, 3).toUpperCase() || 'TBD'}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#00204C] rounded">
          <span className="text-2xl font-black text-white">{match.homeScore ?? '-'}</span>
          <span className="text-gray-500">:</span>
          <span className="text-2xl font-black text-white">{match.awayScore ?? '-'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm">{awayTeam?.name?.slice(0, 3).toUpperCase() || 'TBD'}</span>
          <span className="text-2xl">{awayTeam?.flag || '🏳️'}</span>
        </div>
        {(match.homeScore !== null || match.awayScore !== null) && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="LIVE" />
        )}
      </div>
    );
  }

  if (style === 'vertical') {
    return (
      <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-[#00FF85]/30 w-48">
        <div className="text-center mb-2">
          <span className="text-[10px] text-[#00FF85] uppercase tracking-wider font-bold">
            {match.id?.includes('R32') ? 'R32' :
             match.id?.includes('R16') ? 'R16' :
             match.id?.includes('QF') ? 'QF' :
             match.id?.includes('SF') ? 'SF' :
             match.id === 'Final' ? 'FINAL' : match.id}
          </span>
        </div>

        {/* Home */}
        <div className={`flex items-center justify-between p-2 rounded-lg mb-1 ${
          match.winner === match.home ? 'bg-[#00FF85]/20' : ''
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{homeTeam?.flag}</span>
            <span className="text-white text-sm font-medium">{homeTeam?.name?.slice(0, 10) || 'TBD'}</span>
          </div>
          <span className={`text-xl font-black ${match.winner === match.home ? 'text-[#00FF85]' : 'text-white'}`}>
            {match.homeScore ?? '-'}
          </span>
        </div>

        {/* Away */}
        <div className={`flex items-center justify-between p-2 rounded-lg ${
          match.winner === match.away ? 'bg-[#00FF85]/20' : ''
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{awayTeam?.flag}</span>
            <span className="text-white text-sm font-medium">{awayTeam?.name?.slice(0, 10) || 'TBD'}</span>
          </div>
          <span className={`text-xl font-black ${match.winner === match.away ? 'text-[#00FF85]' : 'text-white'}`}>
            {match.awayScore ?? '-'}
          </span>
        </div>

        {match.penaltyWinner && (
          <div className="text-center mt-2 text-[10px] text-yellow-400">
            PEN
          </div>
        )}
      </div>
    );
  }

  // Default: Horizontal bar style
  return (
    <div className="bg-gradient-to-r from-[#00204C] via-[#001533] to-[#00204C] rounded-lg overflow-hidden border border-[#00FF85]/30 shadow-lg">
      <div className="flex items-center">
        {/* Home Team */}
        <div className={`flex-1 flex items-center gap-3 p-3 ${
          match.winner === match.home ? 'bg-[#00FF85]/10' : ''
        }`}>
          <span className="text-3xl">{homeTeam?.flag || '🏳️'}</span>
          <div>
            <div className="text-white font-bold">{homeTeam?.name || 'TBD'}</div>
            <div className="text-[10px] text-gray-500 uppercase">{homeTeam?.id}</div>
          </div>
        </div>

        {/* Score */}
        <div className="px-6 py-3 bg-black/50 flex items-center gap-4">
          <span className={`text-4xl font-black ${match.winner === match.home ? 'text-[#00FF85]' : 'text-white'}`}>
            {match.homeScore ?? '-'}
          </span>
          <div className="flex flex-col items-center">
            <span className="text-gray-600 text-2xl">:</span>
            {(match.homeScore !== null || match.awayScore !== null) && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mt-1" />
            )}
          </div>
          <span className={`text-4xl font-black ${match.winner === match.away ? 'text-[#00FF85]' : 'text-white'}`}>
            {match.awayScore ?? '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className={`flex-1 flex items-center gap-3 p-3 justify-end ${
          match.winner === match.away ? 'bg-[#00FF85]/10' : ''
        }`}>
          <div className="text-right">
            <div className="text-white font-bold">{awayTeam?.name || 'TBD'}</div>
            <div className="text-[10px] text-gray-500 uppercase">{awayTeam?.id}</div>
          </div>
          <span className="text-3xl">{awayTeam?.flag || '🏳️'}</span>
        </div>
      </div>

      {/* Match info bar */}
      <div className="bg-black/30 px-4 py-1 flex justify-between text-[10px] text-gray-400">
        <span className="uppercase tracking-wider">{
          match.id?.includes('R32') ? 'Round of 32' :
          match.id?.includes('R16') ? 'Round of 16' :
          match.id?.includes('QF') ? 'Quarter Final' :
          match.id?.includes('SF') ? 'Semi Final' :
          match.id === 'Final' ? '⭐ FINAL ⭐' :
          match.id === '3rdPlace' ? '3rd Place' : match.id
        }</span>
        {match.penaltyWinner && <span className="text-yellow-400">PENALTIES</span>}
      </div>
    </div>
  );
};

export default CompactWidget;
