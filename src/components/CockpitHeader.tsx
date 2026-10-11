import React, { useState } from 'react';
import {
  Flame,
  Calendar,
  Clock,
  RotateCcw,
  Volume2,
  VolumeX,
  History,
  Sparkles,
  Settings,
  Shield,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import type { Challenge } from '../types/challenge';
import { soundFx } from '../utils/sound';
import {
  formatFriendlyDate,
  calculateTargetFinishDate,
} from '../utils/calendarDates';

interface CockpitHeaderProps {
  challenge: Challenge;
  streak: number;
  completedCount: number;
  cleanCount?: number;
  activeDayNumber?: number;
  targetFinishDate?: string;
  completionPercentage: number;
  onOpenReset: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  historyCount: number;
}

export const CockpitHeader: React.FC<CockpitHeaderProps> = ({
  challenge,
  streak,
  completedCount,
  cleanCount,
  activeDayNumber = 1,
  targetFinishDate,
  completionPercentage,
  onOpenReset,
  onOpenHistory,
  onOpenSettings,
  historyCount,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
  const isQuit = challenge.habitType === 'quit';

  const handleToggleSound = () => {
    const nextState = soundFx.toggle();
    setSoundEnabled(nextState);
  };

  const formattedStartDate = formatFriendlyDate(challenge.startDate);
  const finishDateString =
    targetFinishDate || challenge.targetFinishDate || calculateTargetFinishDate(challenge.startDate);
  const formattedFinishDate = formatFriendlyDate(finishDateString);

  const displayCount = isQuit ? (cleanCount ?? completedCount) : completedCount;

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-5">
        {/* Top bar: Brand + Utility controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                isQuit
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {isQuit ? <Shield className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <span className="font-extrabold text-xs tracking-widest text-slate-300 uppercase">
              21 DAYS{' '}
              <span className={isQuit ? 'text-indigo-400' : 'text-emerald-400'}>
                {isQuit ? 'DEFENSE COCKPIT' : 'BUILD COCKPIT'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings Modal Button */}
            <button
              onClick={onOpenSettings}
              title="Mantra Settings & Typing Gatekeeper"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className={`w-4 h-4 ${isQuit ? 'text-indigo-400' : 'text-emerald-400'}`} />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
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
              {/* Mode indicator pill */}
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                  isQuit
                    ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {isQuit ? <Shield className="w-3 h-3 text-indigo-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                {isQuit ? 'Quit / Harm Reduction' : 'Build / Positive Habit'}
              </span>

              <span className="text-slate-600">•</span>

              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Started {formattedStartDate}
              </span>

              <span className="text-slate-600">•</span>

              <span
                className={`text-xs font-medium flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                  isQuit
                    ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20'
                    : 'text-emerald-400/90 bg-emerald-500/10 border-emerald-500/20'
                }`}
              >
                <Clock className={`w-3 h-3 ${isQuit ? 'text-indigo-400' : 'text-emerald-400'}`} />
                {challenge.cue}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              {challenge.title}
            </h1>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Header Stat 1: Day X of 21 */}
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-200">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Timeline</p>
              <p className="text-sm md:text-base font-extrabold leading-none text-white">
                {isQuit ? `Day ${activeDayNumber} of 21 Clean` : `Day ${activeDayNumber} of 21`}
              </p>
            </div>

            {/* Header Stat 2: Streak Badge */}
            <div
              className={`flex items-center gap-2 border px-3.5 py-2 rounded-xl ${
                isQuit
                  ? 'bg-gradient-to-r from-indigo-500/15 to-blue-500/15 border-indigo-500/30 text-indigo-300'
                  : 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 border-amber-500/30 text-amber-300'
              }`}
            >
              {isQuit ? (
                <Shield className="w-5 h-5 text-indigo-400 animate-pulse" />
              ) : (
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              )}
              <div>
                <p
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isQuit ? 'text-indigo-400' : 'text-amber-500/80'
                  }`}
                >
                  {isQuit ? 'Clean Streak' : 'Streak'}
                </p>
                <p className="text-base font-extrabold leading-none">
                  {streak} {streak === 1 ? 'Day' : 'Days'}
                </p>
              </div>
            </div>

            {/* Header Stat 3: Target Finish Date */}
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-200 hidden sm:block">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Target Finish</p>
              <p className={`text-sm md:text-base font-extrabold leading-none ${isQuit ? 'text-indigo-300' : 'text-emerald-400'}`}>
                {formattedFinishDate}
              </p>
            </div>

            {/* Quick Completion Counter */}
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-200">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                {isQuit ? 'Clean Log' : 'Progress'}
              </p>
              <p className={`text-base font-extrabold leading-none ${isQuit ? 'text-indigo-400' : 'text-emerald-400'}`}>
                {displayCount}
                <span className="text-slate-500 text-xs font-normal"> / 21</span>
              </p>
            </div>
          </div>
        </div>

        {/* Urge Replacement Plan (Mode B: Quit Habit) */}
        {isQuit && challenge.urgeReplacementPlan && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 shadow-md shadow-indigo-950/30">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-amber-300" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Urge Replacement Plan
              </p>
              <p className="text-xs md:text-sm text-slate-200 font-medium">
                {challenge.urgeReplacementPlan}
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">
              {isQuit ? 'Abstinence & Resistance Progression' : 'Challenge Progression'}
            </span>
            <span className={`font-bold ${isQuit ? 'text-indigo-400' : 'text-emerald-400'}`}>
              {completionPercentage}% Complete
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isQuit
                  ? 'bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              }`}
              style={{ width: `${Math.max(completionPercentage, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
