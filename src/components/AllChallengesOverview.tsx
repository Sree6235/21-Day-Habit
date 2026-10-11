import React, { useState } from 'react';
import type { Challenge, HabitEffort, CravingLevel } from '../types/challenge';
import { calculateChallengeStats } from '../hooks/usePersonalChallenge';
import {
  Flame,
  CheckCircle2,
  Clock,
  ExternalLink,
  Archive,
  Trash2,
  Sparkles,
  MessageSquare,
  PlusCircle,
  BookOpen,
  Droplets,
  Apple,
  Footprints,
  Zap,
  Target,
  Shield,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';

interface AllChallengesOverviewProps {
  challenges: Challenge[];
  onFocusChallenge: (id: string) => void;
  onCheckInDay: (
    challengeId: string,
    dayNumber: number,
    reflection?: string,
    effort?: HabitEffort,
    cravingLevel?: CravingLevel,
    isSlip?: boolean
  ) => void;
  onUndoDay: (challengeId: string, dayNumber: number) => void;
  onArchiveChallenge: (challengeId: string) => void;
  onDeleteChallenge: (challengeId: string) => void;
  onOpenCreateModal: () => void;
}

export const AllChallengesOverview: React.FC<AllChallengesOverviewProps> = ({
  challenges,
  onFocusChallenge,
  onCheckInDay,
  onUndoDay,
  onArchiveChallenge,
  onDeleteChallenge,
  onOpenCreateModal,
}) => {
  // Track open reflection drawers per challenge: { [challengeId]: { reflection: string, effort: HabitEffort, cravingLevel: CravingLevel, isOpen: boolean } }
  const [reflectionDrawers, setReflectionDrawers] = useState<
    Record<string, { reflection: string; effort: HabitEffort; cravingLevel: CravingLevel; isOpen: boolean }>
  >({});

  const toggleDrawer = (id: string) => {
    setReflectionDrawers((prev) => ({
      ...prev,
      [id]: {
        reflection: prev[id]?.reflection || '',
        effort: prev[id]?.effort || 'normal',
        cravingLevel: prev[id]?.cravingLevel || 'low',
        isOpen: !prev[id]?.isOpen,
      },
    }));
  };

  const handleReflectionChange = (id: string, text: string) => {
    setReflectionDrawers((prev) => ({
      ...prev,
      [id]: {
        reflection: text,
        effort: prev[id]?.effort || 'normal',
        cravingLevel: prev[id]?.cravingLevel || 'low',
        isOpen: true,
      },
    }));
  };

  const handleEffortChange = (id: string, effort: HabitEffort) => {
    setReflectionDrawers((prev) => ({
      ...prev,
      [id]: {
        reflection: prev[id]?.reflection || '',
        effort: effort,
        cravingLevel: prev[id]?.cravingLevel || 'low',
        isOpen: true,
      },
    }));
  };

  const handleCravingChange = (id: string, level: CravingLevel) => {
    setReflectionDrawers((prev) => ({
      ...prev,
      [id]: {
        reflection: prev[id]?.reflection || '',
        effort: prev[id]?.effort || 'normal',
        cravingLevel: level,
        isOpen: true,
      },
    }));
  };

  const handleQuickCheckIn = (chal: Challenge, isSlip: boolean = false) => {
    const stats = calculateChallengeStats(chal);
    const drawerState = reflectionDrawers[chal.id];
    const reflection = drawerState?.reflection || undefined;
    const effort = drawerState?.effort || 'normal';
    const craving = drawerState?.cravingLevel || 'low';

    onCheckInDay(
      chal.id,
      stats.activeDayNumber,
      reflection,
      chal.habitType === 'quit' ? undefined : effort,
      chal.habitType === 'quit' ? craving : undefined,
      isSlip
    );

    // Close drawer
    setReflectionDrawers((prev) => ({
      ...prev,
      [chal.id]: {
        reflection: '',
        effort: 'normal',
        cravingLevel: 'low',
        isOpen: false,
      },
    }));
  };

  const getHabitIcon = (iconName?: string, category?: string, isQuit?: boolean) => {
    const key = (iconName || category || '').toLowerCase();
    if (isQuit || key.includes('shield')) {
      return <Shield className="w-5 h-5 text-indigo-400" />;
    }
    if (key.includes('book') || key.includes('read') || key.includes('mindset')) {
      return <BookOpen className="w-5 h-5 text-blue-400" />;
    }
    if (key.includes('drop') || key.includes('shower') || key.includes('water')) {
      return <Droplets className="w-5 h-5 text-cyan-400" />;
    }
    if (key.includes('apple') || key.includes('sugar') || key.includes('health')) {
      return <Apple className="w-5 h-5 text-emerald-400" />;
    }
    if (key.includes('foot') || key.includes('step') || key.includes('fitness')) {
      return <Footprints className="w-5 h-5 text-amber-400" />;
    }
    if (key.includes('zap') || key.includes('focus') || key.includes('work')) {
      return <Zap className="w-5 h-5 text-violet-400" />;
    }
    return <Target className="w-5 h-5 text-emerald-400" />;
  };

  // Aggregated overview stats
  const totalCompletedToday = challenges.filter((c) => {
    const s = calculateChallengeStats(c);
    return s.isTodayDone;
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 p-6 md:p-8 backdrop-blur-xl shadow-xl shadow-black/40">
        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Multi-Habit Cockpit Overview
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Today's Habit Command Center
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-lg">
              Monitor both your positive routines (Build) and abstinence streaks (Quit) in one unified screen.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[120px]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Completed / Clean Today
              </p>
              <p className="text-2xl font-black text-emerald-400">
                {totalCompletedToday}
                <span className="text-sm font-normal text-slate-500"> / {challenges.length}</span>
              </p>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>New Habit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Challenges List Cards */}
      <div className="space-y-4">
        {challenges.map((chal) => {
          const stats = calculateChallengeStats(chal);
          const isDone = stats.isTodayDone;
          const isSlipped = stats.isTodaySlipped;
          const isQuit = chal.habitType === 'quit';
          const drawer = reflectionDrawers[chal.id] || {
            reflection: '',
            effort: 'normal',
            cravingLevel: 'low',
            isOpen: false,
          };

          return (
            <div
              key={chal.id}
              className={`rounded-2xl border transition-all duration-300 p-5 md:p-6 bg-slate-900/60 backdrop-blur-md hover:border-slate-700 shadow-lg ${
                isQuit
                  ? isDone
                    ? 'border-indigo-500/40 bg-gradient-to-r from-indigo-950/20 via-slate-900/80 to-slate-900/60'
                    : 'border-slate-800'
                  : isDone
                  ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-slate-900/80 to-slate-900/60'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Icon, Mode Tag, Habit Info & Progress */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                      isQuit
                        ? 'bg-indigo-500/10 border-indigo-500/30'
                        : 'bg-slate-800/80 border-slate-700'
                    }`}
                  >
                    {getHabitIcon(chal.iconName, chal.category, isQuit)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {/* Mode Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${
                          isQuit
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {isQuit ? <Shield className="w-2.5 h-2.5 text-indigo-400" /> : <Sparkles className="w-2.5 h-2.5 text-emerald-400" />}
                        {isQuit ? 'Quit Habit' : 'Build Habit'}
                      </span>

                      <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                        {chal.category || 'General'}
                      </span>

                      <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{chal.cue}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight truncate">
                      {chal.title}
                    </h3>

                    {/* Urge Replacement Plan preview if quit */}
                    {isQuit && chal.urgeReplacementPlan && (
                      <p className="text-xs text-indigo-300/90 flex items-center gap-1.5 mt-1 truncate">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                        <span className="truncate">Plan: {chal.urgeReplacementPlan}</span>
                      </p>
                    )}

                    {/* Progress Bar & Text */}
                    <div className="flex items-center gap-3 mt-2 max-w-md">
                      <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            isQuit
                              ? 'bg-gradient-to-r from-indigo-500 to-blue-400'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          }`}
                          style={{ width: `${Math.max(stats.completionPercentage, 2)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 flex-shrink-0">
                        {isQuit ? `${stats.cleanCount} Clean` : `${stats.completedCount} Done`} / 21 ({stats.completionPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status, Streak & Actions */}
                <div className="flex items-center gap-3 justify-between lg:justify-end flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {/* Streak */}
                  {stats.streak > 0 && (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        isQuit
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isQuit ? <Shield className="w-3.5 h-3.5 text-indigo-400" /> : <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                      <span>{stats.streak}d {isQuit ? 'clean' : 'streak'}</span>
                    </div>
                  )}

                  {/* Day check-in button or status */}
                  {isDone ? (
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold ${
                          isQuit
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        }`}
                      >
                        {isQuit ? <Shield className="w-4 h-4 text-indigo-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        <span>{isQuit ? `Day ${stats.activeDayNumber} Clean` : `Day ${stats.activeDayNumber} Done`}</span>
                      </div>
                      <button
                        onClick={() => onUndoDay(chal.id, stats.activeDayNumber)}
                        className="text-[11px] text-slate-500 hover:text-rose-400 p-1"
                        title="Undo check-in"
                      >
                        Undo
                      </button>
                    </div>
                  ) : isSlipped ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Slip Logged</span>
                      </div>
                      <button
                        onClick={() => onUndoDay(chal.id, stats.activeDayNumber)}
                        className="text-[11px] text-slate-500 hover:text-rose-400 p-1"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickCheckIn(chal, false)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                          isQuit
                            ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-indigo-500/20'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20'
                        }`}
                      >
                        {isQuit ? <Shield className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{isQuit ? '🛡️ Stayed Clean Today' : `Check In Day ${stats.activeDayNumber}`}</span>
                      </button>

                      <button
                        onClick={() => toggleDrawer(chal.id)}
                        className={`p-2 rounded-xl border text-xs transition-colors ${
                          drawer.isOpen
                            ? isQuit
                              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        title="Add reflection or log craving"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Calendar / Focus Cockpit View Switcher */}
                  <button
                    onClick={() => onFocusChallenge(chal.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    title="Open Calendar Cockpit View"
                  >
                    <span>Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Archive / Delete Menu */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onArchiveChallenge(chal.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                      title="Archive this challenge"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteChallenge(chal.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete this challenge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Quick Reflection Drawer */}
              {drawer.isOpen && !isDone && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 animate-fade-in space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={drawer.reflection}
                        onChange={(e) => handleReflectionChange(chal.id, e.target.value)}
                        placeholder={
                          isQuit
                            ? 'How were cravings today? How did you hold the line?'
                            : 'Add a 1-line reflection or key accomplishment...'
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                    </div>

                    {/* Mode-specific selector */}
                    {isQuit ? (
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {(['low', 'medium', 'high'] as const).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => handleCravingChange(chal.id, level)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                              drawer.cravingLevel === level
                                ? 'bg-indigo-500 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {level} Craving
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {(['easy', 'normal', 'tough'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleEffortChange(chal.id, lvl)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                              drawer.effort === lvl
                                ? 'bg-emerald-500 text-slate-950'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleQuickCheckIn(chal, false)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isQuit
                          ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      }`}
                    >
                      Save & Complete
                    </button>
                  </div>

                  {/* Secondary slip link for Quit habits */}
                  {isQuit && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => handleQuickCheckIn(chal, true)}
                        className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors underline"
                      >
                        I had a slip today (log without clearing past clean days)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
