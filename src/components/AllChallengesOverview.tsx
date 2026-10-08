import React, { useState } from 'react';
import type { Challenge, HabitEffort } from '../types/challenge';
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
  Target
} from 'lucide-react';

interface AllChallengesOverviewProps {
  challenges: Challenge[];
  onFocusChallenge: (id: string) => void;
  onCheckInDay: (challengeId: string, dayNumber: number, reflection?: string, effort?: HabitEffort) => void;
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
  // Track open reflection drawers per challenge: { [challengeId]: { reflection: string, effort: HabitEffort, isOpen: boolean } }
  const [reflectionDrawers, setReflectionDrawers] = useState<
    Record<string, { reflection: string; effort: HabitEffort; isOpen: boolean }>
  >({});

  const toggleDrawer = (id: string) => {
    setReflectionDrawers((prev) => ({
      ...prev,
      [id]: {
        reflection: prev[id]?.reflection || '',
        effort: prev[id]?.effort || 'normal',
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
        isOpen: true,
      },
    }));
  };

  const handleQuickCheckIn = (chal: Challenge) => {
    const stats = calculateChallengeStats(chal);
    const drawerState = reflectionDrawers[chal.id];
    const reflection = drawerState?.reflection || undefined;
    const effort = drawerState?.effort || 'normal';

    onCheckInDay(chal.id, stats.activeDayNumber, reflection, effort);

    // Close drawer
    setReflectionDrawers((prev) => ({
      ...prev,
      [chal.id]: {
        reflection: '',
        effort: 'normal',
        isOpen: false,
      },
    }));
  };

  const getHabitIcon = (iconName?: string, category?: string) => {
    const key = (iconName || category || '').toLowerCase();
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
              Check off your daily habits across all active 21-day challenges in one unified screen.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[120px]">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Completed Today
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
              <span>Add New Habit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {challenges.map((chal) => {
          const stats = calculateChallengeStats(chal);
          const drawer = reflectionDrawers[chal.id] || { reflection: '', effort: 'normal', isOpen: false };
          const activeDay = chal.days.find((d) => d.dayNumber === stats.activeDayNumber);
          const isDone = stats.isTodayDone;

          return (
            <div
              key={chal.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/90 p-5 md:p-6 transition-all hover:border-slate-700/80 backdrop-blur-md shadow-lg shadow-black/20"
            >
              {/* Challenge Main Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Title & Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getHabitIcon(chal.iconName, chal.category)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
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

                    {/* Progress Bar & Text */}
                    <div className="flex items-center gap-3 mt-2 max-w-md">
                      <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${Math.max(stats.completionPercentage, 2)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 flex-shrink-0">
                        {stats.completedCount} / 21 ({stats.completionPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status, Streak & Actions */}
                <div className="flex items-center gap-3 justify-between lg:justify-end flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {/* Streak */}
                  {stats.streak > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>{stats.streak}d streak</span>
                    </div>
                  )}

                  {/* Day check-in button or status */}
                  {isDone ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Day {stats.activeDayNumber} Done</span>
                      </div>
                      <button
                        onClick={() => onUndoDay(chal.id, stats.activeDayNumber)}
                        className="text-[11px] text-slate-500 hover:text-rose-400 p-1"
                        title="Undo check-in"
                      >
                        Undo
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickCheckIn(chal)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Check In Day {stats.activeDayNumber}</span>
                      </button>

                      <button
                        onClick={() => toggleDrawer(chal.id)}
                        className={`p-2 rounded-xl border text-xs transition-colors ${
                          drawer.isOpen
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                        title="Add reflection note before check-in"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* View Details / 3x7 Grid Switcher */}
                  <button
                    onClick={() => onFocusChallenge(chal.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    title="Open 3x7 Matrix View"
                  >
                    <span>3×7 Matrix</span>
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

              {/* Reflection Drawer if opened */}
              {drawer.isOpen && !isDone && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Quick Reflection for Day {stats.activeDayNumber}
                    </label>
                    <input
                      type="text"
                      value={drawer.reflection}
                      onChange={(e) => handleReflectionChange(chal.id, e.target.value)}
                      placeholder="e.g. Felt great, knocked it out first thing in the morning!"
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Effort:</span>
                      {(['easy', 'normal', 'tough'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleEffortChange(chal.id, lvl)}
                          className={`text-[10px] px-2 py-1 rounded-lg border font-semibold capitalize ${
                            drawer.effort === lvl
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickCheckIn(chal)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      Check In Now
                    </button>
                  </div>
                </div>
              )}

              {/* If completed today, display note if any */}
              {isDone && activeDay?.reflection && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 italic">
                  "{activeDay.reflection}"
                </div>
              )}

              {/* 21-Day Mini Strip (dots) */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
                  {chal.days.map((d) => (
                    <div
                      key={d.dayNumber}
                      title={`Day ${d.dayNumber}: ${d.completed ? 'Done' : d.dayNumber === stats.activeDayNumber ? 'Today' : 'Upcoming'}`}
                      className={`h-2.5 flex-1 min-w-[10px] rounded-sm transition-all ${
                        d.completed
                          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40'
                          : d.dayNumber === stats.activeDayNumber
                          ? 'bg-emerald-400/80 ring-2 ring-emerald-400/40'
                          : 'bg-slate-800/80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
