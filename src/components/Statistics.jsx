import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Trophy, Target, TrendingUp, Award, Zap, BarChart3 } from 'lucide-react';

function StatCard(props) {
  const { icon: IconComp, label, value, subValue, color = 'text-[#00FF85]' } = props;
  return (
    <div className="bg-[#001533] rounded-xl p-5 border border-white/5 hover:border-[#00FF85]/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-[#00FF85]/10 ${color}`}>
          <IconComp className="w-5 h-5" />
        </div>
        <span className="text-gray-400 text-sm uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
      {subValue && <div className="text-sm text-gray-500 mt-1">{subValue}</div>}
    </div>
  );
}

const ProgressBar = ({ label, value, max, percentage }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-[#00FF85] font-bold">{value}/{max}</span>
    </div>
    <div className="h-2 bg-[#000F24] rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#00FF85] to-[#00CC6A] rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const TeamRankBadge = ({ position, teamId, goals, teams }) => {
  const team = teams.find(t => t.id === teamId);
  const colors = [
    'bg-gradient-to-r from-yellow-400 to-yellow-600',
    'bg-gradient-to-r from-gray-300 to-gray-500',
    'bg-gradient-to-r from-amber-600 to-amber-800',
    'bg-gradient-to-r from-blue-400 to-blue-600',
    'bg-gradient-to-r from-purple-400 to-purple-600',
  ];

  return (
    <div className="flex items-center justify-between bg-[#000F24] rounded-lg p-3 hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${colors[position - 1] || 'bg-gray-600'}`}>
          {position}
        </div>
        <span className="text-xl">{team?.flag || '🏳️'}</span>
        <span className="text-white font-medium">{team?.name || teamId}</span>
      </div>
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-[#00FF85]" />
        <span className="text-[#00FF85] font-bold">{goals}</span>
      </div>
    </div>
  );
};

const PodiumCard = ({ position, teamId, label, teams }) => {
  const team = teams.find(t => t.id === teamId);
  const positionStyles = {
    1: { height: 'h-32', bg: 'bg-gradient-to-t from-yellow-600 to-yellow-400', icon: '🥇' },
    2: { height: 'h-24', bg: 'bg-gradient-to-t from-gray-500 to-gray-300', icon: '🥈' },
    3: { height: 'h-20', bg: 'bg-gradient-to-t from-amber-700 to-amber-500', icon: '🥉' },
    4: { height: 'h-16', bg: 'bg-gradient-to-t from-blue-700 to-blue-500', icon: '4th' },
  };

  const style = positionStyles[position] || positionStyles[4];

  if (!teamId) {
    return (
      <div className="flex flex-col items-center">
        <div className={`w-24 ${style.height} ${style.bg} rounded-t-lg flex flex-col items-center justify-end pb-2 opacity-30`}>
          <span className="text-2xl">?</span>
          <span className="text-xs text-white/70 mt-1">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-4xl mb-2">{team?.flag}</div>
      <div className="text-center mb-2">
        <div className="text-white font-bold text-sm">{team?.name}</div>
      </div>
      <div className={`w-24 ${style.height} ${style.bg} rounded-t-lg flex flex-col items-center justify-center`}>
        <span className="text-3xl">{style.icon}</span>
        <span className="text-xs text-white/80 mt-1">{label}</span>
      </div>
    </div>
  );
};

const Statistics = () => {
  const { stats, teams, state } = useSimulation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          <span className="text-[#00FF85]">Tournament</span> Statistics
        </h2>
        <p className="text-gray-400 mt-2">Real-time progress and insights</p>
      </div>

      {/* Podium - Only show if there's a champion */}
      {(stats.champion || stats.runnerUp || stats.thirdPlace) && (
        <div className="bg-[#001533] rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-[#00FF85] uppercase tracking-wider mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Final Standings
          </h3>
          <div className="flex justify-center items-end gap-4">
            <PodiumCard position={2} teamId={stats.runnerUp} label="Runner-up" teams={teams} />
            <PodiumCard position={1} teamId={stats.champion} label="Champion" teams={teams} />
            <PodiumCard position={3} teamId={stats.thirdPlace} label="3rd Place" teams={teams} />
            <PodiumCard position={4} teamId={stats.fourthPlace} label="4th Place" teams={teams} />
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart3}
          label="Group Stage"
          value={`${stats.groupProgress}%`}
          subValue={`${stats.completedGroupMatches}/${stats.totalGroupMatches} matches`}
        />
        <StatCard
          icon={Trophy}
          label="Knockout Stage"
          value={`${stats.knockoutProgress}%`}
          subValue={`${stats.completedKnockoutMatches}/${stats.totalKnockoutMatches} matches`}
        />
        <StatCard
          icon={Target}
          label="Total Goals"
          value={stats.totalGoals}
          subValue="In all matches"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Goals/Match"
          value={stats.avgGoalsPerMatch}
          subValue="Goals per game"
        />
      </div>

      {/* Progress Bars */}
      <div className="bg-[#001533] rounded-xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#00FF85]" />
          Tournament Progress
        </h3>
        <ProgressBar
          label="Group Stage"
          value={stats.completedGroupMatches}
          max={stats.totalGroupMatches}
          percentage={stats.groupProgress}
        />
        <ProgressBar
          label="Knockout Stage"
          value={stats.completedKnockoutMatches}
          max={stats.totalKnockoutMatches}
          percentage={stats.knockoutProgress}
        />
        <ProgressBar
          label="Overall"
          value={stats.completedGroupMatches + stats.completedKnockoutMatches}
          max={stats.totalGroupMatches + stats.totalKnockoutMatches}
          percentage={
            (stats.totalGroupMatches + stats.totalKnockoutMatches) > 0
              ? Math.round(((stats.completedGroupMatches + stats.completedKnockoutMatches) / (stats.totalGroupMatches + stats.totalKnockoutMatches)) * 100)
              : 0
          }
        />
      </div>

      {/* Top Scoring Teams */}
      <div className="bg-[#001533] rounded-xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#00FF85]" />
          Top Scoring Teams
        </h3>
        {stats.topScoringTeams.length > 0 ? (
          <div className="space-y-3">
            {stats.topScoringTeams.map((team, index) => (
              <TeamRankBadge
                key={team.teamId}
                position={index + 1}
                teamId={team.teamId}
                goals={team.goals}
                teams={teams}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No goals scored yet</p>
            <p className="text-sm">Start entering match results to see statistics</p>
          </div>
        )}
      </div>

      {/* Upsets */}
      {stats.upsets.length > 0 && (
        <div className="bg-[#001533] rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Major Upsets
          </h3>
          <div className="space-y-3">
            {stats.upsets.slice(0, 5).map((upset, index) => {
              const upsetTeam = teams.find(t => t.id === upset.upset.id);
              const favoriteTeam = teams.find(t => t.id === upset.favorite.id);
              return (
                <div key={index} className="flex items-center justify-between bg-[#000F24] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{upsetTeam?.flag}</span>
                    <span className="text-white font-medium">{upsetTeam?.name}</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                      Rank #{upset.upset.rating}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm">beat</div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{favoriteTeam?.name}</span>
                    <span className="text-xl">{favoriteTeam?.flag}</span>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      Rank #{upset.favorite.rating}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Saved Simulations */}
      {state.savedSimulations.length > 0 && (
        <div className="bg-[#001533] rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4">Saved Simulations</h3>
          <div className="space-y-2">
            {state.savedSimulations.map(sim => (
              <div key={sim.id} className="flex items-center justify-between bg-[#000F24] rounded-lg p-3">
                <div>
                  <div className="text-white font-medium">{sim.name}</div>
                  <div className="text-xs text-gray-500">
                    Saved: {new Date(sim.savedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
