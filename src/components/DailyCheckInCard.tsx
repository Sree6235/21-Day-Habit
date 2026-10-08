import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, MessageSquare, Edit3, Undo2, ArrowUpRight } from 'lucide-react';
import type { DayLog, HabitEffort } from '../types/challenge';

interface DailyCheckInCardProps {
  activeDayNumber: number;
  todayLog: DayLog | undefined;
  onCheckIn: (dayNumber: number, reflection?: string, effort?: HabitEffort) => void;
  onUndo: (dayNumber: number) => void;
  onUpdateNote: (dayNumber: number, reflection: string, effort?: HabitEffort) => void;
  onViewSummary: () => void;
  isAllCompleted: boolean;
}

export const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({
  activeDayNumber,
  todayLog,
  onCheckIn,
  onUndo,
  onUpdateNote,
  onViewSummary,
  isAllCompleted,
}) => {
  const isCompleted = Boolean(todayLog?.completed);
  const [reflection, setReflection] = useState('');
  const [effort, setEffort] = useState<HabitEffort>('normal');
  const [isEditing, setIsEditing] = useState(false);

  // Sync state if already completed
  useEffect(() => {
    if (todayLog) {
      setReflection(todayLog.reflection || '');
      setEffort(todayLog.effort || 'normal');
    } else {
      setReflection('');
      setEffort('normal');
    }
    setIsEditing(false);
  }, [todayLog, activeDayNumber]);

  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCompleted && isEditing) {
      onUpdateNote(activeDayNumber, reflection, effort);
      setIsEditing(false);
    } else {
      onCheckIn(activeDayNumber, reflection, effort);
    }
  };

  // Phase encouragement
  const getPhaseMotivation = (day: number) => {
    if (day <= 7) {
      return {
        phase: 'Phase 1: Overcoming Inertia (Days 1–7)',
        quote: 'The beginning is the toughest. Every single rep breaks your old gravity.',
      };
    } else if (day <= 14) {
      return {
        phase: 'Phase 2: Building Internal Momentum (Days 8–14)',
        quote: "You have crossed the hardest hurdle. Keep the chain unbroken—it's getting easier.",
      };
    } else {
      return {
        phase: 'Phase 3: Cementing Your New Identity (Days 15–21)',
        quote: 'This is no longer what you do—this is who you are. Sprint to the finish line!',
      };
    }
  };

  const motivation = getPhaseMotivation(activeDayNumber);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 md:p-8 shadow-xl shadow-black/40 backdrop-blur-xl">
      {/* Decorative subtle ambient backdrop */}
      <div className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-[90px] pointer-events-none transition-colors ${isCompleted ? 'bg-emerald-500/15' : 'bg-emerald-500/10'}`} />

      {/* Header of the check-in card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              {isAllCompleted ? 'Challenge Complete' : `Daily Cockpit • Day ${activeDayNumber}`}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">|</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">{motivation.phase}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            {isAllCompleted
              ? '🎉 All 21 Days Conquered!'
              : isCompleted
              ? `Day ${activeDayNumber} Logged & Verified`
              : `Today's Mission: Day ${activeDayNumber} of 21`}
          </h2>
        </div>

        {isAllCompleted && (
          <button
            onClick={onViewSummary}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <span>View 21-Day Recap</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs md:text-sm text-slate-400 italic mb-6 border-l-2 border-emerald-500/50 pl-3 py-0.5">
        "{motivation.quote}"
      </p>

      {/* Already Checked-in View (Unless in edit mode) */}
      {isCompleted && !isEditing ? (
        <div className="space-y-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-emerald-300">
                  Great job! You showed up today.
                </p>
                <p className="text-xs text-slate-400">
                  {todayLog?.completedAt
                    ? `Checked in at ${new Date(todayLog.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Recorded in habit log'}
                </p>
              </div>
            </div>

            {/* Effort Tag Badge */}
            {todayLog?.effort && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  todayLog.effort === 'easy'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : todayLog.effort === 'tough'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                }`}
              >
                Effort: {todayLog.effort.charAt(0).toUpperCase() + todayLog.effort.slice(1)}
              </span>
            )}
          </div>

          {/* User's reflection display */}
          {todayLog?.reflection ? (
            <div className="bg-slate-900/60 rounded-lg p-3 text-xs md:text-sm text-slate-300 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Reflection Note:
              </span>
              "{todayLog.reflection}"
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No reflection note attached for this day.</p>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{todayLog?.reflection ? 'Edit Reflection' : 'Add Reflection'}</span>
            </button>

            <button
              type="button"
              onClick={() => onUndo(activeDayNumber)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 text-xs transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo check-in</span>
            </button>
          </div>
        </div>
      ) : (
        /* Check-in Form or Editing Form */
        <form onSubmit={handleSubmitCheckIn} className="space-y-4">
          {/* Quick reflection input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                Quick Reflection / How it felt (Optional)
              </span>
              <span className="text-[10px] text-slate-500">1 sentence</span>
            </label>
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g. Felt resistance at first, but pushed through. Felt energized afterwards!"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Effort Tag Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Effort Rating:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { value: 'easy', label: '🟢 Easy', desc: 'Flow state / natural' },
                  { value: 'normal', label: '🟡 Normal', desc: 'Standard effort' },
                  { value: 'tough', label: '🔴 Tough', desc: 'High resistance' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEffort(option.value)}
                  className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                    effort === option.value
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold leading-none mb-1">{option.label}</p>
                  <p className="text-[10px] text-slate-500 leading-none">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 relative group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-[1px] font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer"
            >
              <div className="w-full h-full bg-transparent px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 group-hover:scale-[1.01] transition-transform">
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span className="text-sm font-extrabold tracking-wide">
                  {isCompleted ? 'Save Reflection' : `Check In Day ${activeDayNumber}`}
                </span>
              </div>
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
