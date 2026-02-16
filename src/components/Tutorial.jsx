/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Trophy, Users, Swords, BarChart3 } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

const TUTORIAL_KEY = 'wc2026_tutorial_seen';

const Tutorial = ({ onComplete }) => {
  const { t } = useI18n();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '🏆',
      title: t('tutorial.welcome'),
      content: 'Simula el Mundial de la FIFA 2026 con 48 equipos, 12 grupos y una fase eliminatoria completa.',
      highlight: 'playoffs',
    },
    {
      icon: '🗳️',
      IconComp: Users,
      title: t('tutorial.step1'),
      content: '6 plazas están pendientes de playoffs. Selecciona los ganadores de UEFA y las rutas intercontinentales.',
      highlight: 'playoffs',
    },
    {
      icon: '⚽',
      IconComp: Trophy,
      title: t('tutorial.step2'),
      content: 'Ingresa los marcadores de cada partido. Las clasificaciones se calculan automáticamente.',
      highlight: 'groups',
    },
    {
      icon: '🏟️',
      IconComp: Swords,
      title: t('tutorial.step3'),
      content: 'Los ganadores avanzan automáticamente. Si hay empate, selecciona al ganador por penales.',
      highlight: 'knockout',
    },
    {
      icon: '📊',
      IconComp: BarChart3,
      title: t('tutorial.step4'),
      content: 'Exporta como imagen, CSV o JSON. Comparte tu simulación por URL con amigos.',
      highlight: 'stats',
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] animate-in fade-in duration-300">
      <div className="bg-[var(--color-bg-darker)] rounded-2xl p-6 border border-[var(--color-primary)]/30 shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? 'bg-[var(--color-primary)] w-6' : i < step ? 'bg-[var(--color-primary)]/50' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <span className="text-6xl mb-4 block">{currentStep.icon}</span>
          <h3 className="text-xl font-bold text-white mb-3">{currentStep.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{currentStep.content}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { if (step > 0) setStep(step - 1); }}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              step > 0 ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'invisible'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t('tutorial.prev')}
          </button>

          <button
            onClick={() => { onComplete(); }}
            className="text-gray-500 hover:text-white text-xs"
          >
            {t('tutorial.skip')}
          </button>

          <button
            onClick={() => {
              if (step < steps.length - 1) setStep(step + 1);
              else onComplete();
            }}
            className="flex items-center gap-1 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            {step === steps.length - 1 ? t('tutorial.gotIt') : t('tutorial.next')}
            {step < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(() => {
    try {
      return !localStorage.getItem(TUTORIAL_KEY);
    } catch { return false; }
  });

  const completeTutorial = () => {
    setShowTutorial(false);
    try { localStorage.setItem(TUTORIAL_KEY, 'true'); } catch { /* ignore */ }
  };

  return { showTutorial, setShowTutorial, completeTutorial };
}

export default Tutorial;
