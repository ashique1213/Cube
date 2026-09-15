import React from 'react';
import { Shuffle, RotateCcw, Undo2, Timer, Zap, Trophy, Gauge } from 'lucide-react';

interface GameHUDProps {
  timeMs: number;
  isTimerRunning: boolean;
  isTimerArmed: boolean;
  personalBestMs: number | null;
  moveCount: number;
  canUndo: boolean;
  isAnimating: boolean;
  onScramble: () => void;
  onReset: () => void;
  onUndo: () => void;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  timeMs,
  isTimerRunning,
  isTimerArmed,
  personalBestMs,
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

  const tps = timeMs > 0 ? (moveCount / (timeMs / 1000)).toFixed(1) : '0.0';

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-indigo-100/90 p-2.5 sm:p-3 shadow-md shadow-indigo-500/5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
      {/* 1. Shuffle & Quick Actions with 3D tactile buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onScramble}
          disabled={isAnimating}
          className="btn-game-orange flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs sm:text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none"
          title="Shuffle cube randomly (Spacebar)"
        >
          <Shuffle className="w-4 h-4" />
          <span>SHUFFLE</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-amber-700/60 text-[9px] font-mono tracking-tighter text-amber-100">
            SPACE
          </span>
        </button>

        <button
          onClick={onReset}
          disabled={isAnimating}
          className="btn-game-rose flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-b from-white to-rose-50 hover:to-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all disabled:opacity-40 cursor-pointer select-none"
          title="Reset cube to solved"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span className="hidden sm:inline">RESET</span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo || isAnimating}
          className="btn-game-slate flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-b from-white to-slate-50 hover:to-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 border border-slate-300 transition-all cursor-pointer select-none"
          title="Undo last move (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">UNDO</span>
          <span className="hidden md:inline-block px-1 py-0.2 rounded bg-slate-200 text-[8px] font-mono text-slate-600">
            Z
          </span>
        </button>
      </div>

      {/* 2. Center: Arcade Stopwatch & Stats */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Timer Display */}
        <div
          className={`flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 rounded-xl border-2 transition-all ${
            isTimerRunning
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400 text-emerald-950 shadow-sm shadow-emerald-500/20'
              : isTimerArmed
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-400 text-amber-950 animate-pulse shadow-sm shadow-amber-500/20'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <Timer
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isTimerRunning ? 'text-emerald-600' : isTimerArmed ? 'text-amber-600' : 'text-slate-400'
            }`}
          />
          <div className="flex flex-col">
            <span className="font-mono text-base sm:text-lg font-black tracking-tight leading-none">
              {formatTime(timeMs)}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-0.5">
              {isTimerRunning ? 'RUNNING' : isTimerArmed ? 'READY (TURN FACE)' : 'STOPWATCH'}
            </span>
          </div>
        </div>

        {/* Personal Best Record */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-300 text-amber-950">
          <Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-mono text-xs sm:text-sm font-black tracking-tight leading-none">
              {personalBestMs !== null ? formatTime(personalBestMs) : '--:--.--'}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800/80 mt-0.5">
              BEST (PB)
            </span>
          </div>
        </div>

        {/* Move Counter & Speed TPS */}
        <div className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
          <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xs sm:text-sm font-black leading-none">{moveCount}</span>
              <span className="text-[10px] text-slate-400 font-bold">({tps}/s)</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-0.5">
              TURNS
            </span>
          </div>
        </div>
      </div>

      {/* 3. Right: Animation Speed Dial */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <span className="flex items-center gap-1 px-1.5 text-slate-400 text-[10px] uppercase font-black">
          <Gauge className="w-3 h-3" />
          <span className="hidden sm:inline">Speed:</span>
        </span>
        {[
          { label: '0.8s', value: 800 },
          { label: '0.5s', value: 500 },
          { label: '0.3s', value: 300 },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => onSpeedChange(item.value)}
            className={`px-2 py-1 rounded-lg font-mono text-[10px] font-black transition-all cursor-pointer ${
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
