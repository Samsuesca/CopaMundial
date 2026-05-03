/*
 * KnockoutFocusView — vista de "broadcast" del bracket eliminatorio.
 *
 * Layout: focus card grande (≈70% width) con el partido seleccionado a tamaño TV,
 * minimap (≈30%) con todo el árbol del bracket clickeable. Atajos ←/→ para navegar
 * entre matches. Resuelve el problema de scroll horizontal en stream.
 *
 * Recibe los mismos props que KnockoutBracket — drop-in alternativo.
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Target, Trophy, Medal, MapPin, Calendar, ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { getStadiumInfo, formatMatchDate } from '../../data/schedule';

const ROUND_LABELS = {
  R32: 'Dieciseisavos',
  R16: 'Octavos',
  QF: 'Cuartos',
  SF: 'Semifinales',
  Final: 'Final',
  '3rdPlace': 'Tercer Puesto',
};

const ROUND_ORDER = ['R32', 'R16', 'QF', 'SF', '3rdPlace', 'Final'];

const getRoundOf = (id) => {
  if (id?.startsWith('R32')) return 'R32';
  if (id?.startsWith('R16')) return 'R16';
  if (id?.startsWith('QF')) return 'QF';
  if (id?.startsWith('SF')) return 'SF';
  if (id === 'Final') return 'Final';
  if (id === '3rdPlace') return '3rdPlace';
  return null;
};

// Penalty selector modal — copy reducido del original
const PenaltyModal = ({ match, teams, onPenaltyWinner, onClose }) => {
  const home = teams.find(t => t.id === match.home);
  const away = teams.find(t => t.id === match.away);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="rounded-xl p-6 max-w-md w-full mx-4"
        style={{ background: 'var(--bc-bg-surface)', border: '1px solid var(--bc-brand)', boxShadow: 'var(--bc-shadow-glow)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <Target className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--bc-brand)' }} />
          <h3 className="bc-display text-white text-xl">Tanda de Penales</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--bc-fg-muted)' }}>
            {match.homeScore} – {match.awayScore} en tiempo regular. Selecciona ganador:
          </p>
        </div>
        <div className="space-y-2">
          {[home, away].map((t) => t && (
            <button
              key={t.id}
              onClick={() => { onPenaltyWinner(match.id, t.id); onClose(); }}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-white/5"
              style={{ background: 'var(--bc-bg-deep)', border: '1px solid var(--bc-border)' }}
            >
              <span className="flex items-center gap-3">
                <span className="text-3xl">{t.flag}</span>
                <span className="bc-display text-white text-lg">{t.name}</span>
              </span>
              <span className="bc-mono text-xs" style={{ color: 'var(--bc-fg-subtle)' }}>{t.id}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-3 py-2 text-sm" style={{ color: 'var(--bc-fg-muted)' }}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

const FocusCard = ({ match, teams, onScoreChange, onPenaltyWinner }) => {
  const [showPenalty, setShowPenalty] = useState(false);
  const home = teams.find(t => t.id === match.home);
  const away = teams.find(t => t.id === match.away);
  const stadium = match.venue ? getStadiumInfo(match.venue) : null;
  const isReady = match.home && match.away;
  const finished = match.homeScore !== null && match.awayScore !== null;
  const isDraw = finished && match.homeScore === match.awayScore;
  const needsPenalties = isDraw && !match.penaltyWinner;
  const homeWin = match.winner === match.home && match.winner;
  const awayWin = match.winner === match.away && match.winner;

  const round = getRoundOf(match.id);
  const isFinal = match.id === 'Final';
  const isThirdPlace = match.id === '3rdPlace';

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(135deg, var(--bc-bg-surface) 0%, var(--bc-bg-deep) 100%)',
        borderRadius: 'var(--bc-radius-lg)',
        border: `2px solid ${isFinal ? 'var(--bc-gold)' : isThirdPlace ? '#d97706' : finished ? 'var(--bc-brand)' : 'var(--bc-border-strong)'}`,
        boxShadow: isFinal ? 'var(--bc-shadow-gold)' : finished ? 'var(--bc-shadow-glow)' : 'var(--bc-shadow-md)',
        minHeight: 360,
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3 px-6 py-4 border-b" style={{ borderColor: 'var(--bc-border)' }}>
        <div className="flex items-center gap-3">
          {isFinal && <Trophy className="w-5 h-5" style={{ color: 'var(--bc-gold)' }} />}
          {isThirdPlace && <Medal className="w-5 h-5 text-amber-600" />}
          <h2
            className="bc-display"
            style={{
              color: isFinal ? 'var(--bc-gold)' : isThirdPlace ? '#f59e0b' : 'var(--bc-brand)',
              fontSize: 24,
              letterSpacing: '0.16em',
            }}
          >
            {ROUND_LABELS[round] || match.id}
            <span className="ml-3 bc-mono" style={{ color: 'var(--bc-fg-subtle)', fontSize: 14, letterSpacing: '0.1em' }}>
              {match.id}
            </span>
          </h2>
        </div>
        <div className="bc-mono flex items-center gap-3 text-xs" style={{ color: 'var(--bc-fg-muted)' }}>
          {match.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatMatchDate(match.date)}
              {match.kickoff && ` · ${match.kickoff}`}
            </span>
          )}
          {stadium && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {stadium.countryFlag} {stadium.city}
            </span>
          )}
          {finished && (
            <span className="flex items-center gap-1.5" style={{ color: 'var(--bc-brand)' }}>
              <Radio className="w-3.5 h-3.5" />
              FT
            </span>
          )}
        </div>
      </header>

      {/* Body — equipos + score */}
      <div className="flex-1 grid items-center gap-8 px-8 py-10" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
        {/* Home */}
        <div className="flex flex-col items-center gap-4">
          <span style={{ fontSize: 'clamp(80px, 9vw, 140px)', lineHeight: 1 }}>{home?.flag || '🏳️'}</span>
          <div className="text-center">
            <p
              className="bc-display"
              style={{
                fontSize: 'clamp(32px, 3.6vw, 56px)',
                color: homeWin ? 'var(--bc-brand)' : 'var(--bc-fg)',
                textShadow: homeWin ? '0 0 28px var(--bc-brand-glow)' : 'none',
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}
            >
              {home?.name || 'TBD'}
            </p>
            <p className="bc-mono mt-1" style={{ fontSize: 13, color: 'var(--bc-fg-subtle)', letterSpacing: '0.18em' }}>
              {home?.id || '---'}
              {home?.rating ? ` · #${home.rating}` : ''}
            </p>
          </div>
          <input
            type="number"
            min="0"
            disabled={!isReady}
            value={match.homeScore ?? ''}
            onChange={(e) => onScoreChange(match.id, 'homeScore', e.target.value)}
            className="rounded-lg text-center transition-all focus:outline-none disabled:opacity-30"
            style={{
              width: 96,
              height: 80,
              background: 'rgba(0, 17, 42, 0.85)',
              border: `2px solid ${homeWin ? 'var(--bc-brand)' : 'var(--bc-border-strong)'}`,
              fontFamily: 'var(--bc-font-mono)',
              fontSize: 56,
              fontWeight: 800,
              color: homeWin ? 'var(--bc-brand)' : 'var(--bc-fg)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.04em',
              boxShadow: homeWin ? '0 0 24px var(--bc-brand-glow)' : 'none',
            }}
          />
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center gap-3">
          <span className="bc-display" style={{ fontSize: 64, color: 'var(--bc-fg-subtle)', lineHeight: 1 }}>VS</span>
          {match.penaltyWinner && (
            <span
              className="bc-display rounded px-2 py-1"
              style={{
                background: 'var(--bc-gold)',
                color: 'var(--bc-bg-deep)',
                fontSize: 11,
                letterSpacing: '0.16em',
              }}
            >
              Penales
            </span>
          )}
          {needsPenalties && (
            <button
              onClick={() => setShowPenalty(true)}
              className="bc-display px-3 py-1.5 rounded transition-colors"
              style={{
                background: 'var(--bc-red)',
                color: 'var(--bc-fg)',
                fontSize: 11,
                letterSpacing: '0.18em',
                animation: 'bc-live-pulse 1.6s ease-in-out infinite',
              }}
            >
              <Target className="inline w-3 h-3 mr-1" />
              Definir Penales
            </button>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-4">
          <span style={{ fontSize: 'clamp(80px, 9vw, 140px)', lineHeight: 1 }}>{away?.flag || '🏳️'}</span>
          <div className="text-center">
            <p
              className="bc-display"
              style={{
                fontSize: 'clamp(32px, 3.6vw, 56px)',
                color: awayWin ? 'var(--bc-brand)' : 'var(--bc-fg)',
                textShadow: awayWin ? '0 0 28px var(--bc-brand-glow)' : 'none',
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}
            >
              {away?.name || 'TBD'}
            </p>
            <p className="bc-mono mt-1" style={{ fontSize: 13, color: 'var(--bc-fg-subtle)', letterSpacing: '0.18em' }}>
              {away?.id || '---'}
              {away?.rating ? ` · #${away.rating}` : ''}
            </p>
          </div>
          <input
            type="number"
            min="0"
            disabled={!isReady}
            value={match.awayScore ?? ''}
            onChange={(e) => onScoreChange(match.id, 'awayScore', e.target.value)}
            className="rounded-lg text-center transition-all focus:outline-none disabled:opacity-30"
            style={{
              width: 96,
              height: 80,
              background: 'rgba(0, 17, 42, 0.85)',
              border: `2px solid ${awayWin ? 'var(--bc-brand)' : 'var(--bc-border-strong)'}`,
              fontFamily: 'var(--bc-font-mono)',
              fontSize: 56,
              fontWeight: 800,
              color: awayWin ? 'var(--bc-brand)' : 'var(--bc-fg)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.04em',
              boxShadow: awayWin ? '0 0 24px var(--bc-brand-glow)' : 'none',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      {stadium && (
        <footer
          className="bc-mono px-6 py-3 border-t flex items-center justify-between"
          style={{
            borderColor: 'var(--bc-border)',
            color: 'var(--bc-fg-muted)',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>{stadium.stadium} · {stadium.city}, {stadium.country}</span>
          <span>Capacidad {stadium.capacity.toLocaleString('es')}</span>
        </footer>
      )}

      {showPenalty && (
        <PenaltyModal match={match} teams={teams} onPenaltyWinner={onPenaltyWinner} onClose={() => setShowPenalty(false)} />
      )}
    </div>
  );
};

const MinimapTile = ({ match, teams, isFocused, onClick }) => {
  const home = teams.find(t => t.id === match.home);
  const away = teams.find(t => t.id === match.away);
  const finished = match.homeScore !== null && match.awayScore !== null;
  const homeWin = match.winner === match.home;
  const awayWin = match.winner === match.away;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded transition-all focus:outline-none"
      style={{
        background: isFocused ? 'var(--bc-brand)' : 'var(--bc-bg-deep)',
        color: isFocused ? 'var(--bc-bg-deep)' : 'var(--bc-fg)',
        padding: '6px 8px',
        border: `1px solid ${isFocused ? 'var(--bc-brand)' : 'var(--bc-border)'}`,
        boxShadow: isFocused ? '0 0 12px var(--bc-brand-glow)' : 'none',
      }}
    >
      <div className="flex items-center justify-between gap-1 text-[10px]">
        <span className="flex items-center gap-1 min-w-0">
          <span style={{ fontSize: 12 }}>{home?.flag || '🏳️'}</span>
          <span
            className="bc-display truncate"
            style={{
              fontSize: 11,
              opacity: finished && !homeWin ? 0.5 : 1,
              fontWeight: homeWin ? 700 : 400,
            }}
          >
            {home?.id || '?'}
          </span>
        </span>
        <span className="bc-mono shrink-0" style={{ fontSize: 11, fontWeight: 700 }}>
          {match.homeScore ?? '–'}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1 text-[10px] mt-0.5">
        <span className="flex items-center gap-1 min-w-0">
          <span style={{ fontSize: 12 }}>{away?.flag || '🏳️'}</span>
          <span
            className="bc-display truncate"
            style={{
              fontSize: 11,
              opacity: finished && !awayWin ? 0.5 : 1,
              fontWeight: awayWin ? 700 : 400,
            }}
          >
            {away?.id || '?'}
          </span>
        </span>
        <span className="bc-mono shrink-0" style={{ fontSize: 11, fontWeight: 700 }}>
          {match.awayScore ?? '–'}
        </span>
      </div>
    </button>
  );
};

const Minimap = ({ matches, teams, focusedId, onSelect, sortedMatches }) => {
  const byRound = useMemo(() => {
    const result = { R32: [], R16: [], QF: [], SF: [], Final: [], '3rdPlace': [] };
    matches.forEach(m => {
      const r = getRoundOf(m.id);
      if (r) result[r].push(m);
    });
    return result;
  }, [matches]);

  const focusedIndex = sortedMatches.findIndex(m => m.id === focusedId);

  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-3"
      style={{
        background: 'var(--bc-bg-surface)',
        border: '1px solid var(--bc-border)',
        minHeight: 360,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="bc-display" style={{ color: 'var(--bc-brand)', fontSize: 13, letterSpacing: '0.18em' }}>
          Bracket
        </h3>
        <span className="bc-mono" style={{ color: 'var(--bc-fg-subtle)', fontSize: 10, letterSpacing: '0.14em' }}>
          {focusedIndex + 1} / {sortedMatches.length}
        </span>
      </div>

      <div className="flex-1 grid grid-cols-5 gap-2 text-xs">
        {['R32', 'R16', 'QF', 'SF', 'Final'].map(roundId => (
          <div key={roundId} className="flex flex-col gap-1">
            <h4
              className="bc-display text-center"
              style={{
                color: 'var(--bc-fg-subtle)',
                fontSize: 9,
                letterSpacing: '0.16em',
                marginBottom: 2,
              }}
            >
              {roundId === 'R32' ? '16vos' : roundId === 'R16' ? 'Octavos' : roundId === 'QF' ? 'Cuartos' : roundId === 'SF' ? 'Semis' : 'Final'}
            </h4>
            <div className="flex flex-col gap-1">
              {byRound[roundId].map(m => (
                <MinimapTile
                  key={m.id}
                  match={m}
                  teams={teams}
                  isFocused={m.id === focusedId}
                  onClick={() => onSelect(m.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {byRound['3rdPlace']?.[0] && (
        <div>
          <h4 className="bc-display text-center mb-1" style={{ color: '#f59e0b', fontSize: 10, letterSpacing: '0.16em' }}>
            <Medal className="inline w-3 h-3 mr-1" />
            Tercer Puesto
          </h4>
          <MinimapTile
            match={byRound['3rdPlace'][0]}
            teams={teams}
            isFocused={byRound['3rdPlace'][0].id === focusedId}
            onClick={() => onSelect(byRound['3rdPlace'][0].id)}
          />
        </div>
      )}

      <div className="bc-mono text-[10px] pt-2 border-t" style={{ borderColor: 'var(--bc-border)', color: 'var(--bc-fg-subtle)', letterSpacing: '0.06em' }}>
        <kbd className="px-1.5 py-0.5 rounded mr-1" style={{ background: 'rgba(255,255,255,0.08)' }}>←</kbd>
        <kbd className="px-1.5 py-0.5 rounded mr-2" style={{ background: 'rgba(255,255,255,0.08)' }}>→</kbd>
        Navegar
      </div>
    </div>
  );
};

const KnockoutFocusView = ({ matches, teams, onMatchUpdate, onPenaltyWinner }) => {
  // Orden lineal para navegación con flechas
  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      const ai = ROUND_ORDER.indexOf(getRoundOf(a.id));
      const bi = ROUND_ORDER.indexOf(getRoundOf(b.id));
      if (ai !== bi) return ai - bi;
      return a.id.localeCompare(b.id, 'en', { numeric: true });
    });
  }, [matches]);

  // Default focus: primer match con teams asignados, sino primer R32
  const defaultId = useMemo(() => {
    const ready = sortedMatches.find(m => m.home && m.away && m.homeScore === null);
    if (ready) return ready.id;
    return sortedMatches[0]?.id;
  }, [sortedMatches]);

  const [focusedId, setFocusedId] = useState(defaultId);

  // Re-focus al primer match disponible cuando el match actual desaparece
  // (p.ej. tras un reset). Subscripción a state externo, no causa cascadas.
  useEffect(() => {
    if (!matches.find(m => m.id === focusedId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- recovery cuando el id queda huérfano
      setFocusedId(defaultId);
    }
  }, [matches, focusedId, defaultId]);

  // Navegación con flechas
  const navigate = useCallback((direction) => {
    setFocusedId(prev => {
      const idx = sortedMatches.findIndex(m => m.id === prev);
      if (idx < 0) return prev;
      const next = (idx + direction + sortedMatches.length) % sortedMatches.length;
      return sortedMatches[next].id;
    });
  }, [sortedMatches]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const focusedMatch = matches.find(m => m.id === focusedId) || matches[0];
  const finalMatch = matches.find(m => m.id === 'Final');
  const champion = finalMatch?.winner ? teams.find(t => t.id === finalMatch.winner) : null;

  return (
    <div className="space-y-6">
      {/* Champion banner */}
      {champion && (
        <div
          className="rounded-xl p-5 text-center bc-champion-ascend"
          style={{
            background: 'linear-gradient(90deg, rgba(255,184,0,0.15), rgba(255,184,0,0.3), rgba(255,184,0,0.15))',
            border: '1px solid var(--bc-gold)',
            boxShadow: 'var(--bc-shadow-gold)',
          }}
        >
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--bc-gold)' }} />
          <h2 className="bc-display" style={{ color: 'var(--bc-fg)', fontSize: 28, letterSpacing: '0.04em' }}>
            Campeón del Mundo
          </h2>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span style={{ fontSize: 56 }}>{champion.flag}</span>
            <span className="bc-display" style={{ color: 'var(--bc-brand)', fontSize: 40, letterSpacing: '0.02em' }}>
              {champion.name}
            </span>
          </div>
        </div>
      )}

      {/* Layout: focus 70% + minimap 30% */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(0, 7fr) minmax(280px, 3fr)' }}>
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate(-1)}
              className="bc-display flex items-center gap-2 px-3 py-2 rounded transition-colors hover:bg-white/5"
              style={{ color: 'var(--bc-fg-muted)', fontSize: 12, letterSpacing: '0.16em' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={() => navigate(1)}
              className="bc-display flex items-center gap-2 px-3 py-2 rounded transition-colors hover:bg-white/5"
              style={{ color: 'var(--bc-fg-muted)', fontSize: 12, letterSpacing: '0.16em' }}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {focusedMatch && (
            <FocusCard
              match={focusedMatch}
              teams={teams}
              onScoreChange={onMatchUpdate}
              onPenaltyWinner={onPenaltyWinner}
            />
          )}
        </div>

        <Minimap
          matches={matches}
          teams={teams}
          focusedId={focusedId}
          onSelect={setFocusedId}
          sortedMatches={sortedMatches}
        />
      </div>
    </div>
  );
};

export default KnockoutFocusView;
