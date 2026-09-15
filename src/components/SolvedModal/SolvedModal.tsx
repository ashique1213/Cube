import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, X, CheckCircle2, Award } from 'lucide-react';
import { soundEngine } from '../../engine/soundEffects';

interface SolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolveAgain: () => void;
  timeMs?: number;
  moveCount?: number;
  isNewBest?: boolean;
  personalBestMs?: number | null;
}

export const SolvedModal: React.FC<SolvedModalProps> = ({
  isOpen,
  onClose,
  onSolveAgain,
  timeMs = 0,
  moveCount = 0,
  isNewBest = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playVictory();

      // Launch vibrant confetti bursts
      const count = 220;
      const defaults = {
        origin: { y: 0.65 },
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

  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((timeMs % 1000) / 10);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  const tps = timeMs > 0 ? (moveCount / (timeMs / 1000)).toFixed(1) : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white border-2 border-indigo-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-4 text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon with 3D Ring */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-xl shadow-amber-500/35 border-b-4 border-amber-600">
          <Trophy className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-sm" />
        </div>

        {/* Congratulatory Text */}
        <div className="space-y-1.5">
          {isNewBest ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30 animate-bounce">
              <Award className="w-4 h-4" />
              <span>NEW PERSONAL BEST!</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cube Solved!</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 bg-clip-text text-transparent tracking-tight font-sans">
            VICTORY!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            You successfully solved the 3×3 Rubik's Cube with authentic manual turns.
          </p>
        </div>

        {/* Solve Stats summary */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl border border-slate-200 text-xs shadow-2xs">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] uppercase font-black">Solve Time</span>
            <span className="font-black text-emerald-700 text-base font-mono mt-0.5">{formattedTime}</span>
          </div>
          <div className="flex flex-col border-x border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-black">Total Moves</span>
            <span className="font-black text-blue-700 text-base font-mono mt-0.5">{moveCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] uppercase font-black">Speed (TPS)</span>
            <span className="font-black text-slate-900 text-base font-mono mt-0.5">{tps} /s</span>
          </div>
        </div>

        {/* Poki Tactile Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={onSolveAgain}
            className="btn-game-orange w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <RotateCcw className="w-4 h-4" />
            <span>SHUFFLE & SOLVE AGAIN</span>
          </button>

          <button
            onClick={onClose}
            className="btn-game-slate w-full py-2.5 px-3 rounded-xl bg-gradient-to-b from-white to-slate-100 text-slate-700 text-xs font-black transition-all border border-slate-300 shadow-2xs cursor-pointer select-none"
          >
            INSPECT 3D CUBE
          </button>
        </div>
      </div>
    </div>
  );
};

