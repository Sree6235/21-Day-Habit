export type HabitEffort = 'easy' | 'normal' | 'tough';
export type HabitType = 'build' | 'quit';
export type CravingLevel = 'low' | 'medium' | 'high';

export interface DayLog {
  dayNumber: number; // 1 to 21
  dateString?: string; // YYYY-MM-DD
  completed: boolean;
  isSlip?: boolean; // For quit habit when user had a slip/relapse
  completedAt?: string; // ISO string or human formatted date
  reflection?: string;
  effort?: HabitEffort; // For build habits
  cravingLevel?: CravingLevel; // For quit habits
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
  habitType: HabitType; // 'build' or 'quit'
  urgeReplacementPlan?: string; // For quit habits: e.g. "When cravings hit: Drink chamomile tea"
  category?: string;
  iconName?: string;
  startDate: string; // YYYY-MM-DD
  targetFinishDate?: string; // YYYY-MM-DD
  createdAt: string;
  days: DayLog[]; // 21 items
  isCompleted: boolean;
  celebratedMilestones: number[]; // e.g. [3, 7, 14, 21]
}

export interface PresetHabit {
  title: string;
  cue: string;
  habitType: HabitType;
  urgeReplacementPlan?: string;
  category: string;
  iconName: string;
  color: string;
}
