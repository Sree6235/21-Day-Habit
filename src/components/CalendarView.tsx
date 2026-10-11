import React, { useState } from 'react';
import type { Challenge, DayLog } from '../types/challenge';
import {
  parseLocalDate,
  formatFriendlyDate,
  generateMonthGrid,
  addDays,
} from '../utils/calendarDates';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Shield,
  AlertTriangle,
  FileText,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';

interface CalendarViewProps {
  challenge: Challenge;
  activeDayNumber: number;
  onSelectDay: (day: DayLog) => void;
  onQuickCheckIn: (dayNumber: number) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  challenge,
  activeDayNumber,
  onSelectDay,
  onQuickCheckIn,
}) => {
  const isQuit = challenge.habitType === 'quit';
  const startDate = parseLocalDate(challenge.startDate);

  // Default displayed month: the challenge start month or today's month
  const [currentViewDate, setCurrentViewDate] = useState<Date>(() => {
    const today = new Date();
    const finishDate = addDays(startDate, 20);
    // If today is within challenge, view today's month, otherwise start month
    if (today >= startDate && today <= finishDate) {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }
    return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  });

  // Sync calendar view month when challenge or its startDate changes
  React.useEffect(() => {
    const today = new Date();
    const sDate = parseLocalDate(challenge.startDate);
    const finishDate = addDays(sDate, 20);
    if (today >= sDate && today <= finishDate) {
      setCurrentViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    } else {
      setCurrentViewDate(new Date(sDate.getFullYear(), sDate.getMonth(), 1));
    }
  }, [challenge.id, challenge.startDate]);

  const viewYear = currentViewDate.getFullYear();
  const viewMonth = currentViewDate.getMonth();

  const monthName = currentViewDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleJumpToStart = () => {
    setCurrentViewDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
  };

  // Generate the Monday-first calendar grid cells
  const gridCells = generateMonthGrid(viewYear, viewMonth, challenge.startDate);

  const getDayLog = (dayNumber?: number): DayLog | undefined => {
    if (!dayNumber) return undefined;
    return challenge.days.find((d) => d.dayNumber === dayNumber);
  };

  // Check how many of the 21 days are in this viewed month
  const challengeDaysInView = gridCells.filter((c) => c.isChallengeDay && c.isCurrentMonth).length;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-5 md:p-7 backdrop-blur-xl shadow-2xl transition-all ${
        isQuit
          ? 'bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-blue-950/20 border-indigo-500/30 shadow-indigo-950/30'
          : 'bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-emerald-950/20 border-emerald-500/30 shadow-emerald-950/30'
      }`}
    >
      {/* Ambient background light */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[110px] pointer-events-none ${
          isQuit ? 'bg-indigo-500/10' : 'bg-emerald-500/10'
        }`}
      />

      {/* Calendar Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                isQuit
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isQuit ? <Shield className="w-3.5 h-3.5 text-indigo-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
              {isQuit ? 'Sobriety & Abstinence Calendar' : 'Habit Consistency Calendar'}
            </span>
            <span className="text-xs text-slate-500">
              • {challengeDaysInView} days in this month
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{monthName}</span>
            <button
              onClick={handleJumpToStart}
              className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 transition-colors cursor-pointer"
              title="Reset view to Challenge Start Month"
            >
              Start Date: {formatFriendlyDate(challenge.startDate)}
            </button>
          </h3>
        </div>

        {/* Month Navigation & Legend */}
        <div className="flex items-center gap-3">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl shadow-inner">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-300 px-2 min-w-[75px] text-center">
              {currentViewDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Column Headers (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-center mb-2">
        {WEEKDAYS.map((dayName) => (
          <div
            key={dayName}
            className="py-1.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-slate-400"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 7-Day Month Grid Cells */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2.5">
        {gridCells.map((cell, idx) => {
          const { isChallengeDay, challengeDayNumber, isToday, isPast, dayOfMonth, isCurrentMonth } = cell;
          const dayLog = getDayLog(challengeDayNumber);
          const isCompleted = Boolean(dayLog?.completed && !dayLog?.isSlip);
          const isSlip = Boolean(dayLog?.isSlip);
          const isCurrentActive = isChallengeDay && challengeDayNumber === activeDayNumber;
          const isTodayPending = isChallengeDay && (isToday || isCurrentActive) && !dayLog?.completed && !dayLog?.isSlip;
          const isMissed = isChallengeDay && isPast && !isToday && !isCurrentActive && challengeDayNumber !== activeDayNumber && !dayLog?.completed && !dayLog?.isSlip;

          // Non-challenge days are dimmed
          if (!isChallengeDay) {
            return (
              <div
                key={idx}
                className={`min-h-[82px] md:min-h-[96px] p-2 rounded-xl flex flex-col justify-between border select-none transition-opacity ${
                  isCurrentMonth
                    ? 'bg-slate-950/30 border-slate-900/60 text-slate-700 opacity-40'
                    : 'bg-transparent border-transparent text-slate-800 opacity-20'
                }`}
              >
                <span className="text-xs font-mono font-medium">{dayOfMonth}</span>
              </div>
            );
          }

          // Inside 21-Day Challenge Frame
          return (
            <div
              key={idx}
              onClick={() => {
                if (dayLog && (isCompleted || isSlip)) {
                  onSelectDay(dayLog);
                } else if (isTodayPending || isCurrentActive) {
                  onQuickCheckIn(challengeDayNumber!);
                } else if (dayLog) {
                  onSelectDay(dayLog);
                }
              }}
              className={`min-h-[82px] md:min-h-[96px] p-2.5 rounded-2xl flex flex-col justify-between border-2 select-none transition-all duration-300 relative group cursor-pointer ${
                // Completed State
                isCompleted
                  ? isQuit
                    ? 'bg-gradient-to-br from-indigo-600/30 via-indigo-950/50 to-blue-950/60 border-indigo-500/60 shadow-lg shadow-indigo-950/40 hover:scale-[1.03]'
                    : 'bg-gradient-to-br from-emerald-500/35 via-emerald-600/20 to-teal-950/50 border-emerald-400 shadow-lg shadow-emerald-950/40 hover:scale-[1.03]'
                  // Slip / Relapse State
                  : isSlip
                  ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-rose-950/30 border-rose-500/70 shadow-lg shadow-rose-950/40 hover:scale-[1.03]'
                  // Today Pending State
                  : isTodayPending
                  ? isQuit
                    ? 'bg-slate-900/90 border-indigo-400 ring-2 ring-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.35)] glow-active scale-[1.02]'
                    : 'bg-slate-900/90 border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.35)] glow-active scale-[1.02]'
                  // Missed Past Day State
                  : isMissed
                  ? 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-500'
                  // Future Day State
                  : 'bg-slate-950/50 border-slate-800/50 opacity-70 hover:opacity-90'
              }`}
            >
              {/* Top Row: Calendar Date & Challenge Day Tag */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold ${
                    isToday ? 'text-white' : isCompleted ? (isQuit ? 'text-indigo-200' : 'text-emerald-200') : 'text-slate-400'
                  }`}
                >
                  {dayOfMonth}
                </span>

                <span
                  className={`text-[9px] md:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md leading-none ${
                    isCompleted
                      ? isQuit
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                      : isSlip
                      ? 'bg-rose-500/20 text-rose-300'
                      : isTodayPending
                      ? isQuit
                        ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-400/50'
                        : 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50'
                      : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  D{challengeDayNumber}
                </span>
              </div>

              {/* Middle Icon / Visual Symbol */}
              <div className="my-1 flex items-center justify-center">
                {isCompleted ? (
                  isQuit ? (
                    <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                      <Shield className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/30 font-bold">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )
                ) : isSlip ? (
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500 text-rose-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : isTodayPending ? (
                  isQuit ? (
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-400 animate-pulse">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )
                ) : isMissed ? (
                  <div className="w-2 h-2 rounded-full bg-amber-500/70" title="Missed day" />
                ) : (
                  <span className="text-[10px] text-slate-700 font-mono">21d</span>
                )}
              </div>

              {/* Bottom State Badge / Note Indicator */}
              <div className="text-center">
                {isCompleted ? (
                  <span className="text-[9px] font-bold text-slate-300 flex items-center justify-center gap-0.5 truncate">
                    {dayLog?.reflection ? (
                      <>
                        <FileText className="w-2.5 h-2.5 flex-shrink-0" />
                        <span className="truncate">Note</span>
                      </>
                    ) : isQuit ? (
                      'Clean'
                    ) : (
                      'Done'
                    )}
                  </span>
                ) : isSlip ? (
                  <span className="text-[9px] font-bold text-rose-400 block truncate">
                    Slip Logged
                  </span>
                ) : isTodayPending ? (
                  <span
                    className={`inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded leading-none ${
                      isQuit
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isQuit ? 'Holding Line' : '+ CHECK IN'}
                  </span>
                ) : isMissed ? (
                  <span className="text-[9px] text-slate-500 font-medium">Missed</span>
                ) : (
                  <span className="text-[9px] text-slate-600 font-medium">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>
            21-Day Span: <strong>{formatFriendlyDate(challenge.startDate)}</strong> →{' '}
            <strong>{formatFriendlyDate(challenge.targetFinishDate || challenge.startDate)}</strong>
          </span>
        </div>

        {/* Dynamic Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          {isQuit ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                Clean (Resisted)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 ring-2 ring-indigo-400/40" />
                Today (Holding Line)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Slip-up (Logged)
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40" />
                Today (Pending)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                Missed
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
