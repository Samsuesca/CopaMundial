import React, { useState } from 'react';
import { Share2, Copy, Check, Link, X } from 'lucide-react';
import { generateShareUrl } from '../utils/shareUrl';
import { unlockManualAchievement } from '../utils/achievements';
import { useI18n } from '../context/I18nContext';

const SharePanel = ({ state, onClose }) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const url = generateShareUrl(state);

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      unlockManualAchievement('shared');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareNative = async () => {
    if (navigator.share && url) {
      try {
        await navigator.share({
          title: 'World Cup 2026 Simulator',
          text: `Check out my World Cup 2026 simulation: ${state.simulationName}`,
          url,
        });
        unlockManualAchievement('shared');
      } catch { /* user cancelled */ }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/10 shadow-2xl max-w-lg w-full mx-4 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-white">{t('share.title')}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          Comparte tu simulación con amigos. El enlace contiene todos tus resultados.
        </p>

        {url ? (
          <>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-[var(--color-bg-darkest)] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 truncate"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-bg-dark)] rounded-lg font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? t('share.copied') : t('share.copyLink')}
              </button>
            </div>

            {navigator.share && (
              <button
                onClick={handleShareNative}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg font-bold hover:bg-blue-500/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartir via...
              </button>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=Mi%20simulación%20del%20Mundial%202026&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-sky-500/20 text-sky-400 rounded-lg text-sm hover:bg-sky-500/30 transition-colors"
              >
                Twitter/X
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Mi simulación del Mundial 2026: ${url}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Mi simulación del Mundial 2026')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-400/20 text-blue-300 rounded-lg text-sm hover:bg-blue-400/30 transition-colors"
              >
                Telegram
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Link className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay datos para compartir aún</p>
            <p className="text-sm">Ingresa algunos resultados primero</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePanel;
