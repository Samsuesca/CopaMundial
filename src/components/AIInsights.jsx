import React, { useMemo } from 'react';
import { Brain, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import { TEAMS } from '../data/teams';

const AIInsights = ({ standings, stats, groupMatches, knockoutMatches }) => {
  const insights = useMemo(() => {
    const result = [];

    // Favorites analysis
    const favorites = TEAMS.filter(t => t.rating <= 10).sort((a, b) => a.rating - b.rating);
    const activeFavorites = favorites.filter(f => {
      const inGroup = Object.values(standings).some(g => g.some(t => t.id === f.id));
      return inGroup;
    });

    if (activeFavorites.length > 0) {
      const topFavorite = activeFavorites[0];
      const groupData = Object.values(standings).find(g => g.some(t => t.id === topFavorite.id));
      const position = groupData ? groupData.findIndex(t => t.id === topFavorite.id) + 1 : 0;

      if (position > 2 && groupData?.[0]?.played > 0) {
        result.push({
          type: 'warning',
          icon: AlertTriangle,
          title: `${topFavorite.name} en peligro`,
          desc: `${topFavorite.flag} ${topFavorite.name} está en posición ${position} de su grupo`,
        });
      }
    }

    // High scoring groups
    const groupGoals = {};
    groupMatches.forEach(m => {
      if (m.finished) {
        groupGoals[m.group] = (groupGoals[m.group] || 0) + (m.homeScore || 0) + (m.awayScore || 0);
      }
    });
    const topGoalGroup = Object.entries(groupGoals).sort(([,a], [,b]) => b - a)[0];
    if (topGoalGroup && topGoalGroup[1] > 5) {
      result.push({
        type: 'stat',
        icon: TrendingUp,
        title: `Grupo ${topGoalGroup[0]} es el más goleador`,
        desc: `${topGoalGroup[1]} goles en la fase de grupos`,
      });
    }

    // Upset predictions based on ratings
    const potentialUpsets = [];
    knockoutMatches.forEach(m => {
      if (m.home && m.away && !m.winner) {
        const homeTeam = TEAMS.find(t => t.id === m.home);
        const awayTeam = TEAMS.find(t => t.id === m.away);
        if (homeTeam && awayTeam) {
          const diff = Math.abs(homeTeam.rating - awayTeam.rating);
          if (diff > 30) {
            const underdog = homeTeam.rating > awayTeam.rating ? homeTeam : awayTeam;
            potentialUpsets.push({ match: m.id, underdog });
          }
        }
      }
    });
    if (potentialUpsets.length > 0) {
      result.push({
        type: 'prediction',
        icon: Star,
        title: 'Posibles sorpresas',
        desc: `${potentialUpsets.map(u => `${u.underdog.flag} ${u.underdog.name}`).slice(0, 3).join(', ')} podrían dar la sorpresa`,
      });
    }

    // Champion prediction
    if (!stats.champion) {
      const teamsInKnockout = knockoutMatches
        .filter(m => m.home && m.away)
        .flatMap(m => [m.home, m.away])
        .filter((v, i, a) => a.indexOf(v) === i)
        .map(id => TEAMS.find(t => t.id === id))
        .filter(Boolean)
        .sort((a, b) => a.rating - b.rating);

      if (teamsInKnockout.length > 0) {
        const top3 = teamsInKnockout.slice(0, 3);
        result.push({
          type: 'prediction',
          icon: Brain,
          title: 'Favoritos al título',
          desc: top3.map(t => `${t.flag} ${t.name}`).join(', '),
        });
      }
    }

    // Average goals trend
    if (stats.totalGoals > 0) {
      const avg = parseFloat(stats.avgGoalsPerMatch);
      if (avg > 3) {
        result.push({
          type: 'stat',
          icon: TrendingUp,
          title: 'Torneo goleador',
          desc: `Promedio de ${avg} goles por partido. ¡Por encima de la media histórica!`,
        });
      } else if (avg < 2) {
        result.push({
          type: 'stat',
          icon: TrendingUp,
          title: 'Torneo defensivo',
          desc: `Solo ${avg} goles por partido en promedio`,
        });
      }
    }

    return result;
  }, [standings, stats, groupMatches, knockoutMatches]);

  if (insights.length === 0) return null;

  const colors = {
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    stat: 'border-blue-500/30 bg-blue-500/5',
    prediction: 'border-purple-500/30 bg-purple-500/5',
  };

  const iconColors = {
    warning: 'text-yellow-400',
    stat: 'text-blue-400',
    prediction: 'text-purple-400',
  };

  return (
    <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/5">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        Análisis e Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className={`rounded-lg p-3 border ${colors[insight.type]}`}>
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[insight.type]}`} />
                <div>
                  <div className="text-white font-medium text-sm">{insight.title}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{insight.desc}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;
