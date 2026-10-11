import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Target,
  Clock,
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

interface SetupScreenProps {
  onStart: (
    title: string,
    cue: string,
    startDate?: string,
    category?: string,
    iconName?: string,
    habitType?: HabitType,
    urgeReplacementPlan?: string
  ) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [habitType, setHabitType] = useState<HabitType>('build');
  const [title, setTitle] = useState('');
  const [cue, setCue] = useState('');
  const [urgeReplacementPlan, setUrgeReplacementPlan] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [category, setCategory] = useState('Personal');
  const [iconName, setIconName] = useState('Target');
  const [error, setError] = useState('');

  const isQuit = habitType === 'quit';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a habit name to commit to.');
      return;
    }
    setError('');
    const effectiveStartDate = startDate && startDate.trim() ? startDate.trim() : getTodayString();
    onStart(
      title.trim(),
      cue.trim() || (isQuit ? 'When cravings or urge strikes' : 'Every day at my designated time'),
      effectiveStartDate,
      category,
      iconName,
      habitType,
      isQuit ? urgeReplacementPlan.trim() : undefined
    );
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
      default: return isQuit ? <Shield className="w-4 h-4 text-indigo-400" /> : <Target className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isQuit ? 'bg-indigo-500/10' : 'bg-emerald-500/10'
        }`}
      />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        {/* Brand & Badge */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide uppercase mb-3 ${
              isQuit
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isQuit ? 'bg-indigo-400' : 'bg-emerald-400'
              }`}
            />
            21-Day Habit Transformation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Commit to{' '}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isQuit
                  ? 'from-indigo-400 via-blue-300 to-indigo-200'
                  : 'from-emerald-400 via-teal-300 to-indigo-400'
              }`}
            >
              21 Days
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
            {isQuit
              ? 'Overcome urges, track clean days, and hold the line. Authentic calendar tracking for breaking destructive patterns.'
              : 'It takes 21 days to forge a habit pathway in the brain. Distraction-free, local-first, zero fluff.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-900/80 rounded-xl border border-slate-800 backdrop-blur-md">
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
            <span>🟢 Build Habit (Create)</span>
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
            <span>🛡️ Quit Habit (Abstain)</span>
          </button>
        </div>

        {/* Quick Presets Carousel / Chips */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            {isQuit ? 'Harm Reduction Templates (Click to fill)' : 'Popular 21-Day Challenges (Click to fill)'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {filteredPresets.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:bg-slate-800/80 transition-all text-left group ${
                  isQuit ? 'hover:border-indigo-500/40' : 'hover:border-emerald-500/40'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:scale-110 transition-transform">
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

        {/* Main Setup Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/60 space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{isQuit ? 'Habit to Break' : 'Habit Name'}</span>
              <span className="text-[10px] text-slate-500">
                {isQuit ? 'e.g. Zero sugar, No alcohol, No vaping' : 'e.g. Read 20 pages, Cold shower'}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isQuit ? 'e.g. Zero refined sugar, No late-night scrolling' : 'e.g. Read 20 pages, Morning pushups'}
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                  isQuit
                    ? 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
                autoFocus
              />
              <div className="absolute right-3.5 top-3.5 text-slate-600">
                {isQuit ? <Shield className="w-5 h-5" /> : <Target className="w-5 h-5" />}
              </div>
            </div>
          </div>

          {/* Cue / Trigger */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>{isQuit ? 'Craving / Urge Trigger' : 'Trigger / Time Cue'}</span>
              <span className="text-[10px] text-slate-500">
                {isQuit ? 'When does the temptation hit?' : 'When / where will it happen?'}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cue}
                onChange={(e) => setCue(e.target.value)}
                placeholder={isQuit ? 'e.g. When feeling stressed after 3 PM' : 'e.g. At 7:00 AM right after making coffee'}
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                  isQuit
                    ? 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                }`}
              />
              <div className="absolute right-3.5 top-3.5 text-slate-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Mode B: Urge Replacement Plan */}
          {isQuit && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
              <label className="block text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                <span>Urge Replacement Plan (Emergency Action)</span>
              </label>
              <p className="text-[11px] text-slate-400">
                When cravings strike, what healthy action will substitute the urge?
              </p>
              <input
                type="text"
                value={urgeReplacementPlan}
                onChange={(e) => setUrgeReplacementPlan(e.target.value)}
                placeholder="e.g. Drink chamomile tea, do 10 deep breaths, go for a walk"
                className="w-full bg-slate-950 border border-indigo-500/40 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          )}

          {/* Start Date */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Start Date
              </label>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
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
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none [color-scheme:dark] ${
                  isQuit ? 'focus:border-indigo-500' : 'focus:border-emerald-500'
                }`}
              />
              <div className="absolute right-3.5 top-3.5 text-slate-600 pointer-events-none">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Starts today (Day 1) • Immediate Day 1 cockpit activation
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 group transition-all duration-300 mt-2 cursor-pointer ${
              isQuit
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-indigo-500/25 hover:from-indigo-400 hover:to-blue-400'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-300'
            }`}
          >
            <span>{isQuit ? 'Start 21-Day Clean Defense' : 'Start My 21 Days'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};
