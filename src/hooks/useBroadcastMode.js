/*
 * useBroadcastMode — toggle global para activar el "Modo Broadcast" del simulador.
 *
 * Cuando está ON, agrega `data-broadcast="true"` al <html>. Los selectores CSS
 * en src/styles/broadcast.css se enganchan a ese atributo para escalar la
 * tipografía, los inputs de score y los nombres de equipos sin tocar el
 * markup de los componentes existentes (MatchInput, BracketMatch).
 *
 * Persiste en localStorage bajo `wc2026_broadcast_mode`.
 */

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'wc2026_broadcast_mode';

const readInitial = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export function useBroadcastMode() {
  const [enabled, setEnabled] = useState(readInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.setAttribute('data-broadcast', 'true');
    } else {
      root.removeAttribute('data-broadcast');
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      /* ignore quota errors */
    }
  }, [enabled]);

  const toggle = useCallback(() => setEnabled(v => !v), []);

  return { enabled, toggle, setEnabled };
}
