export const VENUES = [
  { id: 'met', name: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA', capacity: 82500 },
  { id: 'ros', name: 'Rose Bowl Stadium', city: 'Los Angeles', country: 'USA', capacity: 88432 },
  { id: 'att', name: 'AT&T Stadium', city: 'Dallas', country: 'USA', capacity: 80000 },
  { id: 'nrg', name: 'NRG Stadium', city: 'Houston', country: 'USA', capacity: 72220 },
  { id: 'har', name: 'Hard Rock Stadium', city: 'Miami', country: 'USA', capacity: 64767 },
  { id: 'lin', name: 'Lumen Field', city: 'Seattle', country: 'USA', capacity: 68740 },
  { id: 'sof', name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', capacity: 70240 },
  { id: 'phi', name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', capacity: 69176 },
  { id: 'bmo', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 45736 },
  { id: 'bc', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500 },
  { id: 'azt', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 83264 },
  { id: 'gua', name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: 53460 },
  { id: 'akr', name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: 49850 },
  { id: 'bay', name: 'Gillette Stadium', city: 'Boston', country: 'USA', capacity: 65878 },
  { id: 'geo', name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA', capacity: 75000 },
  { id: 'arh', name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA', capacity: 76416 },
];

export const GROUP_STAGE_DATES = [
  { day: 1, date: '2026-06-11', label: 'Jornada 1' },
  { day: 2, date: '2026-06-12', label: 'Jornada 1' },
  { day: 3, date: '2026-06-13', label: 'Jornada 1' },
  { day: 4, date: '2026-06-14', label: 'Jornada 1' },
  { day: 5, date: '2026-06-15', label: 'Jornada 2' },
  { day: 6, date: '2026-06-16', label: 'Jornada 2' },
  { day: 7, date: '2026-06-17', label: 'Jornada 2' },
  { day: 8, date: '2026-06-18', label: 'Jornada 2' },
  { day: 9, date: '2026-06-19', label: 'Jornada 3' },
  { day: 10, date: '2026-06-20', label: 'Jornada 3' },
  { day: 11, date: '2026-06-21', label: 'Jornada 3' },
  { day: 12, date: '2026-06-22', label: 'Jornada 3' },
];

export const KNOCKOUT_DATES = [
  { round: 'R32', dates: ['2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28'] },
  { round: 'R16', dates: ['2026-06-30', '2026-07-01', '2026-07-02', '2026-07-03'] },
  { round: 'QF', dates: ['2026-07-05', '2026-07-06'] },
  { round: 'SF', dates: ['2026-07-09', '2026-07-10'] },
  { round: '3rdPlace', dates: ['2026-07-13'] },
  { round: 'Final', dates: ['2026-07-14'] },
];

// Assign venues to groups for display purposes
export function getMatchVenue(matchId) {
  const venueMap = {
    'GA': 'azt', 'GB': 'bmo', 'GC': 'met', 'GD': 'att',
    'GE': 'nrg', 'GF': 'har', 'GG': 'lin', 'GH': 'sof',
    'GI': 'phi', 'GJ': 'ros', 'GK': 'bc', 'GL': 'geo',
  };
  const prefix = matchId.substring(0, 2);
  const venueId = venueMap[prefix] || 'met';
  return VENUES.find(v => v.id === venueId) || VENUES[0];
}

export function getMatchDate(matchId, matchIndex = 0) {
  if (matchId.startsWith('G')) {
    // Group match
    const matchNum = parseInt(matchId.split('-')[1]) || 1;
    const journeyIndex = Math.floor((matchNum - 1) / 2);
    const dateEntry = GROUP_STAGE_DATES[journeyIndex % GROUP_STAGE_DATES.length];
    return dateEntry?.date || '2026-06-11';
  }
  // Knockout
  const knockoutEntry = KNOCKOUT_DATES.find(k => matchId.startsWith(k.round) || matchId === k.round);
  if (knockoutEntry) {
    return knockoutEntry.dates[matchIndex % knockoutEntry.dates.length] || knockoutEntry.dates[0];
  }
  return '2026-07-14';
}
