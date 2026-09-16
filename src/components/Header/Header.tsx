import React from 'react';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Shuffle,
  RotateCcw,
  Undo2,
  Timer,
  Play,
  Pause,
  Trophy,
  Zap,
  Gauge,
  Box,
  Maximize,
  Minimize,
} from 'lucide-react';

interface HeaderProps {
  timeMs: number;
  isTimerRunning: boolean;
  isTimerArmed: boolean;
  onToggleTimer: () => void;
  personalBestMs: number | null;
  moveCount: number;
  canUndo: boolean;
  isAnimating: boolean;
  onScramble: () => void;
  onReset: () => void;
  onUndo: () => void;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
  onOpenNotation: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  timeMs,
  isTimerRunning,
  isTimerArmed,
  onToggleTimer,
  personalBestMs,
  moveCount,
  canUndo,
  isAnimating,
  onScramble,
  onReset,
  onUndo,
  speedMs,
  onSpeedChange,
  onOpenNotation,
  isSoundEnabled,
  onToggleSound,
  isFullscreen = false,
  onToggleFullscreen,
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
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-indigo-100/90 px-1.5 sm:px-4 lg:px-6 py-1 sm:py-2 flex items-center justify-between gap-1 sm:gap-2 flex-shrink-0 z-30 shadow-2xs">
      {/* 1. Brand Logo & Title */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 flex-shrink-0 border-b-2 border-indigo-800">
          <Box className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
        <div className="flex items-center gap-1">
          <h1 className="text-xs sm:text-base font-black tracking-tight bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 bg-clip-text text-transparent font-sans">
            CubeSolve
          </h1>
          <span className="hidden sm:inline-flex px-1 py-0.2 text-[8px] font-black rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-violet-500/15 text-indigo-700 border border-indigo-200 uppercase">
            3D
          </span>
        </div>
      </div>

      {/* 2. Core Game Action Buttons & Interactive Stopwatch */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-center flex-shrink-0">
        {/* Shuffle Button - Always Primary & Visible on Mobile */}
        <button
          onClick={onScramble}
          disabled={isAnimating}
          className="btn-game-orange flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-[11px] sm:text-xs tracking-wide disabled:opacity-50 cursor-pointer select-none flex-shrink-0 shadow-xs"
          title="Shuffle cube randomly (Spacebar)"
        >
          <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
          <span className="leading-none">SHUFFLE</span>
          <span className="hidden lg:inline-block px-1 py-0.2 rounded bg-amber-700/60 text-[8px] font-mono text-amber-100">
            SPACE
          </span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={isAnimating}
          className="btn-game-rose flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-b from-white to-rose-50 text-rose-700 border border-rose-200 text-[10px] sm:text-xs font-black transition-all cursor-pointer select-none flex-shrink-0"
          title="Reset cube to solved"
        >
          <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-600" />
          <span className="hidden xs:inline">RESET</span>
        </button>

        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo || isAnimating}
          className="btn-game-slate flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-b from-white to-slate-50 text-slate-700 border border-slate-300 text-[10px] sm:text-xs font-black transition-all disabled:opacity-40 cursor-pointer select-none flex-shrink-0"
          title="Undo last move (Ctrl+Z)"
        >
          <Undo2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500" />
          <span className="hidden xs:inline">UNDO</span>
        </button>

        {/* Interactive Stopwatch Button */}
        <button
          onClick={onToggleTimer}
          className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer select-none flex-shrink-0 ${
            isTimerRunning
              ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-400 text-emerald-950 shadow-xs'
              : isTimerArmed
              ? 'bg-amber-50 hover:bg-amber-100 border-amber-400 text-amber-950 animate-pulse'
              : timeMs > 0
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
          title={isTimerRunning ? 'Click to Pause Stopwatch' : 'Click to Start Stopwatch'}
        >
          {isTimerRunning ? (
            <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 animate-pulse" />
          ) : isTimerArmed ? (
            <Timer className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" />
          ) : timeMs > 0 ? (
            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600" />
          ) : (
            <Timer className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
          )}

          <div className="flex flex-col items-start leading-none">
            <span className="font-mono text-[10px] sm:text-sm font-black tracking-tight">{formatTime(timeMs)}</span>
            <span className="text-[6px] sm:text-[8px] uppercase font-black tracking-wider text-slate-400 mt-0.5">
              {isTimerRunning ? 'PAUSE' : isTimerArmed ? 'READY' : timeMs > 0 ? 'RESUME' : 'START'}
            </span>
          </div>
        </button>

        {/* Personal Best (PB) */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-300 text-amber-950 flex-shrink-0">
          <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 flex-shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="font-mono text-[10px] sm:text-xs font-black">
              {personalBestMs !== null ? formatTime(personalBestMs) : '--:--'}
            </span>
            <span className="text-[6px] sm:text-[7px] uppercase font-black text-amber-800/80 mt-0.5">PB</span>
          </div>
        </div>

        {/* Move Count & TPS */}
        <div className="hidden md:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-slate-900 flex-shrink-0">
          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 flex-shrink-0" />
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline gap-0.5">
              <span className="font-mono text-[10px] sm:text-xs font-black">{moveCount}</span>
              <span className="text-[7px] sm:text-[8px] text-slate-400 font-bold">({tps}/s)</span>
            </div>
            <span className="text-[6px] sm:text-[7px] uppercase font-black text-slate-400 mt-0.5">TURNS</span>
          </div>
        </div>

        {/* Speed Dial */}
        <div className="hidden lg:flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg sm:rounded-xl border border-slate-200 flex-shrink-0">
          <Gauge className="w-2.5 h-2.5 text-slate-400 ml-0.5 mr-0.5 hidden sm:inline" />
          {[
            { label: '0.8s', value: 800 },
            { label: '0.5s', value: 500 },
            { label: '0.3s', value: 300 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => onSpeedChange(item.value)}
              className={`px-1 sm:px-1.5 py-0.5 rounded-md font-mono text-[8px] sm:text-[9px] font-black transition-all cursor-pointer ${
                speedMs === item.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs'
                  : 'hover:bg-white text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Utility Actions: Fullscreen, Guide, Sound */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        {/* Fullscreen Button */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="btn-game-slate p-1 sm:px-2 sm:py-1 rounded-lg sm:rounded-xl bg-gradient-to-b from-white to-slate-50 text-slate-700 border border-slate-300 text-[10px] sm:text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1"
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" /> : <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
          </button>
        )}

        {/* Notation Guide Button */}
        <button
          onClick={onOpenNotation}
          className="btn-game-blue p-1 sm:px-2 sm:py-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-900 border border-indigo-200 text-[10px] sm:text-xs font-black tracking-wide transition-all cursor-pointer select-none flex items-center gap-1"
          title="Open Notation Guide (N)"
          aria-label="Notation Guide"
        >
          <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 flex-shrink-0" />
          <span className="hidden sm:inline">Guide</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1 sm:p-1.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer select-none ${
            isSoundEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
              : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600'
          }`}
          title={isSoundEnabled ? 'Sound Enabled' : 'Sound Muted'}
          aria-label="Toggle Sound Effects"
        >
          {isSoundEnabled ? <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        </button>
      </div>
    </header>
  );
};



