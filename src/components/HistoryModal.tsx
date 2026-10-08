import React, { useState } from 'react';
import type { Challenge } from '../types/challenge';
import { X, Calendar, ChevronDown, ChevronUp, History, Trophy } from 'lucide-react';

interface HistoryModalProps {
  history: Challenge[];
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ history, isOpen, onClose }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Archived Challenges</h3>
            <p className="text-xs text-slate-400">Your past 21-day milestones and journal logs</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No archived challenges yet. Complete or reset your current challenge to archive.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {history.map((item) => {
              const completedCount = item.days.filter((d) => d.completed).length;
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 transition-all"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        {item.isCompleted && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <Trophy className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Started {item.startDate}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">
                          {completedCount} / 21 Days Done
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                      <p className="text-[11px] text-slate-400 mb-2">
                        <strong>Cue:</strong> {item.cue}
                      </p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {item.days
                          .filter((d) => d.completed)
                          .map((day) => (
                            <div
                              key={day.dayNumber}
                              className="text-xs p-2 rounded-lg bg-slate-900 border border-slate-800/60 flex items-start gap-2"
                            >
                              <span className="font-bold text-emerald-400 flex-shrink-0">
                                Day {day.dayNumber}:
                              </span>
                              <span className="text-slate-300 italic truncate flex-1">
                                {day.reflection || 'Completed'}
                              </span>
                              {day.effort && (
                                <span className="text-[10px] uppercase font-bold text-slate-500">
                                  {day.effort}
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 mt-4 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
