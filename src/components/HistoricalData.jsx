import React from 'react';
import { History, Trophy, Medal } from 'lucide-react';
import { HISTORICAL_WINNERS, COUNTRY_TITLES } from '../data/historical';

const HistoricalData = () => {
  return (
    <div className="bg-[var(--color-bg-darker)] rounded-xl p-6 border border-white/5">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <History className="w-5 h-5 text-[var(--color-primary)]" />
        Historial de Copas del Mundo
      </h3>

      {/* Titles by country */}
      <div className="mb-6">
        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-bold">Títulos por País</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(COUNTRY_TITLES).sort(([,a], [,b]) => b.count - a.count).map(([country, data]) => (
            <div key={country} className="bg-[var(--color-bg-darkest)] rounded-lg p-3 text-center">
              <div className="text-2xl font-black text-[var(--color-primary)]">{data.count}</div>
              <div className="text-white text-sm font-medium mt-1">{country}</div>
              <div className="text-gray-500 text-[10px] mt-1">{data.years.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-bold">Todos los Campeones</h4>
      <div className="max-h-64 overflow-y-auto space-y-1.5">
        {[...HISTORICAL_WINNERS].reverse().map(wc => (
          <div key={wc.year} className="flex items-center justify-between bg-[var(--color-bg-darkest)] rounded-lg px-3 py-2 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[var(--color-primary)] font-bold text-sm w-10">{wc.year}</span>
              <span className="text-lg">{wc.flag}</span>
              <span className="text-white text-sm font-medium">{wc.winner}</span>
            </div>
            <div className="text-gray-500 text-xs hidden sm:block">{wc.host}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalData;
