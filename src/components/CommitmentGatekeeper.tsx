import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Lock, Unlock, Zap, ShieldCheck, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/sound';
import confetti from 'canvas-confetti';

interface CommitmentGatekeeperProps {
  mantra: string;
  onUnlock: () => void;
  onBypass: () => void;
  onRefreshMantra: () => void;
}

export const CommitmentGatekeeper: React.FC<CommitmentGatekeeperProps> = ({
  mantra,
  onUnlock,
  onBypass,
  onRefreshMantra,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount and on clicks
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Reset when mantra changes
  useEffect(() => {
    setInputVal('');
    setStartTime(null);
    setTotalKeystrokes(0);
    setErrorCount(0);
    setIsSuccess(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [mantra]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSuccess) return;

    const val = e.target.value;
    if (val.length > mantra.length) return;

    // Start timer on first keystroke
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    // Track errors
    if (val.length > inputVal.length) {
      setTotalKeystrokes((prev) => prev + 1);
      const lastCharIndex = val.length - 1;
      if (val[lastCharIndex] !== mantra[lastCharIndex]) {
        setErrorCount((prev) => prev + 1);
        soundFx.playSoftTap();
      }
    }

    setInputVal(val);

    // Check completion condition: full length and 100% match
    if (val === mantra) {
      setIsSuccess(true);
      soundFx.playMilestone();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
      });

      // Smoothly unlock after 750ms celebratory animation
      setTimeout(() => {
        onUnlock();
      }, 750);
    }
  };

  // Prevent copy & paste
  const handleBlockPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  // Computed typing stats
  const stats = useMemo(() => {
    let correctChars = 0;
    for (let i = 0; i < inputVal.length; i++) {
      if (inputVal[i] === mantra[i]) {
        correctChars++;
      }
    }

    const accuracy =
      totalKeystrokes > 0
        ? Math.max(0, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100))
        : 100;

    let wpm = 0;
    if (startTime && inputVal.length > 0) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0.01) {
        wpm = Math.round(correctChars / 5 / elapsedMinutes);
      }
    }

    const progress = Math.round((inputVal.length / mantra.length) * 100);

    return { accuracy, wpm, progress, correctChars };
  }, [inputVal, mantra, startTime, totalKeystrokes, errorCount]);

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 z-50 bg-[#080c14] text-slate-100 flex flex-col justify-between items-center px-4 py-8 md:py-12 select-none overflow-y-auto transition-opacity duration-700 ${
        isSuccess ? 'opacity-90 scale-[0.99]' : 'opacity-100'
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-2xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            {isSuccess ? (
              <Unlock className="w-4 h-4 text-emerald-400 animate-bounce" />
            ) : (
              <Lock className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <span className="font-extrabold text-xs tracking-widest text-slate-300 uppercase">
            21 DAYS <span className="text-emerald-400">FOCUS GATE</span>
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRefreshMantra();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer"
          title="Switch to another mantra"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>New Prompt</span>
        </button>
      </div>

      {/* Central Interactive Typing Arena */}
      <div className="w-full max-w-2xl my-auto py-8 z-10 flex flex-col items-center">
        {/* Instruction Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 mb-6 shadow-md">
          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
          <span>Type your commitment to unlock today's cockpit</span>
        </div>

        {/* The Monkeytype-style Text Box */}
        <div className="w-full relative bg-slate-900/60 border-2 border-slate-800/90 hover:border-slate-700/80 focus-within:border-emerald-500/60 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl transition-all cursor-text group">
          {/* Real Hidden HTML Input to capture typing safely without copy-paste */}
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={handleChange}
            onPaste={handleBlockPaste}
            onCopy={handleBlockPaste}
            onCut={handleBlockPaste}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="absolute inset-0 w-full h-full opacity-0 cursor-text pointer-events-auto"
            aria-label="Type commitment mantra"
          />

          {/* Visual Rendered Characters */}
          <div className="font-mono text-lg md:text-2xl leading-relaxed tracking-wide text-left flex flex-wrap gap-y-1">
            {mantra.split('').map((char, index) => {
              const isTyped = index < inputVal.length;
              const isCurrent = index === inputVal.length;
              const isCorrect = isTyped && inputVal[index] === char;
              const isWrong = isTyped && inputVal[index] !== char;

              let charClass = 'text-slate-600 transition-colors';
              if (isCorrect) {
                charClass = 'text-emerald-400 font-bold';
              } else if (isWrong) {
                charClass =
                  'text-rose-400 font-bold bg-rose-500/25 rounded-xs underline decoration-rose-500';
              }

              return (
                <span key={index} className="relative inline-block">
                  {/* Blinking Caret at Current Position */}
                  {isCurrent && (
                    <span className="absolute -left-[1px] top-1 bottom-1 w-[2.5px] bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] pointer-events-none" />
                  )}
                  <span className={charClass}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Bottom helper text inside box */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy/paste disabled • 100% accuracy required</span>
            </span>
            <span className="font-mono text-slate-400">
              {inputVal.length} / {mantra.length}
            </span>
          </div>
        </div>

        {/* Live Metrics: Speed, Accuracy, Progress */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Speed</p>
            <p className="text-xl font-black text-white font-mono mt-0.5">
              {stats.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Accuracy</p>
            <p
              className={`text-xl font-black font-mono mt-0.5 ${
                stats.accuracy === 100 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {stats.accuracy}%
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Progress</p>
            <p className="text-xl font-black text-emerald-300 font-mono mt-0.5">
              {stats.progress}%
            </p>
          </div>
        </div>

        {/* Success Banner when unlocked */}
        {isSuccess && (
          <div className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Commitment Confirmed! Unlocking Your Cockpit...</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Footer / Bypass link */}
      <div className="z-10 text-center space-y-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBypass();
          }}
          className="text-xs text-slate-500 hover:text-slate-300 hover:underline transition-colors cursor-pointer"
        >
          Need quick access? Bypass gate for 10 minutes
        </button>
        <p className="text-[10px] text-slate-600">
          Typing unlocks cockpit for the entire day. Reset daily for intentional focus.
        </p>
      </div>
    </div>
  );
};
