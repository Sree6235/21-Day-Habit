import type { MilestoneInfo } from '../types/challenge';

export const MILESTONES: Record<number, MilestoneInfo> = {
  3: {
    day: 3,
    badge: '⚡ The Spark',
    title: '3-Day Momentum Unlocked!',
    description: 'You overcame the initial inertia! Psychology shows day 3 is the critical hurdle where most people quit.',
  },
  7: {
    day: 7,
    badge: '🔥 1-Week Milestone',
    title: 'A Full Week Completed!',
    description: '7 consecutive days of showing up. Your routine is transforming from conscious effort into muscle memory.',
  },
  14: {
    day: 14,
    badge: '🛡️ The Tipping Point',
    title: 'Two-Thirds Mastered!',
    description: '14 days in! Resistance is fading, momentum is on your side, and your future self is thanking you.',
  },
  21: {
    day: 21,
    badge: '👑 Identity Shift Complete',
    title: 'Challenge Mastered: 21 Days of Excellence!',
    description: 'You conquered the 21-Day Habit Challenge! You proved your discipline and forged a new standard for yourself.',
  },
};

export const PRESET_HABITS = [
  {
    title: 'Read 20 pages',
    cue: 'At 7:30 AM right after my morning coffee',
    category: 'Mindset',
    iconName: 'BookOpen',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
  },
  {
    title: 'Cold shower 2 min',
    cue: 'Immediately upon waking up before brushing teeth',
    category: 'Discipline',
    iconName: 'Droplets',
    color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400',
  },
  {
    title: 'No refined sugar',
    cue: 'Whenever cravings strike after 2:00 PM (drink green tea instead)',
    category: 'Health',
    iconName: 'Apple',
    color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
  },
  {
    title: '10,000 steps daily',
    cue: 'During evening commute or after 6:00 PM sunset walk',
    category: 'Fitness',
    iconName: 'Footprints',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
  },
  {
    title: '15-min mindfulness meditation',
    cue: 'At 9:30 PM before bed with lights dimmed',
    category: 'Wellness',
    iconName: 'Sparkles',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
  },
  {
    title: '90-min uninterrupted deep work',
    cue: 'At 8:30 AM phone on airplane mode in another room',
    category: 'Focus',
    iconName: 'Zap',
    color: 'from-violet-500/20 to-indigo-500/20 border-violet-500/30 text-violet-400',
  },
];
