import React, { useState } from 'react';
import { Target, Trophy, Medal } from 'lucide-react';

const PenaltySelector = ({ match, teams, onPenaltyWinner, onClose }) => {
  const homeTeam = teams.find(t => t.id === match.home);
  const awayTeam = teams.find(t => t.id === match.away);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-[#001533] rounded-xl p-6 border border-[#00FF85]/30 shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <Target className="w-12 h-12 text-[#00FF85] mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white">Penalty Shootout</h3>
          <p className="text-gray-400 text-sm mt-1">
            Match ended {match.homeScore} - {match.awayScore}. Select the winner:
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              onPenaltyWinner(match.id, match.home);
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 bg-[#000F24] rounded-lg border border-white/10 hover:border-[#00FF85]/50 hover:bg-[#00FF85]/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{homeTeam?.flag || '🏳️'}</span>
              <span className="text-white font-medium">{homeTeam?.name || match.home}</span>
            </div>
            <span className="text-gray-500 group-hover:text-[#00FF85] transition-colors">
              Wins on penalties
            </span>
          </button>

          <button
            onClick={() => {
              onPenaltyWinner(match.id, match.away);
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 bg-[#000F24] rounded-lg border border-white/10 hover:border-[#00FF85]/50 hover:bg-[#00FF85]/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{awayTeam?.flag || '🏳️'}</span>
              <span className="text-white font-medium">{awayTeam?.name || match.away}</span>
            </div>
            <span className="text-gray-500 group-hover:text-[#00FF85] transition-colors">
              Wins on penalties
            </span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-gray-500 hover:text-white transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const BracketMatch = ({ match, teams, onScoreChange, onPenaltyWinner }) => {
  const [showPenaltySelector, setShowPenaltySelector] = useState(false);
  const homeTeam = teams.find(t => t.id === match.home);
  const awayTeam = teams.find(t => t.id === match.away);

  // Determine if match is ready (both teams known)
  const isReady = match.home && match.away;

  // Check if it's a draw needing penalties
  const isDraw = match.homeScore !== null &&
                 match.awayScore !== null &&
                 match.homeScore === match.awayScore;
  const needsPenalties = isDraw && !match.penaltyWinner;

  // Special styling for final
  const isFinal = match.id === 'Final';
  const isThirdPlace = match.id === '3rdPlace';

  return (
    <>
      <div className={`
        relative flex flex-col justify-center bg-[#001533] border rounded-lg overflow-hidden transition-all w-56 md:w-64
        ${isReady ? 'border-[#00FF85]/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 'border-white/5 opacity-60'}
        ${isFinal ? 'ring-2 ring-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : ''}
        ${isThirdPlace ? 'ring-2 ring-amber-600/50' : ''}
        ${needsPenalties ? 'ring-2 ring-red-500/50 animate-pulse' : ''}
      `}>
        {/* Match ID / Info */}
        <div className={`px-3 py-1.5 text-[10px] flex justify-between uppercase tracking-wider font-bold ${
          isFinal ? 'bg-yellow-400/20 text-yellow-400' :
          isThirdPlace ? 'bg-amber-600/20 text-amber-500' :
          'bg-black/20 text-gray-500'
        }`}>
          <span className="flex items-center gap-1">
            {isFinal && <Trophy className="w-3 h-3" />}
            {isThirdPlace && <Medal className="w-3 h-3" />}
            {match.id}
          </span>
          {!isReady && <span>Waiting...</span>}
          {match.penaltyWinner && (
            <span className="text-[#00FF85] flex items-center gap-1">
              <Target className="w-3 h-3" /> PEN
            </span>
          )}
        </div>

        {/* Home Team */}
        <div className={`flex items-center justify-between p-2 border-b border-white/5 transition-colors ${
          match.winner === match.home && match.winner ? 'bg-[#00FF85]/10' : ''
        }`}>
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden flex-1">
            <span className="text-lg md:text-xl">{homeTeam?.flag || '🏳️'}</span>
            <span className={`text-xs md:text-sm font-medium truncate ${
              match.winner === match.home ? 'text-[#00FF85]' : 'text-gray-300'
            }`}>
              {homeTeam?.name || (match.home ? match.home : 'TBD')}
            </span>
          </div>
          <input
            type="number"
            min="0"
            disabled={!isReady}
            className="w-8 h-7 text-center bg-black/40 border border-white/10 rounded text-sm focus:border-[#00FF85] focus:outline-none transition-colors disabled:opacity-50"
            value={match.homeScore ?? ''}
            onChange={(e) => onScoreChange(match.id, 'homeScore', e.target.value)}
          />
        </div>

        {/* Away Team */}
        <div className={`flex items-center justify-between p-2 transition-colors ${
          match.winner === match.away && match.winner ? 'bg-[#00FF85]/10' : ''
        }`}>
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden flex-1">
            <span className="text-lg md:text-xl">{awayTeam?.flag || '🏳️'}</span>
            <span className={`text-xs md:text-sm font-medium truncate ${
              match.winner === match.away ? 'text-[#00FF85]' : 'text-gray-300'
            }`}>
              {awayTeam?.name || (match.away ? match.away : 'TBD')}
            </span>
          </div>
          <input
            type="number"
            min="0"
            disabled={!isReady}
            className="w-8 h-7 text-center bg-black/40 border border-white/10 rounded text-sm focus:border-[#00FF85] focus:outline-none transition-colors disabled:opacity-50"
            value={match.awayScore ?? ''}
            onChange={(e) => onScoreChange(match.id, 'awayScore', e.target.value)}
          />
        </div>

        {/* Penalty Button */}
        {needsPenalties && (
          <button
            onClick={() => setShowPenaltySelector(true)}
            className="w-full py-2 bg-red-500/20 text-red-400 text-xs font-bold uppercase hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1"
          >
            <Target className="w-3 h-3" />
            Select Penalty Winner
          </button>
        )}
      </div>

      {/* Penalty Selector Modal */}
      {showPenaltySelector && (
        <PenaltySelector
          match={match}
          teams={teams}
          onPenaltyWinner={onPenaltyWinner}
          onClose={() => setShowPenaltySelector(false)}
        />
      )}
    </>
  );
};

const KnockoutBracket = ({ matches, teams, onMatchUpdate, onPenaltyWinner }) => {
  if (!matches || matches.length === 0) return null;

  // Group matches by round
  const rounds = [
    { id: 'R32', name: 'Round of 32', matches: matches.filter(m => m.id.startsWith('R32')) },
    { id: 'R16', name: 'Round of 16', matches: matches.filter(m => m.id.startsWith('R16')) },
    { id: 'QF', name: 'Quarter Finals', matches: matches.filter(m => m.id.startsWith('QF')) },
    { id: 'SF', name: 'Semi Finals', matches: matches.filter(m => m.id.startsWith('SF')) },
    { id: 'F', name: 'Final', matches: matches.filter(m => m.id === 'Final') },
  ];

  const thirdPlace = matches.find(m => m.id === '3rdPlace');

  // Get champion
  const finalMatch = matches.find(m => m.id === 'Final');
  const champion = finalMatch?.winner ? teams.find(t => t.id === finalMatch.winner) : null;

  return (
    <div className="space-y-8">
      {/* Champion Display */}
      {champion && (
        <div className="bg-gradient-to-r from-yellow-600/20 via-yellow-400/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-400/30 text-center animate-in fade-in zoom-in-95 duration-500">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-2">WORLD CHAMPION</h2>
          <div className="flex items-center justify-center gap-4">
            <span className="text-6xl">{champion.flag}</span>
            <span className="text-4xl font-bold text-[#00FF85]">{champion.name}</span>
          </div>
        </div>
      )}

      {/* Bracket */}
      <div className="overflow-x-auto pb-12 pt-4">
        <div className="flex gap-6 md:gap-12 min-w-max px-4 md:px-8">
          {rounds.map((round, roundIndex) => (
            <div key={round.id} className="flex flex-col">
              <h3 className="text-center font-black text-[#00FF85] uppercase tracking-widest mb-6 md:mb-8 sticky top-0 bg-[#00204C]/90 py-3 md:py-4 backdrop-blur z-10 text-sm md:text-base">
                {round.name}
                <span className="block text-[10px] text-gray-500 font-normal mt-1">
                  {round.matches.length} matches
                </span>
              </h3>
              <div
                className="flex flex-col justify-around flex-grow gap-4 md:gap-8"
                style={{
                  // Increase spacing for later rounds
                  paddingTop: roundIndex > 0 ? `${roundIndex * 20}px` : '0',
                  paddingBottom: roundIndex > 0 ? `${roundIndex * 20}px` : '0',
                }}
              >
                {round.matches.map(match => (
                  <div key={match.id} className="flex items-center">
                    <BracketMatch
                      match={match}
                      teams={teams}
                      onScoreChange={onMatchUpdate}
                      onPenaltyWinner={onPenaltyWinner}
                                          />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Third Place Match */}
      {thirdPlace && (
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center">
            <h3 className="text-[#00FF85] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              3rd Place Play-off
            </h3>
            <BracketMatch
              match={thirdPlace}
              teams={teams}
              onScoreChange={onMatchUpdate}
              onPenaltyWinner={onPenaltyWinner}
                          />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-[#001533] rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-bold text-gray-400 mb-2">How it works:</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>- Enter scores for each match. Winners automatically advance to the next round.</li>
          <li>- If a match ends in a draw, you'll be prompted to select the penalty shootout winner.</li>
          <li>- Scroll horizontally to see all rounds of the bracket.</li>
        </ul>
      </div>
    </div>
  );
};

export default KnockoutBracket;
