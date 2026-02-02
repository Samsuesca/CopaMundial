import React, { useState } from 'react';

const MatchInput = ({ match, homeTeam, awayTeam, onScoreChange }) => {
  const [homeError, setHomeError] = useState(false);
  const [awayError, setAwayError] = useState(false);

  const isFinished = match.homeScore !== null && match.awayScore !== null;
  const homeWins = match.homeScore > match.awayScore;
  const awayWins = match.awayScore > match.homeScore;
  const isDraw = isFinished && match.homeScore === match.awayScore;

  const handleScoreChange = (field, value) => {
    const isHome = field === 'homeScore';

    // Validate input - only allow positive numbers
    if (value !== '' && (isNaN(value) || parseInt(value) < 0)) {
      if (isHome) setHomeError(true);
      else setAwayError(true);
      setTimeout(() => {
        if (isHome) setHomeError(false);
        else setAwayError(false);
      }, 500);
      return;
    }

    onScoreChange(match.id, field, value);
  };

  return (
    <div className={`
      flex items-center justify-between bg-[#000F24] p-3 rounded-lg border transition-all duration-300
      ${isFinished
        ? 'border-l-2 border-l-[#00FF85] border-white/10'
        : 'border-white/5 hover:border-white/20'
      }
      ${isDraw ? 'bg-yellow-500/5' : ''}
    `}>
      {/* Home Team */}
      <div className="flex items-center gap-2 md:gap-3 w-[38%] min-w-0">
        <span className="text-lg md:text-xl flex-shrink-0">{homeTeam?.flag || '🏳️'}</span>
        <div className="min-w-0 flex-1">
          <span className={`text-xs md:text-sm font-medium truncate block ${
            homeWins ? 'text-[#00FF85]' : 'text-gray-300'
          }`}>
            {homeTeam?.name || match.home}
          </span>
          {homeTeam?.rating && (
            <span className="text-[10px] text-gray-500 hidden md:block">
              Rank #{homeTeam.rating}
            </span>
          )}
        </div>
      </div>

      {/* Score Inputs */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        <input
          type="number"
          min="0"
          max="99"
          className={`w-8 md:w-10 h-8 md:h-9 text-center bg-black/40 border rounded text-sm text-white focus:outline-none transition-all ${
            homeError
              ? 'border-red-500 shake'
              : homeWins
                ? 'border-[#00FF85] bg-[#00FF85]/10'
                : 'border-white/10 focus:border-[#00FF85]'
          }`}
          value={match.homeScore ?? ''}
          onChange={(e) => handleScoreChange('homeScore', e.target.value)}
          placeholder="-"
        />
        <span className="text-gray-600 text-xs font-bold">:</span>
        <input
          type="number"
          min="0"
          max="99"
          className={`w-8 md:w-10 h-8 md:h-9 text-center bg-black/40 border rounded text-sm text-white focus:outline-none transition-all ${
            awayError
              ? 'border-red-500 shake'
              : awayWins
                ? 'border-[#00FF85] bg-[#00FF85]/10'
                : 'border-white/10 focus:border-[#00FF85]'
          }`}
          value={match.awayScore ?? ''}
          onChange={(e) => handleScoreChange('awayScore', e.target.value)}
          placeholder="-"
        />
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-2 md:gap-3 w-[38%] min-w-0 justify-end">
        <div className="min-w-0 flex-1 text-right">
          <span className={`text-xs md:text-sm font-medium truncate block ${
            awayWins ? 'text-[#00FF85]' : 'text-gray-300'
          }`}>
            {awayTeam?.name || match.away}
          </span>
          {awayTeam?.rating && (
            <span className="text-[10px] text-gray-500 hidden md:block">
              Rank #{awayTeam.rating}
            </span>
          )}
        </div>
        <span className="text-lg md:text-xl flex-shrink-0">{awayTeam?.flag || '🏳️'}</span>
      </div>
    </div>
  );
};

export default MatchInput;
