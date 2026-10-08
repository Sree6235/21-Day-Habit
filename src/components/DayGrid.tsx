import React from 'react';
import { Check, Lock, Sparkles, FileText } from 'lucide-react';
import type { DayLog } from '../types/challenge';

interface DayGridProps {
  days: DayLog[];
  activeDayNumber: number;
  onSelectDay: (day: DayLog) => void;
  onQuickCheckIn: (dayNumber: number) => void;
}

export const DayGrid: React.FC<DayGridProps> = ({
  days,
  activeDayNumber,
  onSelectDay,
  onQuickCheckIn,
}) => {
  const getMilestoneTag = (dayNumber: number) => {
    switch (dayNumber) {
      case 3:
        return { label: 'Spark', icon: '⚡' };
      case 7:
        return { label: 'Week 1', icon: '🔥' };
      case 14:
        return { label: 'Week 2', icon: '🛡️' };
      case 21:
        return { label: 'Mastery', icon: '👑' };
      default:
        return null;
    }
  };

  const getWeekName = (weekIdx: number) => {
    switch (weekIdx) {
      case 0:
        return { title: 'Week 1 • Days 1–7', phase: 'Overcoming Inertia' };
      case 1:
        return { title: 'Week 2 • Days 8–14', phase: 'Building Internal Momentum' };
      case 2:
        return { title: 'Week 3 • Days 15–21', phase: 'Identity Shift & Lock-in' };
      default:
        return { title: `Week ${weekIdx + 1}`, phase: '' };
    }
  };

  // Group days into 3 weeks (7 days each)
  const weeks = [
    days.slice(0, 7),
    days.slice(7, 14),
    days.slice(14, 21),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>21-Day Progression Matrix</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              3 × 7 Layout
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Click any completed card to read or edit your journal reflections.
          </p>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            Done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 ring-2 ring-emerald-400/40" />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-700" />
            Locked
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {weeks.map((weekDays, weekIdx) => {
          const weekMeta = getWeekName(weekIdx);
          const weekCompletedCount = weekDays.filter((d) => d.completed).length;

          return (
            <div
              key={weekIdx}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 md:p-5 backdrop-blur-sm"
            >
              {/* Week sub-header */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{weekMeta.title}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500">{weekMeta.phase}</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {weekCompletedCount} / 7 Done
                </span>
              </div>

              {/* 7 Days Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 md:gap-3">
                {weekDays.map((day) => {
                  const isCurrent = day.dayNumber === activeDayNumber;
                  const isCompleted = day.completed;
                  const milestone = getMilestoneTag(day.dayNumber);

                  return (
                    <div
                      key={day.dayNumber}
                      onClick={() => {
                        if (isCompleted) {
                          onSelectDay(day);
                        } else if (isCurrent) {
                          onQuickCheckIn(day.dayNumber);
                        }
                      }}
                      className={`relative group rounded-xl p-3 flex flex-col justify-between min-h-[105px] transition-all select-none ${
                        isCompleted
                          ? 'bg-gradient-to-br from-emerald-500/25 via-emerald-600/15 to-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 cursor-pointer shadow-lg shadow-emerald-950/30 hover:scale-[1.02]'
                          : isCurrent
                          ? 'bg-slate-900 border-2 border-emerald-400 glow-active cursor-pointer scale-[1.02]'
                          : 'bg-slate-950/60 border border-slate-800/60 opacity-60 hover:opacity-75 cursor-not-allowed'
                      }`}
                    >
                      {/* Top bar of card */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-extrabold ${
                            isCompleted
                              ? 'text-emerald-300'
                              : isCurrent
                              ? 'text-emerald-400'
                              : 'text-slate-500'
                          }`}
                        >
                          DAY {day.dayNumber}
                        </span>

                        {milestone && (
                          <span
                            className="text-[11px] leading-none"
                            title={`Milestone: ${milestone.label}`}
                          >
                            {milestone.icon}
                          </span>
                        )}
                      </div>

                      {/* Middle icon / state */}
                      <div className="my-2 flex items-center justify-center">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Bottom status / Note indicator */}
                      <div className="text-center">
                        {isCompleted ? (
                          <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-300 font-semibold">
                            {day.reflection ? (
                              <span className="flex items-center gap-0.5 truncate max-w-[85px]">
                                <FileText className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="truncate">View Note</span>
                              </span>
                            ) : (
                              <span>Done</span>
                            )}
                          </div>
                        ) : isCurrent ? (
                          <span className="inline-block text-[10px] uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            Today
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-medium">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
