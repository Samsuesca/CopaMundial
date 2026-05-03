/*
 * MatchCardOBS — widget de scoreboard para Browser Source en OBS/Kick.
 *
 * Diferencias vs CompactWidget original:
 *  - Usa team.id (FIFA codes) en lugar de slice(0, 3) del nombre
 *    (BIH no BOS, KOR no SOU)
 *  - Nombre completo cuando hay espacio, code FIFA cuando no
 *  - Tipografía Bebas Neue para nombres + JetBrains Mono para scores (broadcast-grade)
 *  - Diagonal accent en bordes (estilo FIFA broadcast graphic)
 *  - Tres tamaños: bar (1920x140), card (560x280), pill (640x80)
 *  - Live indicator con pulse refinado
 *
 * Uso en OBS: Browser Source apuntando a /widget/[bar|card|pill]?matchId=XX
 */

import React from 'react';
import { Radio } from 'lucide-react';

const SIZE_PRESETS = {
  bar:  { width: '100%',   nameSize: 'clamp(20px, 2vw, 36px)',  scoreSize: 'clamp(40px, 4vw, 72px)', flagSize: 'clamp(32px, 3vw, 56px)', padding: '12px 24px' },
  card: { width: '560px',  nameSize: '24px',                    scoreSize: '64px',                   flagSize: '48px',                   padding: '20px' },
  pill: { width: '640px',  nameSize: '18px',                    scoreSize: '40px',                   flagSize: '32px',                   padding: '10px 20px' },
};

const TeamSide = ({ team, isWinner, sizes, align = 'left' }) => {
  const isReverse = align === 'right';
  return (
    <div
      className={`flex items-center gap-3 ${isReverse ? 'flex-row-reverse' : ''}`}
      style={{ minWidth: 0 }}
    >
      <span style={{ fontSize: sizes.flagSize, lineHeight: 1, flexShrink: 0 }}>
        {team?.flag || '🏳️'}
      </span>
      <div className={`min-w-0 ${isReverse ? 'text-right' : ''}`}>
        <div
          className="bc-display truncate"
          style={{
            fontSize: sizes.nameSize,
            color: isWinner ? 'var(--bc-brand)' : 'var(--bc-fg)',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            textShadow: isWinner ? '0 0 12px var(--bc-brand-glow)' : 'none',
          }}
        >
          {team?.name || 'TBD'}
        </div>
        <div
          className="bc-mono"
          style={{
            fontSize: '11px',
            color: 'var(--bc-fg-subtle)',
            letterSpacing: '0.16em',
          }}
        >
          {team?.id || '---'}
        </div>
      </div>
    </div>
  );
};

const Scoreboard = ({ homeScore, awayScore, isLive, scoreSize }) => (
  <div
    className="flex items-center gap-3 bc-mono"
    style={{
      background: 'rgba(0, 17, 42, 0.85)',
      padding: '6px 16px',
      borderRadius: 'var(--bc-radius-md)',
      border: '1px solid var(--bc-border-strong)',
    }}
  >
    <span
      className="bc-score"
      style={{ fontSize: scoreSize, color: 'var(--bc-fg)', minWidth: '1.2ch', textAlign: 'center' }}
    >
      {homeScore ?? '–'}
    </span>
    <span style={{ fontSize: '0.5em', color: 'var(--bc-fg-subtle)' }}>:</span>
    <span
      className="bc-score"
      style={{ fontSize: scoreSize, color: 'var(--bc-fg)', minWidth: '1.2ch', textAlign: 'center' }}
    >
      {awayScore ?? '–'}
    </span>
    {isLive && (
      <span
        className="bc-live-pulse ml-2 inline-block h-2 w-2 rounded-full"
        style={{ background: 'var(--bc-red)' }}
      />
    )}
  </div>
);

