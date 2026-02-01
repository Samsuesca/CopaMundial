/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { INITIAL_GROUPS } from '../data/groups';
import { TEAMS } from '../data/teams';
import { calculateStandings, generateGroupMatches, generateKnockoutBracket } from '../utils/simulator';

const STORAGE_KEY = 'worldcup2026_simulation';

// Initial State
const initialState = {
  selectedWinners: {},
  groupMatches: [],
  knockoutMatches: [],
  activeTab: 'playoffs',
  simulationName: 'Mi Simulación',
  savedSimulations: [],
  lastSaved: null,
};

// Action Types
const ACTIONS = {
  SET_PLAYOFF_WINNER: 'SET_PLAYOFF_WINNER',
  UPDATE_GROUP_MATCH: 'UPDATE_GROUP_MATCH',
  UPDATE_KNOCKOUT_MATCH: 'UPDATE_KNOCKOUT_MATCH',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  INIT_GROUP_MATCHES: 'INIT_GROUP_MATCHES',
  SET_KNOCKOUT_MATCHES: 'SET_KNOCKOUT_MATCHES',
  LOAD_SIMULATION: 'LOAD_SIMULATION',
  SAVE_SIMULATION: 'SAVE_SIMULATION',
  DELETE_SIMULATION: 'DELETE_SIMULATION',
  RESET_SIMULATION: 'RESET_SIMULATION',
  SET_SIMULATION_NAME: 'SET_SIMULATION_NAME',
  SET_PENALTY_WINNER: 'SET_PENALTY_WINNER',
};

// Reducer
function simulationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PLAYOFF_WINNER:
      return {
        ...state,
        selectedWinners: {
          ...state.selectedWinners,
          [action.payload.pathKey]: action.payload.teamId,
        },
      };

    case ACTIONS.UPDATE_GROUP_MATCH:
      return {
        ...state,
        groupMatches: state.groupMatches.map(m => {
          if (m.id === action.payload.id) {
            const updated = { ...m, [action.payload.field]: action.payload.value };
            updated.finished = updated.homeScore !== null && updated.awayScore !== null;
            return updated;
          }
          return m;
        }),
      };

    case ACTIONS.UPDATE_KNOCKOUT_MATCH:
      return {
        ...state,
        knockoutMatches: state.knockoutMatches.map(m => {
          if (m.id === action.payload.id) {
            const updated = { ...m, [action.payload.field]: action.payload.value };
            // Determine winner
            if (updated.homeScore !== null && updated.awayScore !== null) {
              if (updated.homeScore > updated.awayScore) {
                updated.winner = updated.home;
                updated.penaltyWinner = null;
              } else if (updated.awayScore > updated.homeScore) {
                updated.winner = updated.away;
                updated.penaltyWinner = null;
              } else {
                // Draw - need penalties
                updated.winner = updated.penaltyWinner || null;
              }
            } else {
              updated.winner = null;
              updated.penaltyWinner = null;
            }
            return updated;
          }
          return m;
        }),
      };

    case ACTIONS.SET_PENALTY_WINNER:
      return {
        ...state,
        knockoutMatches: state.knockoutMatches.map(m => {
          if (m.id === action.payload.matchId) {
            return {
              ...m,
              penaltyWinner: action.payload.teamId,
              winner: action.payload.teamId,
            };
          }
          return m;
        }),
      };

    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };

    case ACTIONS.INIT_GROUP_MATCHES:
      return { ...state, groupMatches: action.payload };

    case ACTIONS.SET_KNOCKOUT_MATCHES:
      return { ...state, knockoutMatches: action.payload };

    case ACTIONS.LOAD_SIMULATION:
      return {
        ...state,
        ...action.payload,
        activeTab: state.activeTab,
      };

    case ACTIONS.SAVE_SIMULATION: {
      const newSimulation = {
        id: Date.now(),
        name: state.simulationName,
        data: {
          selectedWinners: state.selectedWinners,
          groupMatches: state.groupMatches,
          knockoutMatches: state.knockoutMatches,
        },
        savedAt: new Date().toISOString(),
      };
      const existingIndex = state.savedSimulations.findIndex(s => s.name === state.simulationName);
      let updatedSimulations;
      if (existingIndex >= 0) {
        updatedSimulations = [...state.savedSimulations];
        updatedSimulations[existingIndex] = newSimulation;
      } else {
        updatedSimulations = [...state.savedSimulations, newSimulation];
      }
      return {
        ...state,
        savedSimulations: updatedSimulations,
        lastSaved: new Date().toISOString(),
      };
    }

    case ACTIONS.DELETE_SIMULATION:
      return {
        ...state,
        savedSimulations: state.savedSimulations.filter(s => s.id !== action.payload),
      };

    case ACTIONS.RESET_SIMULATION:
      return {
        ...initialState,
        savedSimulations: state.savedSimulations,
        simulationName: 'Nueva Simulación',
      };

    case ACTIONS.SET_SIMULATION_NAME:
      return { ...state, simulationName: action.payload };

    default:
      return state;
  }
}

