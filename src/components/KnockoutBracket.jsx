import React from 'react';

const BracketMatch = ({ match, teams, onScoreChange }) => {
    const homeTeam = teams.find(t => t.id === match.home);
    const awayTeam = teams.find(t => t.id === match.away);

    // Determine if match is ready (both teams known)
    const isReady = match.home && match.away;

    return (
        <div className={`
      relative flex flex-col justify-center bg-[#001533] border rounded-lg overflow-hidden transition-all w-64
      ${isReady ? 'border-[#00FF85]/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : 'border-white/5 opacity-60'}
    `}>
            {/* Match ID / Info */}
            <div className="bg-black/20 px-3 py-1 text-[10px] text-gray-500 flex justify-between uppercase tracking-wider font-bold">
                <span>{match.id}</span>
                {!isReady && <span>Waiting...</span>}
            </div>

            {/* Home Team */}
            <div className={`flex items-center justify-between p-2 border-b border-white/5 ${match.winner === match.home && match.winner ? 'bg-[#00FF85]/10' : ''}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-xl">{homeTeam?.flag || '🏳️'}</span>
                    <span className={`text-sm font-medium truncate ${match.winner === match.home ? 'text-[#00FF85]' : 'text-gray-300'}`}>
                        {homeTeam?.name || (match.home ? match.home : 'TBD')}
                    </span>
                </div>
                <input
                    type="number"
                    min="0"
                    disabled={!isReady}
                    className="w-8 h-7 text-center bg-black/40 border border-white/10 rounded text-sm focus:border-[#00FF85] focus:outline-none transition-colors"
                    value={match.homeScore ?? ''}
                    onChange={(e) => onScoreChange(match.id, 'homeScore', e.target.value)}
                />
            </div>

            {/* Away Team */}
            <div className={`flex items-center justify-between p-2 ${match.winner === match.away && match.winner ? 'bg-[#00FF85]/10' : ''}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-xl">{awayTeam?.flag || '🏳️'}</span>
                    <span className={`text-sm font-medium truncate ${match.winner === match.away ? 'text-[#00FF85]' : 'text-gray-300'}`}>
                        {awayTeam?.name || (match.away ? match.away : 'TBD')}
                    </span>
                </div>
                <input
                    type="number"
                    min="0"
                    disabled={!isReady}
                    className="w-8 h-7 text-center bg-black/40 border border-white/10 rounded text-sm focus:border-[#00FF85] focus:outline-none transition-colors"
                    value={match.awayScore ?? ''}
                    onChange={(e) => onScoreChange(match.id, 'awayScore', e.target.value)}
                />
            </div>
        </div>
    );
};

const KnockoutBracket = ({ matches, teams, onMatchUpdate }) => {
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

    return (
        <div className="overflow-x-auto pb-12 pt-4">
            <div className="flex gap-12 min-w-max px-8">
                {rounds.map((round, roundIndex) => (
                    <div key={round.id} className="flex flex-col">
                        <h3 className="text-center font-black text-[#00FF85] uppercase tracking-widest mb-8 sticky top-0 bg-[#00204C]/90 py-4 backdrop-blur z-10">
                            {round.name}
                        </h3>
                        <div className="flex flex-col justify-around flex-grow gap-8">
                            {round.matches.map(match => (
                                <div key={match.id} className="flex items-center">
                                    <BracketMatch
                                        match={match}
                                        teams={teams}
                                        onScoreChange={onMatchUpdate}
                                    />
                                    {/* Connector Line Logic could go here */}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {thirdPlace && (
                <div className="mt-12 border-t border-white/10 pt-8 flex flex-col items-center">
                    <h3 className="text-[#00FF85] font-bold uppercase tracking-widest mb-4">3rd Place Play-off</h3>
                    <BracketMatch
                        match={thirdPlace}
                        teams={teams}
                        onScoreChange={onMatchUpdate}
                    />
                </div>
            )}
        </div>
    );
};

export default KnockoutBracket;
