import React, { useState } from 'react';
import type { Challenge } from '../types/challenge';
import { Trophy, CheckCircle2, Sparkles, Copy, Check, Download, PlusCircle, X, Calendar } from 'lucide-react';

interface CompletionSummaryModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onNewChallenge: () => void;
  onReBlastConfetti: () => void;
}

export const CompletionSummaryModal: React.FC<CompletionSummaryModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onNewChallenge,
  onReBlastConfetti,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const completedDays = challenge.days.filter((d) => d.completed);
  const easyCount = completedDays.filter((d) => d.effort === 'easy').length;
  const normalCount = completedDays.filter((d) => d.effort === 'normal' || !d.effort).length;
  const toughCount = completedDays.filter((d) => d.effort === 'tough').length;

  const generateMarkdownSummary = () => {
    let md = `# 🏆 21-Day Habit Challenge Completed: ${challenge.title}\n\n`;
    md += `> **Trigger / Cue:** ${challenge.cue}\n`;
    md += `> **Start Date:** ${challenge.startDate}\n`;
    md += `> **Completion Rate:** ${completedDays.length} / 21 Days (100%)\n`;
    md += `> **Effort Breakdown:** 🟢 ${easyCount} Easy | 🟡 ${normalCount} Normal | 🔴 ${toughCount} Tough\n\n`;
    md += `## 📜 21-Day Journey Reflections\n\n`;

    challenge.days.forEach((day) => {
      const dateStr = day.completedAt
        ? new Date(day.completedAt).toLocaleDateString()
        : 'Completed';
      const effortBadge = day.effort ? `[${day.effort.toUpperCase()}]` : '';
      const note = day.reflection || 'No note written';
      md += `- **Day ${day.dayNumber}** (${dateStr}) ${effortBadge}: ${note}\n`;
    });

    md += `\n---\n*Logged locally with 21 DAYS Habit Tracker*`;
    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownSummary();
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownSummary();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `21-days-${challenge.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-slate-900 border border-emerald-500/50 p-6 md:p-10 shadow-2xl shadow-emerald-500/20 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header */}
        <div className="text-center pb-6 border-b border-slate-800 relative">
          <div className="w-20 h-20 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/60 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Trophy className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            21-Day Victory Achieved
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            Habit Identity Solidified!
          </h2>

          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            You showed up for 21 consecutive days of <strong className="text-emerald-300">"{challenge.title}"</strong>. The habit neural wiring is now ingrained into your daily lifestyle.
          </p>

          <button
            onClick={onReBlastConfetti}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer"
          >
            🎉 Blast Confetti Again
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-b border-slate-800 text-center">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-[11px] text-slate-500 font-medium">Days Completed</p>
            <p className="text-xl font-extrabold text-emerald-400">21 / 21</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-[11px] text-slate-500 font-medium">Flow (Easy)</p>
            <p className="text-xl font-extrabold text-emerald-300">{easyCount} Days</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-[11px] text-slate-500 font-medium">Normal Effort</p>
            <p className="text-xl font-extrabold text-blue-300">{normalCount} Days</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-[11px] text-slate-500 font-medium">Overcame Resistance</p>
            <p className="text-xl font-extrabold text-amber-300">{toughCount} Days</p>
          </div>
        </div>

        {/* 21-Day Timeline Scrollable List */}
        <div className="flex-1 overflow-y-auto py-5 space-y-2.5 pr-1">
          <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2">
            21-Day Reflection Timeline
          </h4>

          <div className="space-y-2">
            {challenge.days.map((day) => {
              const formattedDate = day.completedAt
                ? new Date(day.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : `Day ${day.dayNumber}`;

              return (
                <div
                  key={day.dayNumber}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs flex-shrink-0">
                    {day.dayNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formattedDate}
                      </span>

                      {day.effort && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            day.effort === 'easy'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : day.effort === 'tough'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {day.effort}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 italic">
                      {day.reflection ? `"${day.reflection}"` : 'Habit executed successfully.'}
                    </p>
                  </div>

                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyMarkdown}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Markdown' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export .md</span>
            </button>
          </div>

          <button
            onClick={onNewChallenge}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start Next 21-Day Habit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
