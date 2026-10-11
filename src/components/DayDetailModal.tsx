import React, { useState, useEffect } from 'react';
import type { DayLog, HabitEffort, CravingLevel, HabitType } from '../types/challenge';
import { X, Calendar, Undo2, Save, MessageSquare, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatFriendlyDate } from '../utils/calendarDates';

interface DayDetailModalProps {
  day: DayLog | null;
  habitType?: HabitType;
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (
    dayNumber: number,
    reflection: string,
    effort?: HabitEffort,
    cravingLevel?: CravingLevel
  ) => void;
  onUncheck: (dayNumber: number) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  habitType = 'build',
  isOpen,
  onClose,
  onSaveNote,
  onUncheck,
}) => {
  const [reflection, setReflection] = useState('');
  const [effort, setEffort] = useState<HabitEffort>('normal');
  const [cravingLevel, setCravingLevel] = useState<CravingLevel>('low');

  const isQuit = habitType === 'quit';

  useEffect(() => {
    if (day) {
      setReflection(day.reflection || '');
      setEffort(day.effort || 'normal');
      setCravingLevel(day.cravingLevel || 'low');
    }
  }, [day]);

  if (!isOpen || !day) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(day.dayNumber, reflection, isQuit ? undefined : effort, isQuit ? cravingLevel : undefined);
    onClose();
  };

  const handleUndo = () => {
    onUncheck(day.dayNumber);
    onClose();
  };

  const formattedDate = day.completedAt
    ? new Date(day.completedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : day.dateString
    ? formatFriendlyDate(day.dateString)
    : 'Day Record';

  const isSlip = Boolean(day.isSlip);
  const isCompleted = Boolean(day.completed && !isSlip);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg border ${
              isSlip
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : isQuit
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }`}
          >
            {isSlip ? <AlertTriangle className="w-6 h-6" /> : isQuit ? <Shield className="w-6 h-6" /> : day.dayNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">Day {day.dayNumber} Record</h3>
              {isSlip ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Slip-Up Logged
                </span>
              ) : isCompleted ? (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    isQuit
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {isQuit ? <Shield className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {isQuit ? 'Clean / Resisted' : 'Completed'}
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Pending / Unchecked
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Notice for slips */}
        {isSlip && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            <strong>Self-compassion reminder:</strong> Slips are data points, not failures. Your previous clean days remain logged and part of your identity shift.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              {isSlip ? 'What triggered the slip? (Reflection)' : 'Journal Reflection / Daily Note'}
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              placeholder={
                isSlip
                  ? 'What was the urge trigger? What will you do differently next time?'
                  : isQuit
                  ? 'How did you handle the cravings today? Did your replacement plan help?'
                  : 'How did this session feel? Any breakthrough or obstacle?'
              }
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
            />
          </div>

          {/* Craving Level for Quit Habits */}
          {isQuit ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Craving / Urge Intensity Today:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: 'low', label: '🟢 Low Urge' },
                    { value: 'medium', label: '🟡 Medium Urge' },
                    { value: 'high', label: '🔴 Intense Craving' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCravingLevel(option.value)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      cravingLevel === option.value
                        ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Effort Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: 'easy', label: '🟢 Easy' },
                    { value: 'normal', label: '🟡 Normal' },
                    { value: 'tough', label: '🔴 Tough' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setEffort(option.value)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      effort === option.value
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Reset Day Log</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-lg ${
                  isQuit
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
