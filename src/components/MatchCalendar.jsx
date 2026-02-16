import React, { useState } from 'react';
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { VENUES, GROUP_STAGE_DATES, KNOCKOUT_DATES, getMatchVenue, getMatchDate } from '../data/calendar';
import { TEAMS } from '../data/teams';
import { useI18n } from '../context/I18nContext';

const MatchCalendar = ({ groupMatches, knockoutMatches }) => {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState('timeline'); // timeline | venues
  const [selectedVenue, setSelectedVenue] = useState(null);

  const getTeam = (id) => TEAMS.find(t => t.id === id);

  const allMatches = [
    ...groupMatches.map(m => ({
      ...m,
      stage: 'group',
      date: getMatchDate(m.id),
      venue: getMatchVenue(m.id),
    })),
    ...knockoutMatches.filter(m => m.home && m.away).map((m, i) => ({
      ...m,
      stage: 'knockout',
      date: getMatchDate(m.id, i),
      venue: VENUES[i % VENUES.length],
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  // Group by date
  const byDate = {};
  allMatches.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">
          {t('calendar.title')} <span className="text-[var(--color-primary)]">{t('calendar.titleHighlight')}</span>
        </h2>
        <p className="text-gray-400 mt-2 text-sm md:text-base">{t('calendar.subtitle')}</p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            viewMode === 'timeline' ? 'bg-[var(--color-primary)] text-[var(--color-bg-dark)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Timeline
        </button>
        <button
          onClick={() => setViewMode('venues')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            viewMode === 'venues' ? 'bg-[var(--color-primary)] text-[var(--color-bg-dark)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <MapPin className="w-4 h-4" />
          {t('calendar.venue')}s
        </button>
      </div>

      {viewMode === 'timeline' ? (
        <div className="space-y-6">
          {Object.entries(byDate).slice(0, 20).map(([date, matches]) => (
            <div key={date} className="bg-[var(--color-bg-darker)] rounded-xl border border-white/5 overflow-hidden">
              <div className="bg-gradient-to-r from-[var(--color-bg-dark)] to-[var(--color-bg-darker)] px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-white font-bold">{formatDate(date)}</span>
                  <span className="text-gray-500 text-xs">({matches.length} partidos)</span>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {matches.slice(0, 12).map(m => {
                  const home = getTeam(m.home);
                  const away = getTeam(m.away);
                  return (
                    <div key={m.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs text-gray-500 w-14 flex-shrink-0">{m.id}</span>
                        <span className="text-sm">{home?.flag || '🏳️'}</span>
                        <span className="text-xs text-gray-300 truncate">{home?.name || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 flex-shrink-0">
                        <span className={`text-sm font-bold ${m.finished || m.winner ? 'text-white' : 'text-gray-600'}`}>
                          {m.homeScore ?? '-'}
                        </span>
                        <span className="text-gray-600 text-xs">:</span>
                        <span className={`text-sm font-bold ${m.finished || m.winner ? 'text-white' : 'text-gray-600'}`}>
                          {m.awayScore ?? '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        <span className="text-xs text-gray-300 truncate">{away?.name || 'TBD'}</span>
                        <span className="text-sm">{away?.flag || '🏳️'}</span>
                      </div>
                      <div className="hidden md:flex items-center gap-1 ml-3 flex-shrink-0">
                        <MapPin className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-600 truncate max-w-[100px]">{m.venue?.city}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VENUES.map(venue => (
            <div
              key={venue.id}
              className={`bg-[var(--color-bg-darker)] rounded-xl border overflow-hidden transition-all cursor-pointer ${
                selectedVenue === venue.id ? 'border-[var(--color-primary)]/50 shadow-lg' : 'border-white/5 hover:border-white/20'
              }`}
              onClick={() => setSelectedVenue(selectedVenue === venue.id ? null : venue.id)}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                  <h4 className="text-white font-bold text-sm truncate">{venue.name}</h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{venue.city}, {venue.country}</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-500 text-xs">{venue.capacity.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Knockout Dates Reference */}
      <div className="bg-[var(--color-bg-darker)] rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Fechas Importantes
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {KNOCKOUT_DATES.map(k => (
            <div key={k.round} className="bg-[var(--color-bg-darkest)] rounded-lg px-3 py-2">
              <div className="text-[var(--color-primary)] text-xs font-bold uppercase">{k.round === 'R32' ? 'Dieciseisavos' : k.round === 'R16' ? 'Octavos' : k.round === 'QF' ? 'Cuartos' : k.round === 'SF' ? 'Semifinales' : k.round === '3rdPlace' ? 'Tercer Puesto' : k.round}</div>
              <div className="text-gray-400 text-xs mt-1">{k.dates.map(formatDate).join(' - ')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchCalendar;