const MatchCardOBS = ({
  match,
  homeTeam,
  awayTeam,
  variant = 'bar',
  isLive = false,
  roundLabel,
  venueLabel,
}) => {
  const sizes = SIZE_PRESETS[variant] || SIZE_PRESETS.bar;
  const finished = match.homeScore !== null && match.awayScore !== null;
  const homeWin = finished && match.homeScore > match.awayScore;
  const awayWin = finished && match.awayScore > match.homeScore;

  // === Variant: Pill ===
  if (variant === 'pill') {
    return (
      <div
        className="streamer-widget flex items-center gap-4"
        style={{
          width: sizes.width,
          maxWidth: '100%',
          padding: sizes.padding,
          background: 'linear-gradient(90deg, rgba(0,17,42,0.95), rgba(10,37,70,0.95))',
          borderRadius: 'var(--bc-radius-md)',
          border: '1px solid var(--bc-brand)',
          boxShadow: 'var(--bc-shadow-glow)',
        }}
      >
        <TeamSide team={homeTeam} isWinner={homeWin} sizes={sizes} align="left" />
        <Scoreboard homeScore={match.homeScore} awayScore={match.awayScore} isLive={isLive} scoreSize={sizes.scoreSize} />
        <TeamSide team={awayTeam} isWinner={awayWin} sizes={sizes} align="right" />
      </div>
    );
  }

  // === Variant: Card vertical ===
  if (variant === 'card') {
    return (
      <div
        className="streamer-widget flex flex-col gap-4"
        style={{
          width: sizes.width,
          padding: sizes.padding,
          background: 'linear-gradient(180deg, var(--bc-bg-surface) 0%, var(--bc-bg-deep) 100%)',
          borderRadius: 'var(--bc-radius-lg)',
          border: '2px solid var(--bc-brand)',
          boxShadow: 'var(--bc-shadow-glow), var(--bc-shadow-md)',
        }}
      >
        {/* Header: round + live */}
        <div className="flex items-center justify-between text-xs">
          {roundLabel && (
            <span className="bc-display" style={{ color: 'var(--bc-brand)', letterSpacing: '0.18em', fontSize: '14px' }}>
              {roundLabel}
            </span>
          )}
          {isLive && (
            <span className="flex items-center gap-1.5">
              <span className="bc-live-pulse inline-block h-2 w-2 rounded-full" style={{ background: 'var(--bc-red)' }} />
              <span className="bc-display" style={{ color: 'var(--bc-red)', fontSize: '12px', letterSpacing: '0.18em' }}>
                <Radio className="mr-1 inline h-3 w-3" /> Vivo
              </span>
            </span>
          )}
        </div>

        {/* Equipos apilados con score grande en el medio */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <TeamSide team={homeTeam} isWinner={homeWin} sizes={sizes} align="left" />
            <span
              className="bc-score"
              style={{
                fontSize: sizes.scoreSize,
                color: homeWin ? 'var(--bc-brand)' : 'var(--bc-fg)',
                minWidth: '1.4ch',
                textAlign: 'right',
              }}
            >
              {match.homeScore ?? '–'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <TeamSide team={awayTeam} isWinner={awayWin} sizes={sizes} align="left" />
            <span
              className="bc-score"
              style={{
                fontSize: sizes.scoreSize,
                color: awayWin ? 'var(--bc-brand)' : 'var(--bc-fg)',
                minWidth: '1.4ch',
                textAlign: 'right',
              }}
            >
              {match.awayScore ?? '–'}
            </span>
          </div>
        </div>

        {venueLabel && (
          <footer
            className="bc-mono border-t pt-2 text-center"
            style={{
              borderColor: 'var(--bc-border)',
              color: 'var(--bc-fg-subtle)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {venueLabel}
          </footer>
        )}
      </div>
    );
  }

  // === Variant: Bar (1920x140 — para overlay top/bottom de stream) ===
  return (
    <div
      className="streamer-widget bc-diagonal flex items-center justify-between"
      style={{
        width: sizes.width,
        maxWidth: '100%',
        padding: sizes.padding,
        background: 'linear-gradient(90deg, var(--bc-bg-deep) 0%, var(--bc-bg-surface) 50%, var(--bc-bg-deep) 100%)',
        borderTop: '3px solid var(--bc-brand)',
        borderBottom: '3px solid var(--bc-brand)',
        gap: 24,
      }}
    >
      <TeamSide team={homeTeam} isWinner={homeWin} sizes={sizes} align="left" />
      <Scoreboard homeScore={match.homeScore} awayScore={match.awayScore} isLive={isLive} scoreSize={sizes.scoreSize} />
      <TeamSide team={awayTeam} isWinner={awayWin} sizes={sizes} align="right" />
    </div>
  );
};

export default MatchCardOBS;
