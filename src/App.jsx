import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { I18nProvider, useI18n } from './context/I18nContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import SaveLoadPanel from './components/SaveLoadPanel';
import AutoSimPanel from './components/AutoSimPanel';
import PlayoffSimulator from './components/PlayoffSimulator';
import GroupStage from './components/GroupStage';
import KnockoutBracket from './components/KnockoutBracket';
import Statistics from './components/Statistics';
import MatchCalendar from './components/MatchCalendar';
import KeyboardShortcutsModal, { useKeyboardShortcuts } from './components/KeyboardShortcuts';
import { AchievementToast, AchievementsModal, useAchievements } from './components/AchievementsPanel';
import SharePanel from './components/SharePanel';
import ExportPanel from './components/ExportPanel';
import CompareSimulations from './components/CompareSimulations';
import Tutorial, { useTutorial } from './components/Tutorial';
import HistoricalData from './components/HistoricalData';
import AIInsights from './components/AIInsights';
import BracketChallenge from './components/BracketChallenge';
import StreamerControls from './components/streaming/StreamerControls';
import ChatPredictions from './components/streaming/ChatPredictions';
import CompactWidget from './components/streaming/CompactWidget';
import BroadcastOverlay from './components/broadcast/BroadcastOverlay';
import MatchCardOBS from './components/broadcast/MatchCardOBS';
import { useBroadcastTrigger } from './hooks/useBroadcastTrigger';

