import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import PlayoffSimulator from './components/PlayoffSimulator';
import GroupStage from './components/GroupStage';
import KnockoutBracket from './components/KnockoutBracket';
import Statistics from './components/Statistics';
import Header from './components/Header';
import SaveLoadPanel from './components/SaveLoadPanel';
import StreamerControls from './components/streaming/StreamerControls';
import ChatPredictions from './components/streaming/ChatPredictions';
import CompactWidget from './components/streaming/CompactWidget';

function AppContent() {
  const { state, actions, activeGroups, standings, teams, stats } = useSimulation();
  const [selectedStreamMatch, setSelectedStreamMatch] = useState(null);

  // Get the first knockout match with teams for streaming demo
  const getFirstKnockoutMatch = () => {
    const match = state.knockoutMatches.find(m => m.home && m.away);
    return match || state.knockoutMatches[0];
  };

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

        {state.activeTab === 'stream' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">
                Modo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Streamer</span>
              </h2>
              <p className="text-gray-400 mt-2 text-sm md:text-base">
                Herramientas y widgets para tu stream de Kick
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Streamer Controls */}
              <StreamerControls
                matches={state.knockoutMatches}
                teams={teams}
                currentMatch={selectedStreamMatch || getFirstKnockoutMatch()}
                onSelectMatch={setSelectedStreamMatch}
              />

              {/* Chat Predictions */}
              <ChatPredictions
                match={selectedStreamMatch || getFirstKnockoutMatch()}
                teams={teams}
              />
            </div>

            {/* Widget Previews */}
            <div className="bg-[#001533] rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Vista Previa de Widgets</h3>
              <p className="text-gray-400 text-sm mb-6">
                Estos widgets se pueden usar como Browser Source en OBS. Selecciona un partido arriba para previsualizarlo.
              </p>

              <div className="space-y-6">
                {/* Minimal Widget */}
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Widget Minimalista (800x60)</h4>
                  <div className="bg-transparent p-4 rounded-lg border border-dashed border-gray-600">
                    <CompactWidget
                      match={selectedStreamMatch || getFirstKnockoutMatch()}
                      teams={teams}
                      style="minimal"
                    />
                  </div>
                </div>

                {/* Vertical Widget */}
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Widget Vertical (200x180)</h4>
                  <div className="bg-transparent p-4 rounded-lg border border-dashed border-gray-600 inline-block">
                    <CompactWidget
                      match={selectedStreamMatch || getFirstKnockoutMatch()}
                      teams={teams}
                      style="vertical"
                    />
                  </div>
                </div>

                {/* Horizontal Bar Widget */}
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Widget Barra Horizontal (800x120)</h4>
                  <div className="bg-transparent p-4 rounded-lg border border-dashed border-gray-600 max-w-2xl">
                    <CompactWidget
                      match={selectedStreamMatch || getFirstKnockoutMatch()}
                      teams={teams}
                      style="bar"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[#001533] rounded-xl p-4 border border-white/5">
              <h4 className="text-sm font-bold text-gray-400 mb-2">Como usar en OBS/Kick:</h4>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>1. Abre OBS y agrega una nueva fuente "Browser"</li>
                <li>2. Copia la URL del widget desde el panel de controles</li>
                <li>3. Configura el tamaño segun el widget (800x60, 200x180, etc.)</li>
                <li>4. Activa "Shutdown source when not visible" para mejor rendimiento</li>
                <li>5. Usa los botones de celebracion durante el stream para efectos especiales</li>
              </ul>
            </div>
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
