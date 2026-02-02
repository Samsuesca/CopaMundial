/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';

const LiveScoreboard = ({ match, teams, onClose, isOverlay = false }) => {
  const [showGoalAnimation, setShowGoalAnimation] = useState(null);
  const prevScoresRef = useRef({ home: null, away: null });

  const homeTeam = teams?.find(t => t.id === match?.home);
  const awayTeam = teams?.find(t => t.id === match?.away);

  // Detect goal scored using ref to avoid re-render loops
  useEffect(() => {
    const prevScores = prevScoresRef.current;
    let timer;

    if (match?.homeScore !== null && match?.homeScore !== prevScores.home && prevScores.home !== null) {
      setShowGoalAnimation('home');
      timer = setTimeout(() => setShowGoalAnimation(null), 3000);
    } else if (match?.awayScore !== null && match?.awayScore !== prevScores.away && prevScores.away !== null) {
      setShowGoalAnimation('away');
      timer = setTimeout(() => setShowGoalAnimation(null), 3000);
    }

    // Update ref
    prevScoresRef.current = {
      home: match?.homeScore ?? null,
      away: match?.awayScore ?? null
    };

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [match?.homeScore, match?.awayScore]);

  if (!match) return null;

  const containerClass = isOverlay
    ? 'fixed inset-0 flex items-center justify-center bg-transparent'
    : 'bg-[#001533] rounded-2xl p-8 border border-[#00FF85]/30 shadow-2xl';

  return (
    <div className={containerClass}>
      <div className={`${isOverlay ? 'bg-[#00204C]/95 backdrop-blur-sm rounded-2xl p-8 border border-[#00FF85]/50 shadow-[0_0_50px_rgba(0,255,133,0.3)]' : ''}`}>
        {/* Match Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#00FF85]/20 text-[#00FF85] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            EN VIVO
          </div>
          <div className="text-gray-400 text-sm mt-2 uppercase tracking-widest">
            {match.id?.includes('R32') ? 'Round of 32' :
             match.id?.includes('R16') ? 'Round of 16' :
             match.id?.includes('QF') ? 'Quarter Final' :
             match.id?.includes('SF') ? 'Semi Final' :
             match.id === 'Final' ? 'FINAL' :
             match.id === '3rdPlace' ? '3rd Place' :
             'Group Stage'}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="flex items-center justify-center gap-6 md:gap-12">
          {/* Home Team */}
          <div className={`flex flex-col items-center transition-all duration-500 ${
            showGoalAnimation === 'home' ? 'scale-110' : ''
          }`}>
            <span className="text-6xl md:text-8xl mb-3">{homeTeam?.flag || '🏳️'}</span>
            <span className="text-white font-bold text-lg md:text-2xl text-center max-w-[150px]">
              {homeTeam?.name || match.home || 'TBD'}
            </span>
            {showGoalAnimation === 'home' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#00FF85] font-black text-4xl animate-bounce">
                GOL!
              </div>
            )}
          </div>

          {/* Score */}
          <div className="flex items-center gap-4">
            <div className={`text-6xl md:text-9xl font-black transition-all duration-300 ${
              showGoalAnimation === 'home'
                ? 'text-[#00FF85] scale-125 animate-pulse'
                : 'text-white'
            }`}>
              {match.homeScore ?? '-'}
            </div>
            <div className="text-4xl md:text-6xl text-gray-600 font-bold">:</div>
            <div className={`text-6xl md:text-9xl font-black transition-all duration-300 ${
              showGoalAnimation === 'away'
                ? 'text-[#00FF85] scale-125 animate-pulse'
                : 'text-white'
            }`}>
              {match.awayScore ?? '-'}
            </div>
          </div>

          {/* Away Team */}
          <div className={`flex flex-col items-center transition-all duration-500 ${
            showGoalAnimation === 'away' ? 'scale-110' : ''
          }`}>
            <span className="text-6xl md:text-8xl mb-3">{awayTeam?.flag || '🏳️'}</span>
            <span className="text-white font-bold text-lg md:text-2xl text-center max-w-[150px]">
              {awayTeam?.name || match.away || 'TBD'}
            </span>
            {showGoalAnimation === 'away' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#00FF85] font-black text-4xl animate-bounce">
                GOL!
              </div>
            )}
          </div>
        </div>

        {/* Penalties indicator */}
        {match.penaltyWinner && (
          <div className="text-center mt-6">
            <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold">
              Ganador por penales: {teams?.find(t => t.id === match.penaltyWinner)?.name}
            </span>
          </div>
        )}

        {/* Winner celebration */}
        {match.winner && (
          <div className="text-center mt-8 animate-in fade-in zoom-in-95 duration-500">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-[#00FF85]">
              {teams?.find(t => t.id === match.winner)?.name} GANA!
            </div>
          </div>
        )}

        {/* Close button for overlay */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveScoreboard;
