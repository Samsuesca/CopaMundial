import React, { useEffect, useState } from 'react';

// Helper to generate random particles - called once per mount
const generateParticles = (count) => {
  const colors = ['#00FF85', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 8 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));
};

const Confetti = ({ count = 100, duration = 4000, onComplete }) => {
  const [visible, setVisible] = useState(true);
  // Generate particles once - this is intentionally impure for visual effects
  const [particles] = useState(() => generateParticles(count));

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const GoalExplosion = ({ team, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="relative animate-in zoom-in-50 duration-300">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#00FF85] blur-3xl opacity-30 animate-pulse" />

        {/* Main text */}
        <div className="relative text-center">
          <div className="text-[120px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#00FF85] to-[#00CC6A] animate-pulse leading-none">
            GOL!
          </div>
          {team && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-6xl">{team.flag}</span>
              <span className="text-4xl font-bold text-white">{team.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChampionCelebration = ({ team, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
      <Confetti count={200} duration={6000} />
      <div className="text-center animate-in zoom-in-50 duration-500">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mb-4">
          CAMPEON DEL MUNDO!
        </div>
        {team && (
          <div className="flex items-center justify-center gap-6">
            <span className="text-8xl">{team.flag}</span>
            <span className="text-5xl font-bold text-[#00FF85]">{team.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const UpsetAlert = ({ winner, loser, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-red-500/90 backdrop-blur-sm rounded-2xl p-8 border-4 border-yellow-400 animate-in zoom-in-95 shake-animation">
        <div className="text-center">
          <div className="text-yellow-400 text-6xl font-black mb-4 animate-pulse">
            SORPRESA!
          </div>
          <div className="flex items-center justify-center gap-4 text-white">
            <div className="text-center">
              <span className="text-5xl">{winner?.flag}</span>
              <div className="font-bold mt-2">{winner?.name}</div>
              <div className="text-xs opacity-70">Rank #{winner?.rating}</div>
            </div>
            <div className="text-3xl font-bold">VENCE A</div>
            <div className="text-center opacity-60">
              <span className="text-5xl">{loser?.flag}</span>
              <div className="font-bold mt-2">{loser?.name}</div>
              <div className="text-xs opacity-70">Rank #{loser?.rating}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Confetti, GoalExplosion, ChampionCelebration, UpsetAlert };
