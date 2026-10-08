import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, Target, Clock, BookOpen, Droplets, Apple, Footprints, Zap } from 'lucide-react';
import { PRESET_HABITS } from '../utils/milestones';

interface SetupScreenProps {
  onStart: (title: string, cue: string, startDate?: string, category?: string, iconName?: string) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const today = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [cue, setCue] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [category, setCategory] = useState('Personal');
  const [iconName, setIconName] = useState('Target');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a habit name to commit to.');
      return;
    }
    setError('');
    onStart(title.trim(), cue.trim() || 'Every day at my designated time', startDate, category, iconName);
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
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        {/* Brand & Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            21-Day Habit Transformation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Commit to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">21 Days</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
            It takes 21 days to forge a habit pathway in the brain. Distraction-free, local-first, zero fluff.
          </p>
        </div>

        {/* Quick Presets Carousel / Chips */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            Popular 21-Day Challenges (Click to auto-fill)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_HABITS.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all text-left group"
              >
                <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:scale-110 transition-transform">
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

        {/* Main Setup Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/60"
        >
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {error}
            </div>
          )}

          {/* Habit Name */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Habit Name</span>
              <span className="text-[11px] text-slate-500">What is the daily action?</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 20 pages, Cold shower, No sugar"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                autoFocus
              />
              <div className="absolute right-3 top-3 text-slate-600">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Trigger Cue */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Trigger / Time Cue</span>
              <span className="text-[11px] text-slate-500">Atomic Habits anchor</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cue}
                onChange={(e) => setCue(e.target.value)}
                placeholder="e.g. At 7:00 AM right after making coffee"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <div className="absolute right-3 top-3 text-slate-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Formula: "After [Current Habit], I will [New Habit]"
            </p>
          </div>

          {/* Start Date */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Start Date</span>
              <span className="text-[11px] text-slate-500">Defaults to today</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all [color-scheme:dark]"
              />
              <div className="absolute right-3 top-3 text-slate-600 pointer-events-none">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-[1px] font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
          >
            <div className="w-full h-full bg-transparent px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 group-hover:scale-[1.01] transition-transform font-bold text-slate-950">
              <span>Start My 21 Days</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-600 mt-5">
          Stored 100% locally on this device in localStorage. No account required.
        </p>
      </div>
    </div>
  );
};
