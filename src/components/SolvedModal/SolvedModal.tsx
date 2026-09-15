import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, X, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../engine/soundEffects';

interface SolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolveAgain: () => void;
}

export const SolvedModal: React.FC<SolvedModalProps> = ({
  isOpen,
  onClose,
  onSolveAgain,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playVictory();

      // Launch vibrant confetti bursts
      const count = 180;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#ffd500', '#dc2626', '#16a34a'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#2563eb', '#ff5800', '#3b82f6'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xl text-center space-y-4 text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Congratulatory Text (clean, no emojis) */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mission Accomplished</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
            Cube Solved
          </h2>
          <p className="text-xs text-slate-600">
            Congratulations! You have successfully solved the 3×3 Rubik's Cube step-by-step using interactive 3D algorithms.
          </p>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-xl border border-slate-200/90 text-xs shadow-2xs">
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">Stages</div>
            <div className="font-bold text-slate-900 text-sm">10 / 10</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">Method</div>
            <div className="font-bold text-blue-700 text-sm">LBL</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">Physics</div>
            <div className="font-bold text-emerald-700 text-sm">Real 3D</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onSolveAgain}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Solve Again from Step 1</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all border border-slate-300 shadow-2xs"
          >
            Inspect 3D Cube
          </button>
        </div>
      </div>
    </div>
  );
};
