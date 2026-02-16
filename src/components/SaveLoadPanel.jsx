import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Save, FolderOpen, Trash2, RotateCcw, Download, Upload, Check, X, ChevronDown, ChevronUp, Share2, FileDown, GitCompare } from 'lucide-react';

const SaveLoadPanel = ({ onShowShare, onShowExport, onShowCompare }) => {
  const { state, actions } = useSimulation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    actions.saveSimulation();
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  const handleReset = () => {
    actions.resetSimulation();
    setShowResetConfirm(false);
  };

  const handleExport = () => {
    const data = {
      selectedWinners: state.selectedWinners,
      groupMatches: state.groupMatches,
      knockoutMatches: state.knockoutMatches,
      simulationName: state.simulationName,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worldcup2026_${state.simulationName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        actions.loadSimulation({ data });
      } catch (err) {
        console.error('Error importing simulation:', err);
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="mb-6">
      {/* Collapsed Bar */}
      <div
        className="bg-[#001533] rounded-xl border border-white/5 overflow-hidden"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Save className="w-4 h-4 text-[#00FF85]" />
            <span className="text-sm font-medium text-gray-300">
              {state.simulationName}
            </span>
            {state.lastSaved && (
              <span className="text-xs text-gray-500">
                (Last saved: {new Date(state.lastSaved).toLocaleTimeString()})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showSaveConfirm && (
              <span className="text-xs text-[#00FF85] flex items-center gap-1 animate-in fade-in">
                <Check className="w-3 h-3" /> Saved!
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Simulation Name */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">
                Simulation Name
              </label>
              <input
                type="text"
                value={state.simulationName}
                onChange={(e) => actions.setSimulationName(e.target.value)}
                className="w-full bg-[#000F24] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#00FF85] focus:outline-none transition-colors"
                placeholder="My Simulation"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#00FF85] text-[#00204C] rounded-lg text-sm font-bold hover:bg-[#00CC6A] transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-[#00204C] text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-[#00204C] text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={onShowShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>

              <button
                onClick={onShowExport}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Exportar
              </button>

              {state.savedSimulations.length >= 2 && (
                <button
                  onClick={onShowCompare}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-lg text-sm font-medium hover:bg-teal-500/20 transition-colors"
                >
                  <GitCompare className="w-4 h-4" />
                  Comparar
                </button>
              )}

              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Reset Confirmation */}
            {showResetConfirm && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 animate-in fade-in">
                <p className="text-red-400 text-sm mb-3">
                  Are you sure you want to reset? This will clear all match results and playoff selections.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Saved Simulations */}
            {state.savedSimulations.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Saved Simulations
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {state.savedSimulations.map(sim => (
                    <div
                      key={sim.id}
                      className="flex items-center justify-between bg-[#000F24] rounded-lg p-3 group hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium truncate">{sim.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(sim.savedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <button
                          onClick={() => actions.loadSimulation(sim)}
                          className="p-2 text-[#00FF85] hover:bg-[#00FF85]/10 rounded-lg transition-colors"
                          title="Load simulation"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => actions.deleteSimulation(sim.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete simulation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveLoadPanel;
