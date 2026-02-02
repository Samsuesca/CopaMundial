import React, { useState, useEffect } from 'react';
import { Users, Trophy, Timer, BarChart2 } from 'lucide-react';

const ChatPredictions = ({ match, teams, onVote }) => {
  const [votes, setVotes] = useState({ home: 0, away: 0, draw: 0 });
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isOpen, setIsOpen] = useState(true);

  const homeTeam = teams?.find(t => t.id === match?.home);
  const awayTeam = teams?.find(t => t.id === match?.away);

  const totalVotes = votes.home + votes.away + votes.draw;
  const getPercentage = (count) => totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const handleVote = (choice) => {
    if (userVote || !isOpen) return;
    setUserVote(choice);
    setVotes(prev => ({ ...prev, [choice]: prev[choice] + 1 }));
    onVote?.(choice);
  };

  if (!match || !homeTeam || !awayTeam) return null;

  return (
    <div className="bg-gradient-to-b from-purple-900/50 to-[#001533] rounded-xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-white" />
          <span className="text-white font-bold uppercase tracking-wider text-sm">
            Predicciones del Chat
          </span>
        </div>
        {isOpen && (
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
            <Timer className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-mono font-bold">{timeLeft}s</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Match Display */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <span className="text-4xl">{homeTeam.flag}</span>
            <div className="text-white font-bold text-sm mt-1">{homeTeam.name}</div>
          </div>
          <div className="text-2xl text-gray-500 font-bold">VS</div>
          <div className="text-center">
            <span className="text-4xl">{awayTeam.flag}</span>
            <div className="text-white font-bold text-sm mt-1">{awayTeam.name}</div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center text-white font-bold mb-4">
          Quien ganara este partido?
        </div>

        {/* Voting Buttons */}
        <div className="space-y-3">
          {/* Home wins */}
          <button
            onClick={() => handleVote('home')}
            disabled={!!userVote || !isOpen}
            className={`w-full relative overflow-hidden rounded-lg transition-all ${
              userVote === 'home'
                ? 'ring-2 ring-[#00FF85]'
                : 'hover:bg-white/10'
            } ${!isOpen || userVote ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div
              className="absolute inset-0 bg-[#00FF85]/30 transition-all duration-500"
              style={{ width: `${getPercentage(votes.home)}%` }}
            />
            <div className="relative flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{homeTeam.flag}</span>
                <span className="text-white font-medium">{homeTeam.name} gana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00FF85] font-bold">{getPercentage(votes.home)}%</span>
                <span className="text-gray-500 text-sm">({votes.home})</span>
              </div>
            </div>
          </button>

          {/* Draw */}
          <button
            onClick={() => handleVote('draw')}
            disabled={!!userVote || !isOpen}
            className={`w-full relative overflow-hidden rounded-lg transition-all ${
              userVote === 'draw'
                ? 'ring-2 ring-yellow-400'
                : 'hover:bg-white/10'
            } ${!isOpen || userVote ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div
              className="absolute inset-0 bg-yellow-500/30 transition-all duration-500"
              style={{ width: `${getPercentage(votes.draw)}%` }}
            />
            <div className="relative flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <span className="text-white font-medium">Empate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">{getPercentage(votes.draw)}%</span>
                <span className="text-gray-500 text-sm">({votes.draw})</span>
              </div>
            </div>
          </button>

          {/* Away wins */}
          <button
            onClick={() => handleVote('away')}
            disabled={!!userVote || !isOpen}
            className={`w-full relative overflow-hidden rounded-lg transition-all ${
              userVote === 'away'
                ? 'ring-2 ring-blue-400'
                : 'hover:bg-white/10'
            } ${!isOpen || userVote ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div
              className="absolute inset-0 bg-blue-500/30 transition-all duration-500"
              style={{ width: `${getPercentage(votes.away)}%` }}
            />
            <div className="relative flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{awayTeam.flag}</span>
                <span className="text-white font-medium">{awayTeam.name} gana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">{getPercentage(votes.away)}%</span>
                <span className="text-gray-500 text-sm">({votes.away})</span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{totalVotes} votos</span>
          </div>
          {!isOpen && (
            <div className="flex items-center gap-1 text-red-400">
              <span>Votacion cerrada</span>
            </div>
          )}
        </div>

        {/* User vote feedback */}
        {userVote && (
          <div className="mt-4 text-center text-sm text-[#00FF85] bg-[#00FF85]/10 rounded-lg py-2 animate-in fade-in">
            Votaste por: {
              userVote === 'home' ? homeTeam.name :
              userVote === 'away' ? awayTeam.name : 'Empate'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPredictions;
