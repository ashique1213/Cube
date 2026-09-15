import React from 'react';
import { Volume2, VolumeX, BookOpen, Shuffle, RotateCcw, Box } from 'lucide-react';

interface HeaderProps {
  onOpenNotation: () => void;
  onResetCube: () => void;
  onScrambleCube: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  currentStepId?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotation,
  onResetCube,
  onScrambleCube,
  isSoundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="w-full bg-white/85 backdrop-blur-md border-b border-indigo-100/80 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 flex-shrink-0 z-30 shadow-xs">
      {/* Title & Brand with Gradient */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
          <Box className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent truncate">
              3×3 RUBIK'S CUBE SIMULATOR
            </h1>
            <span className="hidden md:inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 text-indigo-700 border border-indigo-200/80 uppercase flex-shrink-0 shadow-2xs">
              Interactive 3D
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight hidden sm:block truncate">
            Shuffle and manually solve with realistic 3D physics & live timer
          </p>
        </div>
      </div>

      {/* Action Controls with Color Gradients */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Notation Guide Button */}
        <button
          onClick={onOpenNotation}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 hover:from-blue-100 hover:via-indigo-100 hover:to-violet-100 text-indigo-900 border border-indigo-200/80 shadow-xs hover:shadow-sm text-xs font-bold tracking-wide transition-all active:scale-95"
          title="Open Notation Guide"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span className="font-mono bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-black hidden sm:inline">U | D | R | L | F | B</span>
          <span className="text-xs font-bold text-indigo-800 sm:hidden">Notation</span>
        </button>

        {/* Scramble Button */}
        <button
          onClick={onScrambleCube}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-200/80 shadow-xs hover:shadow-sm text-xs font-semibold transition-all active:scale-95"
          title="Scramble the cube"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="hidden sm:inline">Scramble</span>
        </button>

        {/* Reset Cube Button */}
        <button
          onClick={onResetCube}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-900 border border-rose-200/80 shadow-xs hover:shadow-sm text-xs font-semibold transition-all active:scale-95"
          title="Reset cube to default"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-xl border transition-all shadow-xs active:scale-95 ${
            isSoundEnabled
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 hover:from-emerald-100 hover:to-teal-100 shadow-emerald-500/10'
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
