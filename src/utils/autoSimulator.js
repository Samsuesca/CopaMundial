import { TEAMS } from '../data/teams';

// Generate a random score based on team ratings
function generateScore(homeRating, awayRating, randomFactor = 0.5) {
  // Lower rating = better team
  const homeStrength = Math.max(1, 100 - homeRating) / 100;
  const awayStrength = Math.max(1, 100 - awayRating) / 100;

  const homeExpected = 1.5 + homeStrength * 2;
  const awayExpected = 1.5 + awayStrength * 2;

  // Add randomness
  const randomize = (expected) => {
    const random = Math.random() * randomFactor * 4 - randomFactor * 2;
    return Math.max(0, Math.round(expected + random));
  };

  return {
    homeScore: randomize(homeExpected),
    awayScore: randomize(awayExpected),
  };
}

// Simulate all group matches
export function simulateGroupMatches(groupMatches, randomFactor = 0.5) {
  return groupMatches.map(match => {
    if (match.home?.startsWith('PLAYOFF_') || match.away?.startsWith('PLAYOFF_')) {
      return match;
    }
    const homeTeam = TEAMS.find(t => t.id === match.home);
    const awayTeam = TEAMS.find(t => t.id === match.away);
    if (!homeTeam || !awayTeam) return match;

    const { homeScore, awayScore } = generateScore(
      homeTeam.rating,
      awayTeam.rating,
      randomFactor
    );

    return {
      ...match,
      homeScore,
      awayScore,
      finished: true,
    };
  });
}

// Simulate a single knockout match
export function simulateKnockoutMatch(match, randomFactor = 0.5) {
  if (!match.home || !match.away) return match;

  const homeTeam = TEAMS.find(t => t.id === match.home);
  const awayTeam = TEAMS.find(t => t.id === match.away);
  if (!homeTeam || !awayTeam) return match;

  let { homeScore, awayScore } = generateScore(
    homeTeam.rating,
    awayTeam.rating,
    randomFactor
  );

  let winner = null;
  let penaltyWinner = null;

  if (homeScore > awayScore) {
    winner = match.home;
  } else if (awayScore > homeScore) {
    winner = match.away;
  } else {
    // Penalty shootout - better team slightly more likely to win
    const homeChance = (100 - homeTeam.rating) / (200 - homeTeam.rating - awayTeam.rating);
    penaltyWinner = Math.random() < homeChance ? match.home : match.away;
    winner = penaltyWinner;
  }

  return {
    ...match,
    homeScore,
    awayScore,
    winner,
    penaltyWinner,
  };
}

// Random draw - shuffle teams into groups
export function generateRandomDraw(teamsPool, numGroups = 12, teamsPerGroup = 4) {
  const shuffled = [...teamsPool].sort(() => Math.random() - 0.5);
  const groups = [];
  for (let i = 0; i < numGroups; i++) {
    groups.push({
      id: String.fromCharCode(65 + i),
      teams: shuffled.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup).map(t => t.id),
    });
  }
  return groups;
}

// Seeding simulator - distribute teams into pots by rating
export function generateSeededDraw(allTeams, numGroups = 12) {
  const sorted = [...allTeams].sort((a, b) => a.rating - b.rating);
  const pots = [];
  const potSize = Math.ceil(sorted.length / 4);
  for (let i = 0; i < 4; i++) {
    pots.push(sorted.slice(i * potSize, (i + 1) * potSize));
  }

  // Shuffle within each pot
  pots.forEach(pot => pot.sort(() => Math.random() - 0.5));

  const groups = [];
  for (let i = 0; i < numGroups; i++) {
    groups.push({
      id: String.fromCharCode(65 + i),
      teams: pots.map(pot => pot[i % pot.length]?.id).filter(Boolean),
    });
  }
  return groups;
}
