import React from 'react';
import { Volume2, VolumeX, BookOpen, Shuffle, RotateCcw, Box, Maximize, Minimize } from 'lucide-react';

interface HeaderProps {
  onOpenNotation: () => void;
  onResetCube: () => void;
  onScrambleCube: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  currentStepId?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotation,
  onResetCube,
  onScrambleCube,
  isSoundEnabled,
  onToggleSound,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b-2 border-indigo-100/90 px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 flex-shrink-0 z-30 shadow-xs">
      {/* Brand: CubeSolve with 3D tactile gaming icon */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 flex-shrink-0 border-b-2 border-indigo-800 active:translate-y-0.5">
          <Box className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-900 bg-clip-text text-transparent truncate font-sans">
              CubeSolve
            </h1>
            <span className="hidden md:inline-flex px-2 py-0.5 text-[9px] font-black rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-violet-500/15 text-indigo-700 border border-indigo-200 uppercase flex-shrink-0">
              Interactive 3D
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-bold leading-tight hidden sm:block truncate">
            Playful 3D Rubik's Cube arcade simulator & manual speed solver
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Fullscreen Button */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="btn-game-slate flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-white to-slate-50 hover:to-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer select-none"
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-slate-600" /> : <Maximize className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        )}

        {/* Notation Guide Button */}
        <button
          onClick={onOpenNotation}
          className="btn-game-blue flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-black tracking-wide transition-all cursor-pointer select-none"
          title="Open Notation Guide (N)"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span className="hidden sm:inline">Guide [N]</span>
          <span className="sm:hidden">Notation</span>
        </button>

        {/* Scramble Button */}
        <button
          onClick={onScrambleCube}
          className="btn-game-orange flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black transition-all cursor-pointer select-none"
          title="Scramble cube randomly (Spacebar)"
        >
          <Shuffle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onResetCube}
          className="btn-game-rose flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-white to-rose-50 text-rose-700 border border-rose-200 text-xs font-black transition-all cursor-pointer select-none"
          title="Reset cube to solved"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span className="hidden sm:inline">Reset</span>
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
          {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

