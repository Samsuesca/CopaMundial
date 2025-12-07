import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_GROUPS } from './data/groups';
import { TEAMS } from './data/teams';
import PlayoffSimulator from './components/PlayoffSimulator';
import GroupStage from './components/GroupStage';
import KnockoutBracket from './components/KnockoutBracket';
import { calculateStandings, generateGroupMatches, generateKnockoutBracket } from './utils/simulator';
import { Trophy } from 'lucide-react';

function App() {
  const [selectedWinners, setSelectedWinners] = useState({});
  const [groupMatches, setGroupMatches] = useState([]);
  const [knockoutMatches, setKnockoutMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('playoffs'); // playoffs, groups, knockout

  // 1. Resolve Teams
  const activeGroups = useMemo(() => {
    return INITIAL_GROUPS.map(group => ({
      ...group,
      teams: group.teams.map(teamId => {
        if (teamId.startsWith('PLAYOFF_')) {
          const key = teamId.replace('PLAYOFF_', '');
          return selectedWinners[key] || teamId;
        }
        return teamId;
      })
    }));
  }, [selectedWinners]);

  // 2. Initialize Group Matches
  useEffect(() => {
    if (groupMatches.length === 0) {
      setGroupMatches(generateGroupMatches(activeGroups));
    } else {
      setGroupMatches(prev => {
        const newMatches = generateGroupMatches(activeGroups);
        return newMatches.map(nm => {
          const existing = prev.find(pm => pm.id === nm.id);
          return existing ? { ...existing, home: nm.home, away: nm.away } : nm;
        });
      });
    }
  }, [activeGroups]);

  // 3. Calculate Standings
  const standings = useMemo(() => {
    const newStandings = {};
    activeGroups.forEach(group => {
      const matches = groupMatches.filter(m => m.group === group.id);
      newStandings[group.id] = calculateStandings(matches, group.teams);
    });
    return newStandings;
  }, [groupMatches, activeGroups]);

  // 4. Generate/Update Bracket
  useEffect(() => {
    const { matches } = generateKnockoutBracket(activeGroups, standings, knockoutMatches);
    // Only update if changes to avoid loops, but since generateKnockoutBracket returns new objects, 
    // we need to be careful. For now, we update on standings change.
    // To preserve scores, we pass existing knockoutMatches to the generator.
    setKnockoutMatches(matches);
  }, [standings]);

  const handleGroupMatchUpdate = (id, field, value) => {
    setGroupMatches(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value === '' ? null : parseInt(value) };
        updated.finished = updated.homeScore !== null && updated.awayScore !== null;
        return updated;
      }
      return m;
    }));
  };

  const handleKnockoutMatchUpdate = (id, field, value) => {
    setKnockoutMatches(prev => {
      const updatedMatches = prev.map(m => {
        if (m.id === id) {
          const updated = { ...m, [field]: value === '' ? null : parseInt(value) };
          // Determine winner
          if (updated.homeScore !== null && updated.awayScore !== null) {
            if (updated.homeScore > updated.awayScore) updated.winner = updated.home;
            else if (updated.awayScore > updated.homeScore) updated.winner = updated.away;
            else updated.winner = null; // Draw not allowed in knockout, user must decide (penalties logic could be added)
          } else {
            updated.winner = null;
          }
          return updated;
        }
        return m;
      });

      // Re-run generator to propagate winners
      const { matches } = generateKnockoutBracket(activeGroups, standings, updatedMatches);
      return matches;
    });
  };

  const handleWinnerSelect = (pathKey, teamId) => {
    setSelectedWinners(prev => ({ ...prev, [pathKey]: teamId }));
  };

  return (
    <div className="min-h-screen bg-[#00204C] text-white font-sans selection:bg-[#00FF85] selection:text-[#00204C]">
      {/* Header */}
      <header className="bg-[#001533] border-b border-[#00FF85]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#00FF85]" />
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                World Cup <span className="text-[#00FF85]">2026</span>
              </h1>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Simulator</p>
            </div>
          </div>

          <nav className="flex gap-1 bg-[#00204C] p-1 rounded-lg border border-white/10">
            {['playoffs', 'groups', 'knockout'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition-all ${activeTab === tab
                    ? 'bg-[#00FF85] text-[#00204C] shadow-[0_0_15px_rgba(0,255,133,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        {activeTab === 'playoffs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PlayoffSimulator
              onWinnerSelect={handleWinnerSelect}
              selectedWinners={selectedWinners}
            />
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GroupStage
              groups={activeGroups}
              matches={groupMatches}
              teams={TEAMS}
              standings={standings}
              onMatchUpdate={handleGroupMatchUpdate}
            />
          </div>
        )}

        {activeTab === 'knockout' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KnockoutBracket
              matches={knockoutMatches}
              teams={TEAMS}
              onMatchUpdate={handleKnockoutMatchUpdate}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
