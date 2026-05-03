/*
 * MatchCardBroadcast — match card optimizado para visualización en stream.
 *
 * Diferencias vs MatchInput original:
 *  - Tipografía display condensed (Bebas Neue) para nombres de equipo (28-40px)
 *  - Score en mono 72px tabular para legibilidad a 5m de TV
 *  - Codes FIFA correctos (team.id, no slice del nombre)
 *  - Fecha/sede en chip arriba con jerarquía clara, no metadata invisible
 *  - "Anchor" visible: round badge + group badge prominentes
 *  - Estados: live (rojo pulsante), finished (brand glow), upcoming (muted)
 *
 * Uso:
 *   <MatchCardBroadcast match={match} homeTeam={...} awayTeam={...}
 *                       venue={...} round="Octavos" onScoreChange={...} />
 */

import React from 'react';
import { Calendar, MapPin, Radio } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const [, m, d] = dateStr.split('-').map(Number);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${d} ${months[m - 1]}`;
};

const TeamRow = ({ team, score, isWinner, isLive, align = 'left' }) => {
  return (
    <div
      className={`flex items-center gap-4 ${
        align === 'right' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      <span style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1 }}>
        {team?.flag || '🏳️'}
      </span>
      <div className={`min-w-0 flex-1 ${align === 'right' ? 'text-right' : ''}`}>
        <p
          className="bc-display truncate"
          style={{
            fontSize: 'clamp(20px, 2.4vw, 36px)',
            color: isWinner ? 'var(--bc-brand)' : 'var(--bc-fg)',
            textShadow: isWinner ? '0 0 16px var(--bc-brand-glow)' : 'none',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
          }}
        >
          {team?.name || 'TBD'}
        </p>
        <p
          className="bc-mono"
          style={{
            fontSize: '12px',
            color: 'var(--bc-fg-subtle)',
            letterSpacing: '0.12em',
            marginTop: 2,
          }}
        >
          {team?.id || '---'}
          {team?.rating ? ` · #${team.rating}` : ''}
        </p>
      </div>
      <span
        className={`bc-score ${isLive && score !== null ? 'bc-score-reveal' : ''}`}
        style={{
          fontSize: 'clamp(48px, 6vw, 88px)',
          color: isWinner ? 'var(--bc-brand)' : 'var(--bc-fg)',
          textShadow: isWinner ? '0 0 24px var(--bc-brand-glow)' : 'none',
          minWidth: '1.4ch',
          textAlign: 'center',
        }}
      >
        {score ?? '–'}
      </span>
    </div>
  );
};

const MatchCardBroadcast = ({
  match,
  homeTeam,
  awayTeam,
  venue,
  round,
  groupLabel,
  isLive = false,
}) => {
  const finished = match.homeScore !== null && match.awayScore !== null;
  const homeWin = finished && match.homeScore > match.awayScore;
  const awayWin = finished && match.awayScore > match.homeScore;
  const draw = finished && match.homeScore === match.awayScore;

  return (
    <article
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--bc-bg-surface) 0%, var(--bc-bg-deep) 100%)',
        borderRadius: 'var(--bc-radius-lg)',
        border: `1px solid ${finished ? 'rgba(0,255,133,0.3)' : 'var(--bc-border)'}`,
        boxShadow: finished ? 'var(--bc-shadow-glow)' : 'var(--bc-shadow-md)',
        padding: '24px 28px',
      }}
    >
      {/* Anchor superior — round + grupo + live */}
      <header className="mb-5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          {round && (
            <span
              className="bc-display"
              style={{
                color: 'var(--bc-brand)',
                fontSize: '14px',
                letterSpacing: '0.16em',
              }}
            >
              {round}
            </span>
          )}
          {groupLabel && (
            <span
              className="bc-display rounded-sm"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--bc-fg-muted)',
                padding: '4px 10px',
                fontSize: '13px',
                letterSpacing: '0.16em',
              }}
            >
              {groupLabel}
            </span>
          )}
        </div>

        {isLive ? (
          <span className="flex items-center gap-2">
            <span
              className="bc-live-pulse inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: 'var(--bc-red)' }}
            />
            <span
              className="bc-display"
              style={{
                color: 'var(--bc-red)',
                fontSize: '14px',
                letterSpacing: '0.18em',
              }}
            >
              <Radio className="mr-1 inline h-3 w-3" /> En Vivo
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-3 bc-mono" style={{ color: 'var(--bc-fg-muted)', fontSize: '12px' }}>
            {match.date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(match.date)}
                {match.kickoff && ` · ${match.kickoff}`}
              </span>
            )}
            {venue && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {venue.countryFlag} {venue.city}
              </span>
            )}
          </span>
        )}
      </header>

      {/* Cuerpo — equipos + score */}
      <div className="grid items-center gap-6" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
        <TeamRow
          team={homeTeam}
          score={match.homeScore}
          isWinner={homeWin}
          isLive={isLive}
          align="left"
        />

        <div className="flex flex-col items-center gap-1 px-2">
          <span
            className="bc-mono"
            style={{
              color: draw ? 'var(--bc-gold)' : 'var(--bc-fg-subtle)',
              fontSize: '32px',
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            :
          </span>
          {match.penaltyWinner && (
            <span
              className="bc-display rounded-sm px-2 py-0.5"
              style={{
                background: 'var(--bc-gold)',
                color: 'var(--bc-bg-deep)',
                fontSize: '10px',
                letterSpacing: '0.14em',
              }}
            >
              Penales
            </span>
          )}
        </div>

        <TeamRow
          team={awayTeam}
          score={match.awayScore}
          isWinner={awayWin}
          isLive={isLive}
          align="right"
        />
      </div>

      {/* Stadium full name — solo cuando hay venue, en footer */}
      {venue && !isLive && (
        <footer
          className="mt-5 border-t pt-3 bc-mono"
          style={{
            borderColor: 'var(--bc-border)',
            color: 'var(--bc-fg-subtle)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {venue.stadium} · {venue.city}, {venue.country}
        </footer>
      )}
    </article>
  );
};

export default MatchCardBroadcast;
