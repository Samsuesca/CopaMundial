const ACHIEVEMENT_STORAGE_KEY = 'wc2026_achievements';

export const ACHIEVEMENTS = [
  { id: 'first_goal', icon: '⚽', condition: (s) => s.groupMatches.some(m => m.finished) },
  { id: 'group_complete', icon: '✅', condition: (s, standings) => {
    return Object.values(standings).some(g => {
      const groupId = g[0]?.id;
      if (!groupId) return false;
      const matches = s.groupMatches.filter(m => m.group === g[0]?.groupId);
      return matches.length > 0 && matches.every(m => m.finished);
    });
  }},
  { id: 'all_groups', icon: '🏟️', condition: (s) => s.groupMatches.length > 0 && s.groupMatches.every(m => m.finished) },
  { id: 'champion', icon: '🏆', condition: (s) => {
    const final = s.knockoutMatches.find(m => m.id === 'Final');
    return !!final?.winner;
  }},
  { id: 'upset', icon: '😱', condition: (_, __, stats) => stats.upsets?.length > 0 },
  { id: 'simulator', icon: '🤖' },
  { id: 'shared', icon: '🔗' },
  { id: 'exported', icon: '📦' },
];

export function loadUnlockedAchievements() {
  try {
    const saved = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

export function saveUnlockedAchievements(unlocked) {
  try {
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(unlocked));
  } catch { /* ignore */ }
}

export function checkAchievements(state, standings, stats) {
  const unlocked = loadUnlockedAchievements();
  const newUnlocks = [];

  ACHIEVEMENTS.forEach(a => {
    if (!unlocked.includes(a.id) && a.condition) {
      try {
        if (a.condition(state, standings, stats)) {
          newUnlocks.push(a.id);
        }
      } catch { /* ignore */ }
    }
  });

  if (newUnlocks.length > 0) {
    const updated = [...unlocked, ...newUnlocks];
    saveUnlockedAchievements(updated);
    return newUnlocks;
  }
  return [];
}

export function unlockManualAchievement(id) {
  const unlocked = loadUnlockedAchievements();
  if (!unlocked.includes(id)) {
    unlocked.push(id);
    saveUnlockedAchievements(unlocked);
    return true;
  }
  return false;
}
