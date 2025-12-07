import React from 'react';

const MatchInput = ({ match, homeTeam, awayTeam, onScoreChange }) => {
    const isFinished = match.homeScore !== null && match.awayScore !== null;

    return (
        <div className={`
      flex items-center justify-between bg-[#000F24] p-3 rounded-lg border border-white/5 
      transition-all hover:border-white/20
      ${isFinished ? 'border-l-2 border-l-[#00FF85]' : ''}
    `}>
            {/* Home */}
            <div className="flex items-center gap-3 w-[40%]">
                <span className="text-xl">{homeTeam?.flag || '🏳️'}</span>
                <span className={`text-sm font-medium truncate ${match.homeScore > match.awayScore ? 'text-[#00FF85]' : 'text-gray-300'}`}>
                    {homeTeam?.name || match.home}
                </span>
            </div>

            {/* Score Inputs */}
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min="0"
                    className="w-8 h-8 text-center bg-black/40 border border-white/10 rounded text-sm text-white focus:border-[#00FF85] focus:outline-none transition-colors"
                    value={match.homeScore ?? ''}
                    onChange={(e) => onScoreChange(match.id, 'homeScore', e.target.value)}
                />
                <span className="text-gray-600 text-xs">-</span>
                <input
                    type="number"
                    min="0"
                    className="w-8 h-8 text-center bg-black/40 border border-white/10 rounded text-sm text-white focus:border-[#00FF85] focus:outline-none transition-colors"
                    value={match.awayScore ?? ''}
                    onChange={(e) => onScoreChange(match.id, 'awayScore', e.target.value)}
                />
            </div>

            {/* Away */}
            <div className="flex items-center gap-3 w-[40%] justify-end">
                <span className={`text-sm font-medium truncate text-right ${match.awayScore > match.homeScore ? 'text-[#00FF85]' : 'text-gray-300'}`}>
                    {awayTeam?.name || match.away}
                </span>
                <span className="text-xl">{awayTeam?.flag || '🏳️'}</span>
            </div>
        </div>
    );
};

export default MatchInput;
