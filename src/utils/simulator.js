export const calculateStandings = (groupMatches, groupTeams) => {
    const standings = groupTeams.map(teamId => ({
        id: teamId,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
    }));

    groupMatches.forEach(match => {
        if (match.finished) {
            const homeStats = standings.find(t => t.id === match.home);
            const awayStats = standings.find(t => t.id === match.away);

            if (homeStats && awayStats) {
                homeStats.played += 1;
                awayStats.played += 1;
                homeStats.gf += match.homeScore;
                homeStats.ga += match.awayScore;
                awayStats.gf += match.awayScore;
                awayStats.ga += match.homeScore;

                if (match.homeScore > match.awayScore) {
                    homeStats.won += 1;
                    homeStats.points += 3;
                    awayStats.lost += 1;
                } else if (match.homeScore < match.awayScore) {
                    awayStats.won += 1;
                    awayStats.points += 3;
                    homeStats.lost += 1;
                } else {
                    homeStats.drawn += 1;
                    homeStats.points += 1;
                    awayStats.drawn += 1;
                    awayStats.points += 1;
                }
            }
        }
    });

    standings.forEach(team => {
        team.gd = team.gf - team.ga;
    });

    // Sort by Points, then GD, then GF
    return standings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
    });
};

export const generateGroupMatches = (groups) => {
    const matches = [];
    groups.forEach(group => {
        const teams = group.teams;
        // Simple Round Robin pairings
        const pairings = [
            [0, 1], [2, 3],
            [0, 2], [1, 3],
            [0, 3], [1, 2]
        ];

        pairings.forEach((pair, index) => {
            matches.push({
                id: `G${group.id}-${index + 1}`,
                group: group.id,
                home: teams[pair[0]],
                away: teams[pair[1]],
                homeScore: null,
                awayScore: null,
                finished: false
            });
        });
    });
    return matches;
};

// Helper to check if a group is in a pool string (e.g., "A" in "ABCDF")
const isGroupInPool = (groupId, pool) => pool.includes(groupId);

// Backtracking solver to assign 3rd place teams to slots
const assignThirdPlaceTeams = (thirdPlaceTeams, slots) => {
    // slots: [{ id: 'matchId', pool: 'ABCDF' }, ...]
    // thirdPlaceTeams: [{ id: 'TeamID', groupId: 'A' }, ...]

    const assignments = {}; // matchId -> teamId
    const usedTeams = new Set();

    const solve = (slotIndex) => {
        if (slotIndex === slots.length) return true;

        const slot = slots[slotIndex];

        // Try to find a team for this slot
        for (const team of thirdPlaceTeams) {
            if (!usedTeams.has(team.id) && isGroupInPool(team.groupId, slot.pool)) {
                // Assign
                assignments[slot.id] = team.id;
                usedTeams.add(team.id);

                if (solve(slotIndex + 1)) return true;

                // Backtrack
                delete assignments[slot.id];
                usedTeams.delete(team.id);
            }
        }
        return false;
    };

    if (solve(0)) return assignments;

    // Fallback: Just assign available teams to available slots ignoring pools if strict solve fails
    // This prevents the app from crashing if the user creates a scenario that doesn't fit the pools perfectly
    const fallbackAssignments = {};
    const availableTeams = [...thirdPlaceTeams];
    slots.forEach(slot => {
        if (availableTeams.length > 0) {
            fallbackAssignments[slot.id] = availableTeams.shift().id;
        }
    });
    return fallbackAssignments;
};

