import React, { useState } from 'react';
import { Flame, Calendar, Clock, RotateCcw, Volume2, VolumeX, History, Sparkles } from 'lucide-react';
import type { Challenge } from '../types/challenge';
import { soundFx } from '../utils/sound';

interface CockpitHeaderProps {
  challenge: Challenge;
  streak: number;
  completedCount: number;
  completionPercentage: number;
  onOpenReset: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const CockpitHeader: React.FC<CockpitHeaderProps> = ({
  challenge,
  streak,
  completedCount,
  completionPercentage,
  onOpenReset,
  onOpenHistory,
  historyCount,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());

  const handleToggleSound = () => {
    const nextState = soundFx.toggle();
    setSoundEnabled(nextState);
  };

  const formattedStartDate = new Date(challenge.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-5">
        {/* Top bar: Brand + Utility controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-extrabold text-xs tracking-widest text-slate-300 uppercase">
              21 DAYS <span className="text-emerald-400">COCKPIT</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* History Button (if any) */}
            {historyCount > 0 && (
              <button
                onClick={onOpenHistory}
                title="View past challenge archives"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-medium transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Archives ({historyCount})</span>
              </button>
            )}

            {/* Reset Challenge Menu Button */}
            <button
              onClick={onOpenReset}
              title="Reset challenge"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 text-xs font-medium transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Habit Summary & Details */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Started {formattedStartDate}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-medium text-emerald-400/90 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <Clock className="w-3 h-3 text-emerald-400" />
                {challenge.cue}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {challenge.title}
            </h1>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 px-3.5 py-2 rounded-xl text-amber-300">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-500/80">Streak</p>
                <p className="text-base font-extrabold leading-none">
                  {streak} {streak === 1 ? 'Day' : 'Days'}
                </p>
              </div>
            </div>

            {/* Quick Completion Counter */}
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-200">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Progress</p>
              <p className="text-base font-extrabold leading-none text-emerald-400">
                {completedCount}<span className="text-slate-500 text-xs font-normal"> / 21</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">
              Challenge Progression
            </span>
            <span className="text-emerald-400 font-bold">
              {completionPercentage}% Complete
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${Math.max(completionPercentage, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
