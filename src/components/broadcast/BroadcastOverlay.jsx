/*
 * BroadcastOverlay — overlay full-screen para momentos dramáticos del stream.
 *
 * Variantes:
 *  - "goal":    Flash blanco + GOL!! gigante con bounce
 *  - "champion": Trofeo gold + nombre del campeón ascendiendo
 *  - "upset":   Flash rojo + "SORPRESA" + shake
 *
 * Uso:
 *   <BroadcastOverlay type="goal" team={team} duration={2500} onClose={...} />
 *
 * El overlay se auto-dismissa después de `duration` ms.
 */

import React, { useEffect, useState } from 'react';
import { Trophy, Zap, AlertTriangle } from 'lucide-react';

const CONFIG = {
  goal: {
    label: '¡GOL!',
    accent: 'var(--bc-brand)',
    glow: 'var(--bc-brand-glow)',
    icon: Zap,
    flashClass: 'bc-flash-white',
    bgGradient: 'radial-gradient(circle at center, rgba(0,255,133,0.25) 0%, rgba(0,17,42,0.95) 70%)',
    confettiColors: ['#00FF85', '#00CC6A', '#FFFFFF', '#B8FFE0'],
  },
  champion: {
    label: 'CAMPEÓN DEL MUNDO',
    accent: 'var(--bc-gold)',
    glow: 'var(--bc-gold-glow)',
    icon: Trophy,
    flashClass: '',
    bgGradient: 'radial-gradient(circle at center, rgba(255,184,0,0.25) 0%, rgba(0,17,42,0.97) 70%)',
    confettiColors: ['#FFB800', '#FFD451', '#FFFFFF', '#FFE899'],
  },
  upset: {
    label: 'SORPRESA',
    accent: 'var(--bc-red)',
    glow: 'var(--bc-red-glow)',
    icon: AlertTriangle,
    flashClass: '',
    bgGradient: 'radial-gradient(circle at center, rgba(255,46,77,0.25) 0%, rgba(0,17,42,0.95) 70%)',
    confettiColors: ['#FF2E4D', '#FF6680', '#FFFFFF'],
  },
};

const Confetti = ({ colors, count = 80 }) => {
  // Math.random es impuro — generar una sola vez con useState lazy init.
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 600,
      duration: 2200 + Math.random() * 1800,
      color: colors[i % colors.length],
      x: (Math.random() - 0.5) * 200,
      rotate: Math.random() * 360,
    }))
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map(p => (
        <span
          key={p.id}
          className="bc-confetti-piece"
          style={{
            left: `${p.left}%`,
            top: '-12vh',
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
            '--bc-confetti-x': `${p.x}px`,
          }}
        />
      ))}
    </div>
  );
};

const BroadcastOverlay = ({ type = 'goal', team, subtitle, duration = 2500, onClose }) => {
  const config = CONFIG[type] ?? CONFIG.goal;
  const Icon = config.icon;

  useEffect(() => {
    if (!onClose) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: config.bgGradient }}
      role="alert"
      aria-live="assertive"
    >
      {/* Flash blanco para gol — encima del bg, debajo del contenido */}
      {config.flashClass && (
        <div className={`absolute inset-0 ${config.flashClass}`} aria-hidden="true" />
      )}

      <Confetti colors={config.confettiColors} count={type === 'champion' ? 140 : 60} />

      {/* Contenido principal */}
      <div
        className={`relative flex flex-col items-center gap-6 px-8 ${
          type === 'upset' ? 'bc-upset-shake' : 'bc-goal-burst'
        }`}
      >
        {/* Icon */}
        <div
          className="rounded-full p-6"
          style={{
            background: `${config.accent}20`,
            boxShadow: `0 0 60px ${config.glow}`,
          }}
        >
          <Icon
            className={`h-20 w-20 ${type === 'champion' ? 'bc-trophy-raise' : ''}`}
            style={{ color: config.accent }}
            strokeWidth={2.5}
          />
        </div>

        {/* Label gigante */}
        <h1
          className="bc-display text-center"
          style={{
            fontSize: 'clamp(64px, 12vw, 144px)',
            color: config.accent,
            textShadow: `0 0 40px ${config.glow}, 0 4px 12px rgba(0,0,0,0.6)`,
            lineHeight: 0.9,
            letterSpacing: '0.03em',
          }}
        >
          {config.label}
        </h1>

        {/* Team / nombre */}
        {team && (
          <div className="flex items-center gap-4 rounded-md bg-black/40 px-6 py-3 backdrop-blur-sm">
            <span style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}>{team.flag}</span>
            <span
              className="bc-display text-white"
              style={{ fontSize: 'clamp(28px, 5vw, 56px)', letterSpacing: '0.02em' }}
            >
              {team.name}
            </span>
          </div>
        )}

        {subtitle && (
          <p
            className="bc-mono text-center"
            style={{
              fontSize: 'clamp(16px, 2vw, 24px)',
              color: 'var(--bc-fg-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default BroadcastOverlay;
