/*
 * useBroadcastTrigger
 *
 * Hook que dispara el <BroadcastOverlay> de tres formas:
 *  1. Auto: cuando stats.champion cambia (campeón recién decidido)
 *  2. Auto: cuando se detecta un upset nuevo en stats.upsets
 *  3. Manual: atajos de teclado G/V/U (fire de la cabina del streamer)
 *
 * Devuelve { overlay, fire, dismiss } para que App.jsx renderice <BroadcastOverlay>
 * cuando overlay !== null.
 *
 * Atajos:
 *   G → goal     (necesita un team activo, usa el último selectedStreamMatch home)
 *   V → champion (usa stats.champion)
 *   U → upset    (usa el último upset de stats.upsets)
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export function useBroadcastTrigger({ stats, teams, currentMatch }) {
  const [overlay, setOverlay] = useState(null);
  const lastChampionRef = useRef(null);
  const lastUpsetCountRef = useRef(0);

  const dismiss = useCallback(() => setOverlay(null), []);

  const fire = useCallback((type, payload = {}) => {
    setOverlay({ type, ...payload, key: Date.now() });
  }, []);

  // Auto-trigger: champion change. setOverlay dentro del effect es intencional —
  // el efecto se suscribe a un cambio de state externo (stats viene del context),
  // no causa cascadas: stats.champion sólo muta cuando el usuario completa la final.
  useEffect(() => {
    if (!stats?.champion) {
      lastChampionRef.current = stats?.champion ?? null;
      return;
    }
    if (stats.champion === lastChampionRef.current) return;
    lastChampionRef.current = stats.champion;
    const team = teams?.find(t => t.id === stats.champion);
    if (team) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ver comentario arriba
      setOverlay({
        type: 'champion',
        team,
        subtitle: 'Campeones Mundiales 2026',
        duration: 5000,
        key: Date.now(),
      });
    }
  }, [stats?.champion, teams]);

  // Auto-trigger: upset reciente. Sólo cuando crece la lista (evita re-disparar al reset).
  useEffect(() => {
    const currentCount = stats?.upsets?.length ?? 0;
    if (currentCount === 0) {
      lastUpsetCountRef.current = 0;
      return;
    }
    if (currentCount <= lastUpsetCountRef.current) return;
    lastUpsetCountRef.current = currentCount;
    const last = stats.upsets[stats.upsets.length - 1];
    if (last?.upset && last?.favorite) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- subscripción a state externo, sin cascada
      setOverlay({
        type: 'upset',
        team: last.upset,
        subtitle: `${last.upset.name} venció a ${last.favorite.name}`,
        duration: 3500,
        key: Date.now(),
      });
    }
  }, [stats?.upsets]);

  // Atajos de teclado G/V/U — sólo cuando NO se está editando un input
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === 'g') {
        e.preventDefault();
        const team = teams?.find(t => t.id === currentMatch?.home);
        if (team) fire('goal', { team, subtitle: '¡Anotó!' , duration: 2500 });
      } else if (key === 'v') {
        e.preventDefault();
        if (stats?.champion) {
          const team = teams?.find(t => t.id === stats.champion);
          if (team) fire('champion', { team, subtitle: 'Campeones Mundiales 2026', duration: 5000 });
        }
      } else if (key === 'u') {
        e.preventDefault();
        const last = stats?.upsets?.[stats.upsets.length - 1];
        if (last?.upset && last?.favorite) {
          fire('upset', {
            team: last.upset,
            subtitle: `${last.upset.name} venció a ${last.favorite.name}`,
            duration: 3500,
          });
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [teams, currentMatch, stats?.champion, stats?.upsets, fire]);

  return { overlay, fire, dismiss };
}
