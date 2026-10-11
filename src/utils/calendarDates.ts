export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  return new Date(dateStr);
}

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getTodayString(): string {
  return formatLocalDate(new Date());
}

export function calculateTargetFinishDate(startDateStr: string): string {
  const start = parseLocalDate(startDateStr);
  const finish = addDays(start, 20); // 21 days total (day 0 through 20)
  return formatLocalDate(finish);
}

export function formatFriendlyDate(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export interface CalendarDayCell {
  date: Date;
  dateString: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  challengeDayNumber?: number; // 1 to 21 if inside challenge
  isChallengeDay: boolean;
}

/**
 * Generates Monday-first month grid (columns: Mon, Tue, Wed, Thu, Fri, Sat, Sun)
 */
export function generateMonthGrid(
  year: number,
  month: number, // 0-indexed
  challengeStartDateStr: string
): CalendarDayCell[] {
  const challengeFinishDateStr = calculateTargetFinishDate(challengeStartDateStr);
  const todayStr = getTodayString();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Monday = 0, Tuesday = 1, ..., Sunday = 6
  let firstDayDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (firstDayDayOfWeek === -1) firstDayDayOfWeek = 6; // Sunday becomes index 6

  const cells: CalendarDayCell[] = [];

  // Previous month trailing days
  for (let i = firstDayDayOfWeek; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i);
    const dateString = formatLocalDate(prevDate);
    cells.push(createCell(prevDate, dateString, false, challengeStartDateStr, challengeFinishDateStr, todayStr));
  }

  // Current month days
  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    const curDate = new Date(year, month, d);
    const dateString = formatLocalDate(curDate);
    cells.push(createCell(curDate, dateString, true, challengeStartDateStr, challengeFinishDateStr, todayStr));
  }

  // Next month leading days to complete row grid (multiple of 7)
  const remainingCells = 7 - (cells.length % 7);
  if (remainingCells < 7) {
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateString = formatLocalDate(nextDate);
      cells.push(createCell(nextDate, dateString, false, challengeStartDateStr, challengeFinishDateStr, todayStr));
    }
  }

  return cells;
}

function createCell(
  date: Date,
  dateString: string,
  isCurrentMonth: boolean,
  challengeStartDateStr: string,
  challengeFinishDateStr: string,
  todayStr: string
): CalendarDayCell {
  const isChallengeDay = dateString >= challengeStartDateStr && dateString <= challengeFinishDateStr;
  let challengeDayNumber: number | undefined = undefined;

  if (isChallengeDay) {
    const start = parseLocalDate(challengeStartDateStr);
    const cur = parseLocalDate(dateString);
    const diffDays = Math.round((cur.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    challengeDayNumber = diffDays + 1;
  }

  const isToday = dateString === todayStr;
  const isPast = dateString < todayStr;
  const isFuture = dateString > todayStr;

  return {
    date,
    dateString,
    dayOfMonth: date.getDate(),
    isCurrentMonth,
    isToday,
    isPast,
    isFuture,
    challengeDayNumber,
    isChallengeDay,
  };
}
