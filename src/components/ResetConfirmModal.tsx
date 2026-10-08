import React, { useState } from 'react';
import { AlertTriangle, Archive, Trash2, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  challengeTitle?: string;
  onClose: () => void;
  onConfirm: (archiveFirst: boolean) => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  challengeTitle,
  onClose,
  onConfirm,
}) => {
  const [archive, setArchive] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-extrabold text-white mb-2">
          Reset {challengeTitle ? `"${challengeTitle}"` : 'Challenge'}?
        </h3>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Are you sure you want to remove or restart this habit challenge? Your other active challenges will remain completely untouched.
        </p>

        <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-6 cursor-pointer hover:border-slate-700 transition-colors">
          <input
            type="checkbox"
            checked={archive}
            onChange={(e) => setArchive(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500"
          />
          <div className="flex-1 text-left">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-emerald-400" />
              Save to Archives first
            </span>
            <span className="text-[11px] text-slate-500 block">
              Keep your reflection notes accessible in the history drawer
            </span>
          </div>
        </label>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Keep Challenge
          </button>

          <button
            type="button"
            onClick={() => onConfirm(archive)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