export const generateKnockoutBracket = (groups, standings, existingMatches = []) => {
    // 1. Identify qualifiers
    const qualifiers = {}; // { '1A': teamId, '2A': teamId, ... }
    const thirdPlaceTeams = [];

    Object.keys(standings).forEach(groupId => {
        const groupStandings = standings[groupId];
        if (groupStandings.length >= 2) {
            qualifiers[`1${groupId}`] = groupStandings[0].id;
            qualifiers[`2${groupId}`] = groupStandings[1].id;
            if (groupStandings[2]) {
                thirdPlaceTeams.push({ ...groupStandings[2], groupId });
            }
        }
    });

    // 2. Rank 3rd place teams
    thirdPlaceTeams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
    });

    const best8Thirds = thirdPlaceTeams.slice(0, 8);

    // 3. Define R32 Matchups (Based on User Image)
    const r32Structure = [
        // Left Bracket
        { id: 'R32-1', home: '1E', awayPool: 'ABCDF' },
        { id: 'R32-2', home: '1I', awayPool: 'CDFGH' },
        { id: 'R32-3', home: '2A', away: '2B' },
        { id: 'R32-4', home: '1F', away: '2C' },
        { id: 'R32-5', home: '2K', away: '2L' },
        { id: 'R32-6', home: '1H', away: '2J' },
        { id: 'R32-7', home: '1D', awayPool: 'BEFIJ' },
        { id: 'R32-8', home: '1G', awayPool: 'AEHIJ' },
        // Right Bracket
        { id: 'R32-9', home: '1C', away: '2F' },
        { id: 'R32-10', home: '2E', away: '2I' },
        { id: 'R32-11', home: '1A', awayPool: 'CEFHI' },
        { id: 'R32-12', home: '1L', awayPool: 'EHIJK' },
        { id: 'R32-13', home: '1J', away: '2H' },
        { id: 'R32-14', home: '2D', away: '2G' },
        { id: 'R32-15', home: '1B', awayPool: 'EFGIJ' },
        { id: 'R32-16', home: '1K', awayPool: 'EHIJK' },
    ];

    // 4. Assign 3rd Place Teams
    const thirdPlaceSlots = r32Structure.filter(m => m.awayPool).map(m => ({ id: m.id, pool: m.awayPool }));
    const thirdPlaceAssignments = assignThirdPlaceTeams(best8Thirds, thirdPlaceSlots);

    // 5. Generate Matches for all rounds
    const rounds = [
        { id: 'R32', name: 'Round of 32', count: 16 },
        { id: 'R16', name: 'Round of 16', count: 8 },
        { id: 'QF', name: 'Quarter Finals', count: 4 },
        { id: 'SF', name: 'Semi Finals', count: 2 },
        { id: 'F', name: 'Final', count: 1 },
        { id: '3P', name: '3rd Place', count: 1 },
    ];

    const matches = [];

    // Helper to get or create match
    const getMatch = (id) => {
        const existing = existingMatches.find(m => m.id === id);
        return existing || { id, home: null, away: null, homeScore: null, awayScore: null, winner: null };
    };

    // Generate R32
    r32Structure.forEach(struct => {
        const match = getMatch(struct.id);
        match.home = qualifiers[struct.home] || null;

        if (struct.away) {
            match.away = qualifiers[struct.away] || null;
        } else {
            match.away = thirdPlaceAssignments[struct.id] || null;
        }
        matches.push(match);
    });

    // Generate subsequent rounds
    // R16
    for (let i = 1; i <= 8; i++) {
        const match = getMatch(`R16-${i}`);
        const prev1 = matches.find(m => m.id === `R32-${i * 2 - 1}`);
        const prev2 = matches.find(m => m.id === `R32-${i * 2}`);
        match.home = prev1?.winner || null;
        match.away = prev2?.winner || null;
        matches.push(match);
    }

    // QF
    for (let i = 1; i <= 4; i++) {
        const match = getMatch(`QF-${i}`);
        const prev1 = matches.find(m => m.id === `R16-${i * 2 - 1}`);
        const prev2 = matches.find(m => m.id === `R16-${i * 2}`);
        match.home = prev1?.winner || null;
        match.away = prev2?.winner || null;
        matches.push(match);
    }

    // SF
    for (let i = 1; i <= 2; i++) {
        const match = getMatch(`SF-${i}`);
        const prev1 = matches.find(m => m.id === `QF-${i * 2 - 1}`);
        const prev2 = matches.find(m => m.id === `QF-${i * 2}`);
        match.home = prev1?.winner || null;
        match.away = prev2?.winner || null;
        matches.push(match);
    }

    // Final
    const finalMatch = getMatch('Final');
    const sf1 = matches.find(m => m.id === 'SF-1');
    const sf2 = matches.find(m => m.id === 'SF-2');
    finalMatch.home = sf1?.winner || null;
    finalMatch.away = sf2?.winner || null;
    matches.push(finalMatch);

    // 3rd Place
    const thirdPlaceMatch = getMatch('3rdPlace');
    // Logic: Loser of SF1 vs Loser of SF2
    // We need to track losers. 
    // For simplicity, if SF1 finished, winner is X, loser is the other.
    const getLoser = (match) => {
        if (!match.winner || !match.home || !match.away) return null;
        return match.winner === match.home ? match.away : match.home;
    };
    thirdPlaceMatch.home = getLoser(sf1) || null;
    thirdPlaceMatch.away = getLoser(sf2) || null;
    matches.push(thirdPlaceMatch);

    return { matches, best8Thirds };
};
