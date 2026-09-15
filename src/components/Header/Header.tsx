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
    <header className="w-full bg-white border-b border-slate-200 px-3 sm:px-5 py-2 flex items-center justify-between gap-2 flex-shrink-0 z-30 shadow-xs">
      {/* Title & Brand */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
          <Box className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-slate-900 truncate">
              3×3 RUBIK'S CUBE SOLVER
            </h1>
            <span className="hidden md:inline-flex px-2 py-0.2 text-[9px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase flex-shrink-0">
              Beginner Guide
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight hidden sm:block truncate">
            Learn to solve step by step with interactive 3D rotations
          </p>
        </div>
      </div>

      {/* Action Controls & Notation Button */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        {/* Notation Guide Button */}
        <button
          onClick={onOpenNotation}
          className="flex items-center gap-1 px-2 py-1.2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold tracking-wide transition-all border border-slate-200"
          title="Open Notation Guide"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="font-mono text-blue-700 font-bold hidden sm:inline">U | D | R | L | F | B</span>
          <span className="text-xs font-medium text-slate-700 sm:hidden">Notation</span>
        </button>

        {/* Scramble Button */}
        <button
          onClick={onScrambleCube}
          className="flex items-center gap-1 px-2 py-1.2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all border border-slate-200"
          title="Scramble the cube"
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span className="hidden sm:inline">Scramble</span>
        </button>

        {/* Reset Cube Button */}
        <button
          onClick={onResetCube}
          className="flex items-center gap-1 px-2 py-1.2 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all border border-slate-200"
          title="Reset cube to solved state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-lg border transition-all ${
            isSoundEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
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