function AppContent() {
  const { state, actions, activeGroups, standings, teams, stats } = useSimulation();
  const { cycleTheme } = useTheme();
  const { t, cycleLang } = useI18n();
  const [selectedStreamMatch, setSelectedStreamMatch] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  // Tutorial
  const { showTutorial, completeTutorial } = useTutorial();

  // Achievements
  const { toast: achievementToast, clearToast } = useAchievements(state, standings, stats);

  // Keyboard shortcuts
  const { showShortcuts, setShowShortcuts } = useKeyboardShortcuts({
    onTabChange: actions.setActiveTab,
    onSave: actions.saveSimulation,
    onExport: () => setShowExport(true),
    onCycleTheme: cycleTheme,
    onCycleLang: cycleLang,
  });

  const getFirstKnockoutMatch = () => {
    const match = state.knockoutMatches.find(m => m.home && m.away);
    return match || state.knockoutMatches[0];
  };

  const currentStreamMatch = selectedStreamMatch || getFirstKnockoutMatch();
  const homeTeam = teams.find(t => t.id === currentStreamMatch?.home);
  const awayTeam = teams.find(t => t.id === currentStreamMatch?.away);

  // Broadcast overlays: auto-trigger en champion/upset + atajos G/V/U
  const { overlay: broadcastOverlay, dismiss: dismissBroadcast } = useBroadcastTrigger({
    stats,
    teams,
    currentMatch: currentStreamMatch,
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-[var(--color-text)] font-sans selection:bg-[var(--color-primary)] selection:text-[var(--color-bg-dark)]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-[var(--color-bg-dark)] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">
        Skip to content
      </a>

      <Header
        activeTab={state.activeTab}
        onTabChange={actions.setActiveTab}
        stats={stats}
        onShowAchievements={() => setShowAchievements(true)}
        onShowShortcuts={() => setShowShortcuts(true)}
      />

      <main id="main-content" className="max-w-[1600px] mx-auto p-4 md:p-6" role="main">
        <SaveLoadPanel
          onShowShare={() => setShowShare(true)}
          onShowExport={() => setShowExport(true)}
          onShowCompare={() => setShowCompare(true)}
        />

        <AutoSimPanel
          state={state}
          actions={actions}
        />

        <ErrorBoundary>
          {state.activeTab === 'playoffs' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" role="tabpanel" id="panel-playoffs">
              <PlayoffSimulator
                onWinnerSelect={actions.setPlayoffWinner}
                selectedWinners={state.selectedWinners}
              />
            </div>
          )}

          {state.activeTab === 'groups' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" role="tabpanel" id="panel-groups">
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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" role="tabpanel" id="panel-knockout">
              <KnockoutBracket
                matches={state.knockoutMatches}
                teams={teams}
                onMatchUpdate={actions.updateKnockoutMatch}
                onPenaltyWinner={actions.setPenaltyWinner}
              />
            </div>
          )}

          {state.activeTab === 'stats' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8" role="tabpanel" id="panel-stats">
              <Statistics />
              <AIInsights
                standings={standings}
                stats={stats}
                groupMatches={state.groupMatches}
                knockoutMatches={state.knockoutMatches}
              />
              <BracketChallenge state={state} />
              <HistoricalData />
            </div>
          )}

          {state.activeTab === 'calendar' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" role="tabpanel" id="panel-calendar">
              <MatchCalendar
                groupMatches={state.groupMatches}
                knockoutMatches={state.knockoutMatches}
              />
            </div>
          )}

          {state.activeTab === 'stream' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8" role="tabpanel" id="panel-stream">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">
                  {t('stream.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{t('stream.titleHighlight')}</span>
                </h2>
                <p className="text-gray-400 mt-2 text-sm md:text-base">{t('stream.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StreamerControls
                  matches={state.knockoutMatches}
                  teams={teams}
                  currentMatch={selectedStreamMatch || getFirstKnockoutMatch()}
                  onSelectMatch={setSelectedStreamMatch}
                />
                <ChatPredictions
                  match={selectedStreamMatch || getFirstKnockoutMatch()}
                  teams={teams}
                />
              </div>

              {/* Modo Broadcast — widgets OBS rediseñados */}
              <div className="rounded-xl p-6 border" style={{ background: 'var(--bc-bg-surface)', borderColor: 'var(--bc-brand)', boxShadow: 'var(--bc-shadow-glow)' }}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <h3 className="bc-display text-white" style={{ fontSize: '24px', letterSpacing: '0.12em' }}>
                      Modo Broadcast
                      <span className="ml-2 align-middle bc-display rounded px-2 py-0.5" style={{ background: 'var(--bc-brand)', color: 'var(--bc-bg-deep)', fontSize: '11px', letterSpacing: '0.18em' }}>
                        Nuevo
                      </span>
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--bc-fg-muted)' }}>
                      Widgets stream-grade con tipografía broadcast, códigos FIFA correctos y nombres completos.
                      Atajos: <kbd className="bc-mono px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.08)' }}>G</kbd> Gol ·
                      <kbd className="bc-mono px-1.5 py-0.5 rounded text-xs ml-1" style={{ background: 'rgba(255,255,255,0.08)' }}>V</kbd> Victoria ·
                      <kbd className="bc-mono px-1.5 py-0.5 rounded text-xs ml-1" style={{ background: 'rgba(255,255,255,0.08)' }}>U</kbd> Upset
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <h4 className="bc-display mb-2" style={{ color: 'var(--bc-fg-subtle)', fontSize: '11px', letterSpacing: '0.18em' }}>Bar · 1920×140 — Overlay top/bottom</h4>
                    <div className="rounded-lg border border-dashed p-2" style={{ borderColor: 'var(--bc-border)' }}>
                      <MatchCardOBS match={currentStreamMatch || {}} homeTeam={homeTeam} awayTeam={awayTeam} variant="bar" isLive={false} />
                    </div>
                  </div>
                  <div>
                    <h4 className="bc-display mb-2" style={{ color: 'var(--bc-fg-subtle)', fontSize: '11px', letterSpacing: '0.18em' }}>Pill · 640×80 — Overlay esquina</h4>
                    <div className="rounded-lg border border-dashed p-2 inline-block" style={{ borderColor: 'var(--bc-border)' }}>
                      <MatchCardOBS match={currentStreamMatch || {}} homeTeam={homeTeam} awayTeam={awayTeam} variant="pill" isLive={false} />
                    </div>
                  </div>
                  <div>
                    <h4 className="bc-display mb-2" style={{ color: 'var(--bc-fg-subtle)', fontSize: '11px', letterSpacing: '0.18em' }}>Card · 380×280 — Overlay vertical</h4>
                    <div className="rounded-lg border border-dashed p-2 inline-block" style={{ borderColor: 'var(--bc-border)' }}>
                      <MatchCardOBS
                        match={currentStreamMatch || {}}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        variant="card"
                        isLive={false}
                        roundLabel={currentStreamMatch?.id?.startsWith('R32') ? 'Dieciseisavos' :
                                    currentStreamMatch?.id?.startsWith('R16') ? 'Octavos' :
                                    currentStreamMatch?.id?.startsWith('QF') ? 'Cuartos' :
                                    currentStreamMatch?.id?.startsWith('SF') ? 'Semifinales' :
                                    currentStreamMatch?.id === 'Final' ? 'Final' : ''}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Vista Previa de Widgets (Legacy)</h3>
                <p className="text-gray-400 text-sm mb-6">Versión original — se mantiene durante la migración.</p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Widget Minimalista (800x60)</h4>
                    <div className="bg-transparent p-4 rounded-lg border border-dashed border-gray-600">
                      <CompactWidget match={selectedStreamMatch || getFirstKnockoutMatch()} teams={teams} style="minimal" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Widget Vertical (200x180)</h4>
                    <div className="bg-transparent p-4 rounded-lg border border-dashed border-gray-600 inline-block">
                      <CompactWidget match={selectedStreamMatch || getFirstKnockoutMatch()} teams={teams} style="vertical" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Widget Barra Horizontal (800x120)</h4>
                    <div className="bg-transparent p-4 rounded-lg border border-dashed border-gray-600 max-w-2xl">
                      <CompactWidget match={selectedStreamMatch || getFirstKnockoutMatch()} teams={teams} style="bar" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-bg-darker)] rounded-xl p-4 border border-white/5">
                <h4 className="text-sm font-bold text-gray-400 mb-2">Como usar en OBS/Kick:</h4>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>1. Abre OBS y agrega una nueva fuente &quot;Browser&quot;</li>
                  <li>2. Copia la URL del widget desde el panel de controles</li>
                  <li>3. Configura el tamaño segun el widget (800x60, 200x180, etc.)</li>
                  <li>4. Activa &quot;Shutdown source when not visible&quot; para mejor rendimiento</li>
                  <li>5. Usa los botones de celebracion durante el stream para efectos especiales</li>
                </ul>
              </div>
            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12 py-6 text-center text-gray-500 text-sm" role="contentinfo">
        <p>{t('footer.title')} - Built with React + Tailwind CSS</p>
        <p className="mt-1 text-xs">{t('footer.autoSave')}</p>
        <div className="mt-2 flex justify-center gap-4 text-xs">
          <button onClick={() => setShowShortcuts(true)} className="hover:text-[var(--color-primary)] transition-colors">
            Atajos de teclado (?)
          </button>
          <button onClick={() => setShowAchievements(true)} className="hover:text-yellow-400 transition-colors">
            Logros
          </button>
        </div>
      </footer>

      {/* Modals */}
      {showTutorial && <Tutorial onComplete={completeTutorial} />}
      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} />}
      {showShare && <SharePanel state={state} onClose={() => setShowShare(false)} />}
      {showExport && <ExportPanel state={state} standings={standings} stats={stats} onClose={() => setShowExport(false)} />}
      {showCompare && <CompareSimulations savedSimulations={state.savedSimulations} onClose={() => setShowCompare(false)} />}
      {achievementToast && <AchievementToast achievement={achievementToast} onClose={clearToast} />}

      {/* Broadcast overlay: champion auto, upset auto, manual via G/V/U */}
      {broadcastOverlay && (
        <BroadcastOverlay
          key={broadcastOverlay.key}
          type={broadcastOverlay.type}
          team={broadcastOverlay.team}
          subtitle={broadcastOverlay.subtitle}
          duration={broadcastOverlay.duration}
          onClose={dismissBroadcast}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SimulationProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </SimulationProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
