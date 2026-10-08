export type HabitEffort = 'easy' | 'normal' | 'tough';

export interface DayLog {
  dayNumber: number; // 1 to 21
  completed: boolean;
  completedAt?: string; // ISO string or human formatted date
  reflection?: string;
  effort?: HabitEffort;
}

export interface MilestoneInfo {
  day: number;
  badge: string;
  title: string;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  cue: string;
  category?: string;
  iconName?: string;
  startDate: string; // YYYY-MM-DD
  createdAt: string;
  days: DayLog[]; // 21 items
  isCompleted: boolean;
  celebratedMilestones: number[]; // e.g. [3, 7, 14, 21]
}

export interface PresetHabit {
  title: string;
  cue: string;
  category: string;
  iconName: string;
  color: string;
}
