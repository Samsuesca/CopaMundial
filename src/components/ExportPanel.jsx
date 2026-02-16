import React, { useState } from 'react';
import { Download, FileText, Table, Image, X } from 'lucide-react';
import { exportAsCSV, exportAsText, downloadFile } from '../utils/exportResults';
import { unlockManualAchievement } from '../utils/achievements';
import { useI18n } from '../context/I18nContext';

const ExportPanel = ({ state, standings, stats, onClose }) => {
  const { t } = useI18n();
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = () => {
    const data = {
      selectedWinners: state.selectedWinners,
      groupMatches: state.groupMatches,
      knockoutMatches: state.knockoutMatches,
      simulationName: state.simulationName,
      exportedAt: new Date().toISOString(),
    };
    downloadFile(
      JSON.stringify(data, null, 2),
      `worldcup2026_${state.simulationName.replace(/\s+/g, '_')}.json`,
      'application/json'
    );
    unlockManualAchievement('exported');
  };

  const handleExportCSV = () => {
    const csv = exportAsCSV(state, standings);
    downloadFile(csv, `worldcup2026_${state.simulationName.replace(/\s+/g, '_')}.csv`, 'text/csv');
    unlockManualAchievement('exported');
  };

  const handleExportText = () => {
    const text = exportAsText(state, standings, stats);
    downloadFile(text, `worldcup2026_${state.simulationName.replace(/\s+/g, '_')}.txt`, 'text/plain');
    unlockManualAchievement('exported');
  };

  const handleExportImage = async () => {
    setExporting(true);
    try {
      const text = exportAsText(state, standings, stats);
      // Create a canvas for image generation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const lines = text.split('\n');
      const lineHeight = 20;
      const padding = 40;
      canvas.width = 600;
      canvas.height = lines.length * lineHeight + padding * 2;

      // Background
      ctx.fillStyle = '#00204C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text
      ctx.font = '14px monospace';
      ctx.fillStyle = '#FFFFFF';
      lines.forEach((line, i) => {
        ctx.fillText(line, padding, padding + i * lineHeight);
      });

      // Accent line
      ctx.fillStyle = '#00FF85';
      ctx.fillRect(0, 0, canvas.width, 3);
      ctx.fillRect(0, canvas.height - 3, canvas.width, 3);

      // Download
      const link = document.createElement('a');
      link.download = `worldcup2026_${state.simulationName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      unlockManualAchievement('exported');
    } catch (e) {
      console.error('Error exporting image:', e);
    }
    setExporting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/10 shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-white">{t('export.title')}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExportImage}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-4 bg-[var(--color-bg-darkest)] rounded-lg border border-white/10 hover:border-[var(--color-primary)]/50 hover:bg-white/5 transition-all"
          >
            <Image className="w-6 h-6 text-purple-400" />
            <div className="text-left">
              <div className="text-white font-medium">{t('export.asPNG')}</div>
              <div className="text-gray-500 text-xs">Imagen PNG con los resultados</div>
            </div>
          </button>

          <button
            onClick={handleExportCSV}
            className="w-full flex items-center gap-3 p-4 bg-[var(--color-bg-darkest)] rounded-lg border border-white/10 hover:border-[var(--color-primary)]/50 hover:bg-white/5 transition-all"
          >
            <Table className="w-6 h-6 text-green-400" />
            <div className="text-left">
              <div className="text-white font-medium">{t('export.asCSV')}</div>
              <div className="text-gray-500 text-xs">Archivo CSV para Excel/Sheets</div>
            </div>
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full flex items-center gap-3 p-4 bg-[var(--color-bg-darkest)] rounded-lg border border-white/10 hover:border-[var(--color-primary)]/50 hover:bg-white/5 transition-all"
          >
            <FileText className="w-6 h-6 text-blue-400" />
            <div className="text-left">
              <div className="text-white font-medium">{t('export.asJSON')}</div>
              <div className="text-gray-500 text-xs">Datos completos para importar después</div>
            </div>
          </button>

          <button
            onClick={handleExportText}
            className="w-full flex items-center gap-3 p-4 bg-[var(--color-bg-darkest)] rounded-lg border border-white/10 hover:border-[var(--color-primary)]/50 hover:bg-white/5 transition-all"
          >
            <FileText className="w-6 h-6 text-yellow-400" />
            <div className="text-left">
              <div className="text-white font-medium">Como Texto</div>
              <div className="text-gray-500 text-xs">Resumen en texto plano</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
