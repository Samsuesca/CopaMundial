import React from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import PlayoffSimulator from './components/PlayoffSimulator';
import GroupStage from './components/GroupStage';
import KnockoutBracket from './components/KnockoutBracket';
import Statistics from './components/Statistics';
import Header from './components/Header';
import SaveLoadPanel from './components/SaveLoadPanel';

function AppContent() {
  const { state, actions, activeGroups, standings, teams, stats } = useSimulation();

  return (
    <div className="min-h-screen bg-[#00204C] text-white font-sans selection:bg-[#00FF85] selection:text-[#00204C]">
      <Header
        activeTab={state.activeTab}
        onTabChange={actions.setActiveTab}
        stats={stats}
      />

      <main className="max-w-[1600px] mx-auto p-4 md:p-6">
        {/* Save/Load Panel */}
        <SaveLoadPanel />

        {state.activeTab === 'playoffs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PlayoffSimulator
              onWinnerSelect={actions.setPlayoffWinner}
              selectedWinners={state.selectedWinners}
            />
          </div>
        )}

        {state.activeTab === 'groups' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GroupStage
              groups={activeGroups}
              matches={state.groupMatches}
              teams={teams}
              standings={standings}
              onMatchUpdate={actions.updateGroupMatch}
            />
          </div>
        )}

        {state.activeTab === 'knockout' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KnockoutBracket
              matches={state.knockoutMatches}
              teams={teams}
              onMatchUpdate={actions.updateKnockoutMatch}
              onPenaltyWinner={actions.setPenaltyWinner}
            />
          </div>
        )}

        {state.activeTab === 'stats' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Statistics />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12 py-6 text-center text-gray-500 text-sm">
        <p>World Cup 2026 Simulator - Built with React + Tailwind CSS</p>
        <p className="mt-1 text-xs">Data auto-saves to your browser</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}

export default App;
