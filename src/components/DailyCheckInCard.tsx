import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Edit3,
  Undo2,
  ArrowUpRight,
  Shield,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import type { DayLog, HabitEffort, HabitType, CravingLevel } from '../types/challenge';

interface DailyCheckInCardProps {
  habitType: HabitType;
  urgeReplacementPlan?: string;
  activeDayNumber: number;
  todayLog: DayLog | undefined;
  onCheckIn: (
    dayNumber: number,
    reflection?: string,
    effort?: HabitEffort,
    cravingLevel?: CravingLevel,
    isSlip?: boolean
  ) => void;
  onUndo: (dayNumber: number) => void;
  onUpdateNote: (
    dayNumber: number,
    reflection: string,
    effort?: HabitEffort,
    cravingLevel?: CravingLevel
  ) => void;
  onViewSummary: () => void;
  isAllCompleted: boolean;
}

export const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({
  habitType,
  urgeReplacementPlan,
  activeDayNumber,
  todayLog,
  onCheckIn,
  onUndo,
  onUpdateNote,
  onViewSummary,
  isAllCompleted,
}) => {
  const isQuit = habitType === 'quit';
  const isCompleted = Boolean(todayLog?.completed && !todayLog?.isSlip);
  const isSlip = Boolean(todayLog?.isSlip);
  const isRecorded = isCompleted || isSlip;

  const [reflection, setReflection] = useState('');
  const [effort, setEffort] = useState<HabitEffort>('normal');
  const [cravingLevel, setCravingLevel] = useState<CravingLevel>('low');
  const [isEditing, setIsEditing] = useState(false);
  const [showSlipForm, setShowSlipForm] = useState(false);

  // Sync state if already logged
  useEffect(() => {
    if (todayLog) {
      setReflection(todayLog.reflection || '');
      setEffort(todayLog.effort || 'normal');
      setCravingLevel(todayLog.cravingLevel || 'low');
    } else {
      setReflection('');
      setEffort('normal');
      setCravingLevel('low');
    }
    setIsEditing(false);
    setShowSlipForm(false);
  }, [todayLog, activeDayNumber]);

  const handleCleanOrCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecorded && isEditing) {
      onUpdateNote(activeDayNumber, reflection, isQuit ? undefined : effort, isQuit ? cravingLevel : undefined);
      setIsEditing(false);
    } else {
      onCheckIn(activeDayNumber, reflection, isQuit ? undefined : effort, isQuit ? cravingLevel : undefined, false);
    }
  };

  const handleSlipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckIn(activeDayNumber, reflection, undefined, cravingLevel, true);
    setShowSlipForm(false);
  };

  // Phase encouragement
  const getPhaseMotivation = (day: number) => {
    if (isQuit) {
      if (day <= 7) {
        return {
          phase: 'Phase 1: Acute Withdrawal & Craving Peaks (Days 1–7)',
          quote: 'The brain expects its old shortcut. Every urge you outlast weakens the neurological grip.',
        };
      } else if (day <= 14) {
        return {
          phase: 'Phase 2: Rewiring Dopamine Baselines (Days 8–14)',
          quote: 'The craving frequency is slowing down. Your natural dopamine receptors are repairing.',
        };
      } else {
        return {
          phase: 'Phase 3: Deep Sobriety & Freedom (Days 15–21)',
          quote: 'You no longer crave what used to control you. Guard your freedom with pride.',
        };
      }
    }

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
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-xl backdrop-blur-xl transition-all ${
        isQuit
          ? 'bg-gradient-to-b from-slate-900/90 to-blue-950/20 border-indigo-500/30 shadow-indigo-950/30'
          : 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-slate-800 shadow-black/40'
      }`}
    >
      {/* Decorative ambient backdrop */}
      <div
        className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors ${
          isQuit
            ? isCompleted
              ? 'bg-indigo-500/20'
              : 'bg-blue-500/10'
            : isCompleted
            ? 'bg-emerald-500/20'
            : 'bg-emerald-500/10'
        }`}
      />

      {/* Prominent Urge Replacement Plan Banner for Quit Habits */}
      {isQuit && urgeReplacementPlan && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 relative z-10 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-300">
              Your Urge Replacement Plan
            </p>
            <p className="text-xs md:text-sm font-semibold text-white mt-0.5">
              "{urgeReplacementPlan}"
            </p>
          </div>
        </div>
      )}

      {/* Header of the check-in card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isQuit
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isQuit ? <Shield className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isAllCompleted
                ? 'Challenge Complete'
                : isQuit
                ? `Day ${activeDayNumber} • Holding the Line`
                : `Day ${activeDayNumber} • Daily Cockpit`}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">|</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              {motivation.phase}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {isAllCompleted
              ? isQuit
                ? '🛡️ All 21 Days Clean — Sobriety Mastered!'
                : '🎉 All 21 Days Conquered!'
              : isCompleted
              ? isQuit
                ? `Day ${activeDayNumber} Clean & Protected`
                : `Day ${activeDayNumber} Logged & Verified`
              : isSlip
              ? `Day ${activeDayNumber} Slip Recorded`
              : isQuit
              ? `Today's Stand: Day ${activeDayNumber} of 21 Clean`
              : `Today's Mission: Day ${activeDayNumber} of 21`}
          </h2>
        </div>

        {isAllCompleted && (
          <button
            onClick={onViewSummary}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <span>View 21-Day Recap</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs md:text-sm text-slate-400 italic mb-6 border-l-2 border-emerald-500/50 pl-3 py-0.5">
        "{motivation.quote}"
      </p>

      {/* Slip Form View */}
      {showSlipForm && !isRecorded ? (
        <form
          onSubmit={handleSlipSubmit}
          className="space-y-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 p-5 md:p-6"
        >
          <div className="flex items-center gap-2.5 text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Document Slip Without Shame</span>
          </div>
          <p className="text-xs text-slate-400">
            A slip-up does NOT erase your progress or brain rewiring. What triggered the urge? How can you protect against it tomorrow?
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              What was the cue or trigger? (Reflection)
            </label>
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g. Felt stressed after late meeting, slipped up. Back on track tomorrow!"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Craving Intensity at Slip:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { value: 'low', label: '🟢 Low', desc: 'Mild impulse' },
                  { value: 'medium', label: '🟡 Medium', desc: 'Noticeable pressure' },
                  { value: 'high', label: '🔴 Intense', desc: 'High stress / trigger' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCravingLevel(option.value)}
                  className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                    cravingLevel === option.value
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <p className="text-xs font-bold leading-none mb-1">{option.label}</p>
                  <p className="text-[10px] text-slate-500 leading-none">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Log Slip & Stay in the Fight
            </button>
            <button
              type="button"
              onClick={() => setShowSlipForm(false)}
              className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : isRecorded && !isEditing ? (
        /* Logged State (Clean or Slipped) */
        <div
          className={`space-y-4 rounded-2xl p-5 border ${
            isSlip
              ? 'bg-rose-950/20 border-rose-500/30'
              : isQuit
              ? 'bg-indigo-950/20 border-indigo-500/30'
              : 'bg-emerald-950/20 border-emerald-500/20'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSlip
                    ? 'bg-rose-500/20 border border-rose-500 text-rose-400'
                    : isQuit
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-400'
                    : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                }`}
              >
                {isSlip ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : isQuit ? (
                  <Shield className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-6 h-6" />
                )}
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${
                    isSlip
                      ? 'text-rose-300'
                      : isQuit
                      ? 'text-indigo-200'
                      : 'text-emerald-300'
                  }`}
                >
                  {isSlip
                    ? 'Slip recorded. Your previous clean days remain untouched!'
                    : isQuit
                    ? 'Outstanding! You stayed clean and held the line today.'
                    : 'Great job! You showed up today.'}
                </p>
                <p className="text-xs text-slate-400">
                  {todayLog?.completedAt
                    ? `Recorded at ${new Date(todayLog.completedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    : 'Saved in habit log'}
                </p>
              </div>
            </div>

            {/* Craving / Effort Badge */}
            {isQuit && todayLog?.cravingLevel && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  todayLog.cravingLevel === 'low'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : todayLog.cravingLevel === 'medium'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                Craving: {todayLog.cravingLevel.toUpperCase()}
              </span>
            )}

            {!isQuit && todayLog?.effort && (
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

          {/* User's reflection note */}
          {todayLog?.reflection ? (
            <div className="bg-slate-900/60 rounded-xl p-3 text-xs md:text-sm text-slate-300 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Reflection Note:
              </span>
              "{todayLog.reflection}"
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No reflection note attached for this day.</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{todayLog?.reflection ? 'Edit Reflection' : 'Add Reflection'}</span>
            </button>

            <button
              type="button"
              onClick={() => onUndo(activeDayNumber)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 text-xs transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo check-in</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Check-In Form (Build vs Quit) */
        <form onSubmit={handleCleanOrCompleteSubmit} className="space-y-4">
          {/* Quick reflection input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                {isQuit
                  ? 'Reflection / How you resisted cravings (Optional)'
                  : 'Quick Reflection / How it felt (Optional)'}
              </span>
              <span className="text-[10px] text-slate-500">1 sentence</span>
            </label>
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={
                isQuit
                  ? 'e.g. Craving hit after dinner, executed urge plan and it passed in 10 mins!'
                  : 'e.g. Felt resistance at first, but knocked it out with focus!'
              }
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Mode-Specific Rating Tags */}
          {isQuit ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Craving Severity Faced Today:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: 'low', label: '🟢 Low', desc: 'Felt calm & steady' },
                    { value: 'medium', label: '🟡 Medium', desc: 'Resisted triggers' },
                    { value: 'high', label: '🔴 Intense', desc: 'Overcame hard urge' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCravingLevel(option.value)}
                    className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                      cravingLevel === option.value
                        ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold leading-none mb-1">{option.label}</p>
                    <p className="text-[10px] text-slate-500 leading-none">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
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
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold leading-none mb-1">{option.label}</p>
                    <p className="text-[10px] text-slate-500 leading-none">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 space-y-2.5">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className={`flex-1 relative group overflow-hidden rounded-xl p-[1px] font-bold shadow-lg transition-all cursor-pointer ${
                  isQuit
                    ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 shadow-indigo-500/25 hover:shadow-indigo-500/40'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-emerald-500/25 hover:shadow-emerald-500/40'
                }`}
              >
                <div
                  className={`w-full h-full px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 group-hover:scale-[1.01] transition-transform ${
                    isQuit ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {isQuit ? <Shield className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  <span className="text-sm font-extrabold tracking-wide">
                    {isCompleted
                      ? 'Save Reflection'
                      : isQuit
                      ? '🛡️ I Stayed Clean Today'
                      : `Mark Day ${activeDayNumber} Complete`}
                  </span>
                </div>
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Quit Habit Secondary Link: Had a Slip */}
            {isQuit && !isRecorded && !isEditing && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowSlipForm(true)}
                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors underline underline-offset-4 cursor-pointer"
                >
                  I had a slip today
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
