import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Lock,
  Sparkles,
  Shuffle,
  ListOrdered,
} from 'lucide-react';
import {
  DEFAULT_MANTRAS,
  getStoredMantras,
  saveStoredMantras,
  getMantraMode,
  saveMantraMode,
  relockGate,
} from '../utils/mantras';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRelockScreen: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onRelockScreen,
}) => {
  const [mantras, setMantras] = useState<string[]>(getStoredMantras);
  const [mode, setMode] = useState<'random' | 'sequential'>(getMantraMode);
  const [newMantra, setNewMantra] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMantra.trim()) return;
    const updated = [...mantras, newMantra.trim()];
    setMantras(updated);
    saveStoredMantras(updated);
    setNewMantra('');
  };

  const handleDelete = (index: number) => {
    if (mantras.length <= 1) {
      alert('You must keep at least one commitment mantra.');
      return;
    }
    const updated = mantras.filter((_, i) => i !== index);
    setMantras(updated);
    saveStoredMantras(updated);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(mantras[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (!editingText.trim()) return;
    const updated = [...mantras];
    updated[index] = editingText.trim();
    setMantras(updated);
    saveStoredMantras(updated);
    setEditingIndex(null);
  };

  const handleModeChange = (newMode: 'random' | 'sequential') => {
    setMode(newMode);
    saveMantraMode(newMode);
  };

  const handleResetDefaults = () => {
    setMantras(DEFAULT_MANTRAS);
    saveStoredMantras(DEFAULT_MANTRAS);
  };

  const handleTestLock = () => {
    relockGate();
    onClose();
    onRelockScreen();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Cockpit Settings & Focus Gatekeeper
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Commitment Mantras & Typing Gate
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize the sentences you must type every morning to unlock your 21-day dashboard.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* Option: Selection Mode */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Daily Selection Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleModeChange('random')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  mode === 'random'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shuffle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold leading-none mb-1">Randomize Daily</p>
                  <p className="text-[10px] text-slate-500 leading-none">Fresh seed every day</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('sequential')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  mode === 'sequential'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListOrdered className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold leading-none mb-1">Cycle Sequentially</p>
                  <p className="text-[10px] text-slate-500 leading-none">Next sentence each day</p>
                </div>
              </button>
            </div>
          </div>

          {/* Add New Mantra */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Add New Commitment Sentence
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMantra}
                onChange={(e) => setNewMantra(e.target.value)}
                placeholder="e.g. Focus on the process, not the outcome."
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Mantras List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Current Mantras ({mantras.length})
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="space-y-2">
              {mantras.map((mantraText, index) => {
                const isEditing = editingIndex === index;

                return (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    {isEditing ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 bg-slate-900 border border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(index)}
                          className="p-2 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <span className="text-xs font-mono font-bold text-emerald-400 flex-shrink-0 mt-0.5">
                            {index + 1}.
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed break-words">
                            "{mantraText}"
                          </p>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(index)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit mantra"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete mantra"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestLock}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Screen Now (Test Gate)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