// Context
const SimulationContext = createContext(null);

// Provider
export function SimulationProvider({ children }) {
  // Load initial state from localStorage
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed };
      }
    } catch (e) {
      console.error('Error loading simulation:', e);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(simulationReducer, null, loadInitialState);

  // Resolve active groups with playoff winners
  const activeGroups = useMemo(() => {
    return INITIAL_GROUPS.map(group => ({
      ...group,
      teams: group.teams.map(teamId => {
        if (teamId.startsWith('PLAYOFF_')) {
          const key = teamId.replace('PLAYOFF_', '');
          return state.selectedWinners[key] || teamId;
        }
        return teamId;
      }),
    }));
  }, [state.selectedWinners]);

  // Initialize/update group matches when groups change
  useEffect(() => {
    if (state.groupMatches.length === 0) {
      dispatch({ type: ACTIONS.INIT_GROUP_MATCHES, payload: generateGroupMatches(activeGroups) });
    } else {
      const newMatches = generateGroupMatches(activeGroups);
      const updatedMatches = newMatches.map(nm => {
        const existing = state.groupMatches.find(pm => pm.id === nm.id);
        return existing ? { ...existing, home: nm.home, away: nm.away } : nm;
      });
      dispatch({ type: ACTIONS.INIT_GROUP_MATCHES, payload: updatedMatches });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroups]);

  // Calculate standings
  const standings = useMemo(() => {
    const newStandings = {};
    activeGroups.forEach(group => {
      const matches = state.groupMatches.filter(m => m.group === group.id);
      newStandings[group.id] = calculateStandings(matches, group.teams);
    });
    return newStandings;
  }, [state.groupMatches, activeGroups]);

  // Generate/update knockout bracket
  useEffect(() => {
    const { matches } = generateKnockoutBracket(activeGroups, standings, state.knockoutMatches);
    dispatch({ type: ACTIONS.SET_KNOCKOUT_MATCHES, payload: matches });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standings]);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selectedWinners: state.selectedWinners,
        groupMatches: state.groupMatches,
        knockoutMatches: state.knockoutMatches,
        simulationName: state.simulationName,
        savedSimulations: state.savedSimulations,
        lastSaved: state.lastSaved,
      }));
    } catch (e) {
      console.error('Error saving simulation:', e);
    }
  }, [state]);

  // Actions
  const actions = useMemo(() => ({
    setPlayoffWinner: (pathKey, teamId) =>
      dispatch({ type: ACTIONS.SET_PLAYOFF_WINNER, payload: { pathKey, teamId } }),

    updateGroupMatch: (id, field, value) =>
      dispatch({
        type: ACTIONS.UPDATE_GROUP_MATCH,
        payload: { id, field, value: value === '' ? null : parseInt(value) }
      }),

    updateKnockoutMatch: (id, field, value) => {
      dispatch({
        type: ACTIONS.UPDATE_KNOCKOUT_MATCH,
        payload: { id, field, value: value === '' ? null : parseInt(value) }
      });
      // Re-run generator to propagate winners
      setTimeout(() => {
        const { matches } = generateKnockoutBracket(activeGroups, standings, state.knockoutMatches);
        dispatch({ type: ACTIONS.SET_KNOCKOUT_MATCHES, payload: matches });
      }, 0);
    },

    setPenaltyWinner: (matchId, teamId) => {
      dispatch({ type: ACTIONS.SET_PENALTY_WINNER, payload: { matchId, teamId } });
      setTimeout(() => {
        const { matches } = generateKnockoutBracket(activeGroups, standings, state.knockoutMatches);
        dispatch({ type: ACTIONS.SET_KNOCKOUT_MATCHES, payload: matches });
      }, 0);
    },

    setActiveTab: (tab) => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab }),

    saveSimulation: () => dispatch({ type: ACTIONS.SAVE_SIMULATION }),

    loadSimulation: (simulation) => dispatch({
      type: ACTIONS.LOAD_SIMULATION,
      payload: simulation.data
    }),

    deleteSimulation: (id) => dispatch({ type: ACTIONS.DELETE_SIMULATION, payload: id }),

    resetSimulation: () => dispatch({ type: ACTIONS.RESET_SIMULATION }),

    setSimulationName: (name) => dispatch({ type: ACTIONS.SET_SIMULATION_NAME, payload: name }),
  }), [activeGroups, standings, state.knockoutMatches]);

  // Statistics
  const stats = useMemo(() => {
    const totalGroupMatches = state.groupMatches.length;
    const completedGroupMatches = state.groupMatches.filter(m => m.finished).length;
    const totalKnockoutMatches = state.knockoutMatches.length;
    const completedKnockoutMatches = state.knockoutMatches.filter(m => m.winner).length;

    const totalGoals = state.groupMatches.reduce((acc, m) => {
      if (m.finished) return acc + (m.homeScore || 0) + (m.awayScore || 0);
      return acc;
    }, 0) + state.knockoutMatches.reduce((acc, m) => {
      if (m.homeScore !== null && m.awayScore !== null) {
        return acc + m.homeScore + m.awayScore;
      }
      return acc;
    }, 0);

    // Top scorers by team (goals for)
    const teamGoals = {};
    state.groupMatches.forEach(m => {
      if (m.finished) {
        teamGoals[m.home] = (teamGoals[m.home] || 0) + (m.homeScore || 0);
        teamGoals[m.away] = (teamGoals[m.away] || 0) + (m.awayScore || 0);
      }
    });
    state.knockoutMatches.forEach(m => {
      if (m.homeScore !== null && m.awayScore !== null) {
        if (m.home) teamGoals[m.home] = (teamGoals[m.home] || 0) + (m.homeScore || 0);
        if (m.away) teamGoals[m.away] = (teamGoals[m.away] || 0) + (m.awayScore || 0);
      }
    });

    const topScoringTeams = Object.entries(teamGoals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([teamId, goals]) => ({ teamId, goals }));

    // Champion
    const finalMatch = state.knockoutMatches.find(m => m.id === 'Final');
    const champion = finalMatch?.winner || null;

    // Third place winner
    const thirdPlaceMatch = state.knockoutMatches.find(m => m.id === '3rdPlace');
    const thirdPlace = thirdPlaceMatch?.winner || null;

    // Runner-up
    const runnerUp = finalMatch?.winner
      ? (finalMatch.winner === finalMatch.home ? finalMatch.away : finalMatch.home)
      : null;

    // Fourth place
    const fourthPlace = thirdPlaceMatch?.winner
      ? (thirdPlaceMatch.winner === thirdPlaceMatch.home ? thirdPlaceMatch.away : thirdPlaceMatch.home)
      : null;

    // Upsets (lower ranked team beats higher ranked team)
    const upsets = [];
    [...state.groupMatches, ...state.knockoutMatches].forEach(m => {
      if ((m.finished || m.winner) && m.homeScore !== null && m.awayScore !== null) {
        const homeTeam = TEAMS.find(t => t.id === m.home);
        const awayTeam = TEAMS.find(t => t.id === m.away);
        if (homeTeam && awayTeam) {
          if (m.homeScore > m.awayScore && homeTeam.rating > awayTeam.rating + 20) {
            upsets.push({ match: m, upset: homeTeam, favorite: awayTeam });
          } else if (m.awayScore > m.homeScore && awayTeam.rating > homeTeam.rating + 20) {
            upsets.push({ match: m, upset: awayTeam, favorite: homeTeam });
          }
        }
      }
    });

    return {
      totalGroupMatches,
      completedGroupMatches,
      groupProgress: totalGroupMatches > 0 ? Math.round((completedGroupMatches / totalGroupMatches) * 100) : 0,
      totalKnockoutMatches,
      completedKnockoutMatches,
      knockoutProgress: totalKnockoutMatches > 0 ? Math.round((completedKnockoutMatches / totalKnockoutMatches) * 100) : 0,
      totalGoals,
      avgGoalsPerMatch: (completedGroupMatches + completedKnockoutMatches) > 0
        ? (totalGoals / (completedGroupMatches + completedKnockoutMatches)).toFixed(2)
        : 0,
      topScoringTeams,
      champion,
      runnerUp,
      thirdPlace,
      fourthPlace,
      upsets,
    };
  }, [state.groupMatches, state.knockoutMatches]);

  const value = {
    state,
    actions,
    activeGroups,
    standings,
    stats,
    teams: TEAMS,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

// Hook
export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
}

export default SimulationContext;
