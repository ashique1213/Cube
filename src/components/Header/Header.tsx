import React from 'react';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Shuffle,
  RotateCcw,
  Undo2,
  Timer,
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
    <header className="w-full bg-white/95 backdrop-blur-md border-b-2 border-indigo-100/90 px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3 flex-shrink-0 z-30 shadow-xs">
      {/* 1. Brand Logo & Title */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 flex-shrink-0 border-b-2 border-indigo-800">
          <Box className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 bg-clip-text text-transparent font-sans">
            CubeSolve
          </h1>
          <span className="hidden xl:inline-flex px-2 py-0.5 text-[9px] font-black rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-violet-500/15 text-indigo-700 border border-indigo-200 uppercase">
            Interactive 3D
          </span>
        </div>
      </div>

      {/* 2. All Shuffle, Controls & Game HUD integrated in Nav */}
      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {/* Shuffle [Space] Button */}
        <button
          onClick={onScramble}
          disabled={isAnimating}
          className="btn-game-orange flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs tracking-wide disabled:opacity-50 cursor-pointer select-none"
          title="Shuffle cube randomly (Spacebar)"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>SHUFFLE</span>
          <span className="hidden md:inline-block px-1.5 py-0.2 rounded bg-amber-700/60 text-[8px] font-mono text-amber-100">
            SPACE
          </span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={isAnimating}
          className="btn-game-rose flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-white to-rose-50 text-rose-700 border border-rose-200 text-xs font-black transition-all cursor-pointer select-none"
          title="Reset cube to solved"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span className="hidden sm:inline">RESET</span>
        </button>

        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo || isAnimating}
          className="btn-game-slate flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-white to-slate-50 text-slate-700 border border-slate-300 text-xs font-black transition-all disabled:opacity-40 cursor-pointer select-none"
          title="Undo last move (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">UNDO</span>
        </button>

        {/* Live Stopwatch Display */}
        <div
          className={`flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border transition-all ${
            isTimerRunning
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
              : isTimerArmed
              ? 'bg-amber-50 border-amber-400 text-amber-950 animate-pulse'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <Timer
            className={`w-3.5 h-3.5 ${
              isTimerRunning ? 'text-emerald-600' : isTimerArmed ? 'text-amber-600' : 'text-slate-400'
            }`}
          />
          <div className="flex flex-col">
            <span className="font-mono text-xs sm:text-sm font-black leading-none">{formatTime(timeMs)}</span>
            <span className="text-[8px] uppercase font-black text-slate-400">
              {isTimerRunning ? 'RUNNING' : isTimerArmed ? 'READY (TURN)' : 'STOPWATCH'}
            </span>
          </div>
        </div>

        {/* Personal Best (PB) */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-950">
          <Trophy className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-mono text-xs font-black leading-none">
              {personalBestMs !== null ? formatTime(personalBestMs) : '--:--.--'}
            </span>
            <span className="text-[8px] uppercase font-black text-amber-800/80">BEST (PB)</span>
          </div>
        </div>

        {/* Move Count & TPS */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
          <Zap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xs font-black leading-none">{moveCount}</span>
              <span className="text-[9px] text-slate-400 font-bold">({tps}/s)</span>
            </div>
            <span className="text-[8px] uppercase font-black text-slate-400">TURNS</span>
          </div>
        </div>

        {/* Speed Dial */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <Gauge className="w-3 h-3 text-slate-400 ml-1 mr-0.5" />
          {[
            { label: '0.8s', value: 800 },
            { label: '0.5s', value: 500 },
            { label: '0.3s', value: 300 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => onSpeedChange(item.value)}
              className={`px-1.5 py-0.5 rounded-lg font-mono text-[9px] font-black transition-all cursor-pointer ${
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

      {/* 3. Utility Actions: Fullscreen, Notation Guide, Sound Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Fullscreen Button */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="btn-game-slate flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-white to-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer select-none"
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-slate-600" /> : <Maximize className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden xl:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
          </button>
        )}

        {/* Notation Guide Button */}
        <button
          onClick={onOpenNotation}
          className="btn-game-blue flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-black tracking-wide transition-all cursor-pointer select-none"
          title="Open Notation Guide (N)"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span className="hidden sm:inline">Guide [N]</span>
          <span className="sm:hidden">Guide</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-xl border transition-all cursor-pointer select-none ${
            isSoundEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
              : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600'
          }`}
          title={isSoundEnabled ? 'Sound Enabled' : 'Sound Muted'}
          aria-label="Toggle Sound Effects"
        >
          {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};


