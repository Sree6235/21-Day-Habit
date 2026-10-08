import React, { useState } from 'react';
import { X, Target, Clock, Calendar, ArrowRight, Sparkles, BookOpen, Droplets, Apple, Footprints, Zap } from 'lucide-react';
import { PRESET_HABITS } from '../utils/milestones';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, cue: string, startDate?: string, category?: string, iconName?: string) => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [cue, setCue] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [category, setCategory] = useState('Personal');
  const [iconName, setIconName] = useState('Target');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a habit name to commit to.');
      return;
    }
    setError('');
    onCreate(
      title.trim(),
      cue.trim() || 'Every day at my designated cue',
      startDate,
      category,
      iconName
    );
    // Reset fields
    setTitle('');
    setCue('');
    setCategory('Personal');
    setIconName('Target');
    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESET_HABITS[0]) => {
    setTitle(preset.title);
    setCue(preset.cue);
    setCategory(preset.category);
    setIconName(preset.iconName);
    setError('');
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'Apple': return <Apple className="w-4 h-4 text-emerald-400" />;
      case 'Footprints': return <Footprints className="w-4 h-4 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-violet-400" />;
      default: return <Target className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            New Concurrent Habit
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Launch Another 21-Day Challenge
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build multiple positive rituals in tandem. Tracked independently in local storage.
          </p>
        </div>

        {/* Preset Chips */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Quick Templates (Click to fill)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_HABITS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
              >
                <div className="p-1 rounded-lg bg-slate-900 group-hover:scale-110 transition-transform">
                  {getPresetIcon(preset.iconName)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-300">
                    {preset.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{preset.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Habit Name</span>
              <span className="text-[10px] text-slate-500">What is the daily habit?</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 20 pages, Pushups, No phone in bed"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                autoFocus
              />
              <div className="absolute right-3 top-3 text-slate-600">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Cue */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Trigger / Time Cue</span>
              <span className="text-[10px] text-slate-500">When / where will it happen?</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cue}
                onChange={(e) => setCue(e.target.value)}
                placeholder="e.g. At 8:00 AM right after making coffee"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <div className="absolute right-3 top-3 text-slate-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Start Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
                />
                <div className="absolute right-3 top-2.5 text-slate-600 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Personal">Personal</option>
                <option value="Health">Health & Fitness</option>
                <option value="Mindset">Mindset & Reading</option>
                <option value="Discipline">Discipline</option>
                <option value="Focus">Work & Focus</option>
                <option value="Wellness">Wellness</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Start This 21 Days</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
