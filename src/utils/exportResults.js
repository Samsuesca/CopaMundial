import { TEAMS } from '../data/teams';

const getTeamName = (id) => TEAMS.find(t => t.id === id)?.name || id;
const getTeamFlag = (id) => TEAMS.find(t => t.id === id)?.flag || '';

// Export as CSV
export function exportAsCSV(state, standings) {
  const lines = ['Stage,Match ID,Home Team,Home Score,Away Score,Away Team,Winner'];

  // Group matches
  state.groupMatches.forEach(m => {
    if (m.finished) {
      const winner = m.homeScore > m.awayScore ? getTeamName(m.home)
        : m.awayScore > m.homeScore ? getTeamName(m.away) : 'Draw';
      lines.push(`Group ${m.group},${m.id},${getTeamName(m.home)},${m.homeScore},${m.awayScore},${getTeamName(m.away)},${winner}`);
    }
  });

  // Knockout matches
  state.knockoutMatches.forEach(m => {
    if (m.homeScore !== null && m.awayScore !== null) {
      const winnerName = m.winner ? getTeamName(m.winner) : '';
      const penalty = m.penaltyWinner ? ' (PEN)' : '';
      lines.push(`Knockout,${m.id},${getTeamName(m.home)},${m.homeScore},${m.awayScore},${getTeamName(m.away)},${winnerName}${penalty}`);
    }
  });

  // Standings
  lines.push('');
  lines.push('Group,Position,Team,Played,Won,Drawn,Lost,GF,GA,GD,Points');
  Object.entries(standings).forEach(([groupId, teams]) => {
    teams.forEach((t, i) => {
      lines.push(`${groupId},${i + 1},${getTeamName(t.id)},${t.played},${t.won},${t.drawn},${t.lost},${t.gf},${t.ga},${t.gd},${t.points}`);
    });
  });

  return lines.join('\n');
}

// Export as formatted text for image generation
export function exportAsText(state, standings, stats) {
  const lines = [];
  lines.push('═══════════════════════════════════════════');
  lines.push('       WORLD CUP 2026 SIMULATOR');
  lines.push('═══════════════════════════════════════════');
  lines.push('');

  if (stats.champion) {
    lines.push(`🏆 Champion: ${getTeamFlag(stats.champion)} ${getTeamName(stats.champion)}`);
    if (stats.runnerUp) lines.push(`🥈 Runner-up: ${getTeamFlag(stats.runnerUp)} ${getTeamName(stats.runnerUp)}`);
    if (stats.thirdPlace) lines.push(`🥉 3rd Place: ${getTeamFlag(stats.thirdPlace)} ${getTeamName(stats.thirdPlace)}`);
    if (stats.fourthPlace) lines.push(`  4th Place: ${getTeamFlag(stats.fourthPlace)} ${getTeamName(stats.fourthPlace)}`);
    lines.push('');
  }

  lines.push(`Total Goals: ${stats.totalGoals}`);
  lines.push(`Avg Goals/Match: ${stats.avgGoalsPerMatch}`);
  lines.push(`Group Progress: ${stats.groupProgress}%`);
  lines.push(`Knockout Progress: ${stats.knockoutProgress}%`);
  lines.push('');

  // Group standings
  Object.entries(standings).forEach(([groupId, teams]) => {
    lines.push(`── Group ${groupId} ──`);
    teams.forEach((t, i) => {
      const name = getTeamName(t.id).padEnd(20);
      lines.push(`  ${i + 1}. ${getTeamFlag(t.id)} ${name} ${t.points}pts  ${t.gd > 0 ? '+' : ''}${t.gd}gd`);
    });
    lines.push('');
  });

  return lines.join('\n');
}

// Download helper
export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
