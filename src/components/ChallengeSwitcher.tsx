import React from 'react';
import type { Challenge } from '../types/challenge';
import { calculateChallengeStats } from '../hooks/usePersonalChallenge';
import { Plus, Flame, CheckCircle, LayoutGrid, Sparkles, BookOpen, Droplets, Apple, Footprints, Zap, Target } from 'lucide-react';

interface ChallengeSwitcherProps {
  challenges: Challenge[];
  activeChallengeId: string | null;
  viewMode: 'single' | 'overview';
  onSelectChallenge: (id: string) => void;
  onSelectOverview: () => void;
  onOpenCreateModal: () => void;
}

export const ChallengeSwitcher: React.FC<ChallengeSwitcherProps> = ({
  challenges,
  activeChallengeId,
  viewMode,
  onSelectChallenge,
  onSelectOverview,
  onOpenCreateModal,
}) => {
  const getHabitIcon = (iconName?: string, category?: string) => {
    const key = (iconName || category || '').toLowerCase();
    if (key.includes('book') || key.includes('read') || key.includes('mindset')) {
      return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
    }
    if (key.includes('drop') || key.includes('shower') || key.includes('water')) {
      return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (key.includes('apple') || key.includes('sugar') || key.includes('food') || key.includes('health')) {
      return <Apple className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (key.includes('foot') || key.includes('step') || key.includes('walk') || key.includes('fitness')) {
      return <Footprints className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (key.includes('zap') || key.includes('focus') || key.includes('work')) {
      return <Zap className="w-3.5 h-3.5 text-violet-400" />;
    }
    if (key.includes('spark') || key.includes('meditat')) {
      return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    }
    return <Target className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="w-full bg-slate-950/80 border-b border-slate-800/80 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Scrollable list of tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pr-2 flex-1">
          {/* Tab: Overview Mode */}
          <button
            onClick={onSelectOverview}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
              viewMode === 'overview'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            <span>All Habits</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-extrabold">
              {challenges.length}
            </span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 flex-shrink-0 mx-1" />

          {/* Individual Challenge Tabs */}
          {challenges.map((chal) => {
            const stats = calculateChallengeStats(chal);
            const isActive = viewMode === 'single' && chal.id === activeChallengeId;

            return (
              <button
                key={chal.id}
                onClick={() => onSelectChallenge(chal.id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 cursor-pointer max-w-[210px] ${
                  isActive
                    ? 'bg-slate-900 text-white border-2 border-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex-shrink-0">
                  {getHabitIcon(chal.iconName, chal.category)}
                </div>

                <span className="truncate text-xs font-medium text-slate-200">
                  {chal.title}
                </span>

                {/* Progress Pill / Indicator */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-800/90 px-1.5 py-0.5 rounded-md">
                    {stats.completedCount}/21
                  </span>

                  {stats.isTodayDone ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-400/80 animate-pulse flex-shrink-0"
                      title="Pending today's check-in"
                    />
                  )}

                  {stats.streak > 0 && (
                    <span className="text-[10px] text-amber-400/90 font-bold flex items-center">
                      <Flame className="w-2.5 h-2.5" />
                      {stats.streak}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action: + New Challenge */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold transition-all flex-shrink-0 shadow-sm shadow-emerald-500/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">New Challenge</span>
        </button>
      </div>
    </div>
  );
};
