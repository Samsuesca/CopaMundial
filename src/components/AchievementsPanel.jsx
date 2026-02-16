/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Award, X, Lock } from 'lucide-react';
import { ACHIEVEMENTS, loadUnlockedAchievements, checkAchievements } from '../utils/achievements';
import { useI18n } from '../context/I18nContext';

const AchievementToast = ({ achievement, onClose }) => {
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const a = ACHIEVEMENTS.find(a => a.id === achievement);
  if (!a) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-gradient-to-r from-yellow-600/90 to-amber-600/90 backdrop-blur-sm rounded-xl px-5 py-3 border border-yellow-400/30 shadow-2xl flex items-center gap-3">
        <span className="text-3xl">{a.icon}</span>
        <div>
          <div className="text-white font-bold text-sm">{t(`achievements.${a.id}`)}</div>
          <div className="text-yellow-200/70 text-xs">{t(`achievements.${a.id}Desc`)}</div>
        </div>
      </div>
    </div>
  );
};

const AchievementsModal = ({ onClose }) => {
  const { t } = useI18n();
  const unlocked = loadUnlockedAchievements();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/10 shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">{t('achievements.title')}</h3>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
              {unlocked.length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {ACHIEVEMENTS.map(a => {
            const isUnlocked = unlocked.includes(a.id);
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isUnlocked
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-white/5 border-white/5 opacity-60'
                }`}
              >
                <span className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>{a.icon}</span>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {t(`achievements.${a.id}`)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t(`achievements.${a.id}Desc`)}
                  </div>
                </div>
                {!isUnlocked && <Lock className="w-4 h-4 text-gray-500" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export function useAchievements(state, standings, stats) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const newUnlocks = checkAchievements(state, standings, stats);
    if (newUnlocks.length > 0) {
      setToast(newUnlocks[0]);
    }
  }, [state, standings, stats]);

  return { toast, clearToast: () => setToast(null) };
}

export { AchievementToast, AchievementsModal };
