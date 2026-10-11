import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  BookOpen,
  Droplets,
  Apple,
  Footprints,
  Zap,
  Shield,
  HeartHandshake,
  Lightbulb,
} from 'lucide-react';
import { PRESET_HABITS } from '../utils/milestones';
import type { HabitType, PresetHabit } from '../types/challenge';
import { getTodayString } from '../utils/calendarDates';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    title: string,
    cue: string,
    startDate?: string,
    category?: string,
    iconName?: string,
    habitType?: HabitType,
    urgeReplacementPlan?: string
  ) => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [habitType, setHabitType] = useState<HabitType>('build');
  const [title, setTitle] = useState('');
  const [cue, setCue] = useState('');
  const [urgeReplacementPlan, setUrgeReplacementPlan] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [category, setCategory] = useState('Personal');
  const [iconName, setIconName] = useState('Target');
  const [error, setError] = useState('');

  // Always sync start date to today's local client date whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStartDate(getTodayString());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a habit name to commit to.');
      return;
    }
    setError('');
    const effectiveStartDate = startDate && startDate.trim() ? startDate.trim() : getTodayString();
    onCreate(
      title.trim(),
      cue.trim() || (habitType === 'quit' ? 'When urge or trigger strikes' : 'Every day at my designated time'),
      effectiveStartDate,
      category,
      iconName,
      habitType,
      habitType === 'quit' ? urgeReplacementPlan.trim() : undefined
    );
    // Reset fields
    setTitle('');
    setCue('');
    setUrgeReplacementPlan('');
    setCategory('Personal');
    setIconName('Target');
    setStartDate(getTodayString());
    onClose();
  };

  const handleSelectPreset = (preset: PresetHabit) => {
    setHabitType(preset.habitType || 'build');
    setTitle(preset.title);
    setCue(preset.cue);
    setUrgeReplacementPlan(preset.urgeReplacementPlan || '');
    setCategory(preset.category);
    setIconName(preset.iconName);
    setStartDate(getTodayString());
    setError('');
  };

  const filteredPresets = PRESET_HABITS.filter(
    (p) => (p.habitType || 'build') === habitType
  );

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'Apple': return <Apple className="w-4 h-4 text-emerald-400" />;
      case 'Footprints': return <Footprints className="w-4 h-4 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-violet-400" />;
      case 'Shield': return <Shield className="w-4 h-4 text-indigo-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-amber-400" />;
      default: return habitType === 'quit' ? <Shield className="w-4 h-4 text-indigo-400" /> : <Target className="w-4 h-4 text-emerald-400" />;
    }
  };

  const isQuit = habitType === 'quit';

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
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
              isQuit
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isQuit ? <Shield className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isQuit ? 'Harm Reduction / Clean Streak' : 'Positive Habit Creation'}
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Launch Another 21-Day Challenge
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose whether you are actively building a routine or breaking a bad habit.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setHabitType('build');
              if (iconName === 'Shield') setIconName('Target');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              !isQuit
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>🟢 Build Habit</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setHabitType('quit');
              setIconName('Shield');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
              isQuit
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>🛡️ Quit / Break Habit</span>
          </button>
        </div>

        {/* Preset Chips */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
            {isQuit ? 'Harm Reduction Presets (Click to autofill)' : 'Build Routine Presets (Click to autofill)'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {filteredPresets.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:bg-slate-800/80 transition-all text-left group cursor-pointer ${
                  isQuit ? 'hover:border-indigo-500/40' : 'hover:border-emerald-500/40'
                }`}
              >
                <div className="p-1 rounded-lg bg-slate-900 group-hover:scale-110 transition-transform">
                  {getPresetIcon(preset.iconName)}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold text-slate-200 truncate ${
                      isQuit ? 'group-hover:text-indigo-300' : 'group-hover:text-emerald-300'
                    }`}
                  >
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
              <span>{isQuit ? 'Habit to Break / Abstain From' : 'Habit Name'}</span>
              <span className="text-[10px] text-slate-500">
                {isQuit ? 'e.g. Zero sugar, No alcohol, No vaping' : 'e.g. Read 20 pages, Cold shower'}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isQuit ? 'e.g. Zero refined sugar, No late-night doomscrolling' : 'e.g. Read 20 pages, Morning stretch'}
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                  isQuit
                    ? 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
                autoFocus
              />
              <div className="absolute right-3 top-3 text-slate-600">
                {isQuit ? <Shield className="w-5 h-5" /> : <Target className="w-5 h-5" />}
              </div>
            </div>
          </div>

          {/* Cue / Trigger */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{isQuit ? 'Urge Trigger Cue' : 'Trigger / Time Cue'}</span>
              <span className="text-[10px] text-slate-500">
                {isQuit ? 'When does the craving hit?' : 'When / where will it happen?'}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cue}
                onChange={(e) => setCue(e.target.value)}
                placeholder={isQuit ? 'e.g. After 2:00 PM afternoon slump' : 'e.g. At 8:00 AM right after making coffee'}
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                  isQuit
                    ? 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
              />
              <div className="absolute right-3 top-3 text-slate-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Mode B Only: Urge Replacement Plan */}
          {isQuit && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
              <label className="block text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                <span>Urge Replacement Plan (Crucial for Harm Reduction)</span>
              </label>
              <p className="text-[11px] text-slate-400">
                What healthy substitute will you do when cravings spike?
              </p>
              <input
                type="text"
                value={urgeReplacementPlan}
                onChange={(e) => setUrgeReplacementPlan(e.target.value)}
                placeholder="e.g. Drink chamomile tea, do 10 deep breaths, chew sugar-free mint"
                className="w-full bg-slate-950 border border-indigo-500/40 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          )}

          {/* Start Date & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Start Date
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isQuit
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  Starts today (Day 1)
                </span>
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none [color-scheme:dark] ${
                    isQuit ? 'focus:border-indigo-500' : 'focus:border-emerald-500'
                  }`}
                />
                <div className="absolute right-3 top-2.5 text-slate-600 pointer-events-none">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Starts today (Day 1) • Dynamic 21-day continuous horizon
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none ${
                  isQuit ? 'focus:border-indigo-500' : 'focus:border-emerald-500'
                }`}
              >
                <option value="Personal">Personal</option>
                <option value="Health">Health & Nutrition</option>
                <option value="Mindset">Mindset & Reading</option>
                <option value="Discipline">Discipline & Abstinence</option>
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                isQuit
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <span>{isQuit ? 'Start Harm Reduction Defense' : 'Start This 21 Days'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
