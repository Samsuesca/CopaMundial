// Compress simulation state into a shareable URL
export function encodeSimulation(state) {
  try {
    const compact = {
      w: state.selectedWinners,
      g: state.groupMatches
        .filter(m => m.finished)
        .map(m => [m.id, m.homeScore, m.awayScore]),
      k: state.knockoutMatches
        .filter(m => m.homeScore !== null && m.awayScore !== null)
        .map(m => [m.id, m.homeScore, m.awayScore, m.penaltyWinner || '']),
    };
    const json = JSON.stringify(compact);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return encoded;
  } catch (e) {
    console.error('Error encoding simulation:', e);
    return null;
  }
}

export function decodeSimulation(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const compact = JSON.parse(json);
    return {
      selectedWinners: compact.w || {},
      groupResults: (compact.g || []).map(([id, hs, as]) => ({ id, homeScore: hs, awayScore: as })),
      knockoutResults: (compact.k || []).map(([id, hs, as, pw]) => ({
        id, homeScore: hs, awayScore: as, penaltyWinner: pw || null,
      })),
    };
  } catch (e) {
    console.error('Error decoding simulation:', e);
    return null;
  }
}

export function generateShareUrl(state) {
  const encoded = encodeSimulation(state);
  if (!encoded) return null;
  return `${window.location.origin}${window.location.pathname}?sim=${encoded}`;
}

export function getSharedSimulation() {
  const params = new URLSearchParams(window.location.search);
  const sim = params.get('sim');
  if (!sim) return null;
  return decodeSimulation(sim);
}
