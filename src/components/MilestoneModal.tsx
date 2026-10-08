import React from 'react';
import { MILESTONES } from '../utils/milestones';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface MilestoneModalProps {
  day: number | null;
  challengeTitle?: string;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ day, challengeTitle, onClose }) => {
  if (!day || day === 21) return null; // Day 21 has its own Grand Finale summary
  const info = MILESTONES[day];
  if (!info) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 p-6 md:p-8 shadow-2xl shadow-emerald-500/20 text-center">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge emblem */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-widest mb-2">
          {info.badge}
        </div>

        <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
          {info.title}
        </h3>

        {challengeTitle && (
          <p className="text-xs font-bold text-emerald-400/90 mb-2">
            Habit: "{challengeTitle}"
          </p>
        )}

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {info.description}
        </p>

        <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 mb-6 text-xs text-slate-400">
          🔥 Keep up the discipline! Day by day, your future self is coming alive.
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue The Momentum</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
