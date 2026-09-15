import React from 'react';
import { Shuffle, RotateCcw, Undo2, Timer, Zap, Gauge } from 'lucide-react';

interface SolveStatsBarProps {
  timeMs: number;
  isTimerRunning: boolean;
  isTimerArmed: boolean;
  moveCount: number;
  canUndo: boolean;
  isAnimating: boolean;
  onScramble: () => void;
  onReset: () => void;
  onUndo: () => void;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
}

export const SolveStatsBar: React.FC<SolveStatsBarProps> = ({
  timeMs,
  isTimerRunning,
  isTimerArmed,
  moveCount,
  canUndo,
  isAnimating,
  onScramble,
  onReset,
  onUndo,
  speedMs,
  onSpeedChange,
}) => {
  // Format milliseconds into MM:SS.SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-2.5 sm:p-3 shadow-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3">
      {/* Left: Shuffle & Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onScramble}
          disabled={isAnimating}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Scramble the cube with random moves"
        >
          <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Shuffle Cube</span>
        </button>

        <button
          onClick={onReset}
          disabled={isAnimating}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-white to-slate-100 hover:from-rose-50 hover:to-red-100 active:to-red-200 text-slate-700 hover:text-rose-700 text-xs font-semibold border border-slate-300 transition-all shadow-2xs disabled:opacity-40 cursor-pointer"
          title="Reset cube to solved"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>Reset</span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo || isAnimating}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200 active:to-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-all border border-slate-300 shadow-2xs cursor-pointer"
          title="Undo last move"
        >
          <Undo2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Undo</span>
        </button>
      </div>

      {/* Center: Live Timer & Move Counter */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Timer Display */}
        <div
          className={`flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-xl border transition-all ${
            isTimerRunning
              ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-300 text-emerald-950 shadow-xs'
              : isTimerArmed
              ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-300 text-amber-950 animate-pulse'
              : 'bg-gradient-to-b from-slate-50 to-slate-100/60 border-slate-200/90 text-slate-900 shadow-2xs'
          }`}
        >
          <Timer
            className={`w-4 h-4 ${
              isTimerRunning
                ? 'text-emerald-600'
                : isTimerArmed
                ? 'text-amber-600'
                : 'text-slate-500'
            }`}
          />
          <div className="flex flex-col">
            <span className="font-mono text-sm sm:text-base font-bold tracking-tight">
              {formatTime(timeMs)}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
              {isTimerRunning ? 'Solving...' : isTimerArmed ? 'Ready (Turn face)' : 'Solve Time'}
            </span>
          </div>
        </div>

        {/* Move Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/60 border border-slate-200/90 text-slate-900 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-mono text-sm sm:text-base font-bold tracking-tight">
              {moveCount}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
              Moves
            </span>
          </div>
        </div>
      </div>

      {/* Right: Animation Speed Toggle */}
      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-gradient-to-b from-slate-50 to-slate-100/60 p-1 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="flex items-center gap-1 px-1.5 text-slate-400 text-[10px] uppercase font-bold">
          <Gauge className="w-3 h-3" />
          <span>Speed:</span>
        </span>
        {[
          { label: '0.8s', value: 800 },
          { label: '0.5s', value: 500 },
          { label: '0.3s', value: 300 },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => onSpeedChange(item.value)}
            className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer ${
              speedMs === item.value
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'hover:bg-white text-slate-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
