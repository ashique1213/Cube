import React from 'react';
import { SolvingStep } from '../../types/cube';
import { StepNavigation } from './StepNavigation';
import { AlgorithmDisplay } from './AlgorithmDisplay';
import { HintCard } from './HintCard';
import { PlaybackControls } from '../Controls/PlaybackControls';
import { Trophy, RotateCcw } from 'lucide-react';

interface StepPanelProps {
  step: SolvingStep;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  currentMoveIndex: number;
  isPlayingAlgorithm: boolean;
  isAnimating: boolean;
  onPlayFullAlgorithm: () => void;
  onNextMove: () => void;
  onResetStep: () => void;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
  onSolveAgain?: () => void;
}

export const StepPanel: React.FC<StepPanelProps> = ({
  step,
  currentStepIndex,
  onStepChange,
  currentMoveIndex,
  isPlayingAlgorithm,
  isAnimating,
  onPlayFullAlgorithm,
  onNextMove,
  onResetStep,
  speedMs,
  onSpeedChange,
  onSolveAgain,
}) => {
  const isStep10 = step.id === 10;
  const canStepForward = currentMoveIndex < step.moves.length;

  return (
    <div className="w-full flex flex-col h-full bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 p-3.5 sm:p-4 shadow-sm space-y-3 overflow-y-auto">
      {/* 1. Step Navigation Header */}
      <StepNavigation
        currentStepIndex={currentStepIndex}
        onStepChange={onStepChange}
        isAnimating={isAnimating || isPlayingAlgorithm}
      />

      <div className="h-px w-full bg-slate-200/80" />

      {/* 2. Step Title & Subtitle */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs uppercase tracking-wide">
            Step {step.id}
          </span>
          {isStep10 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Solved
            </span>
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
          {step.title}
        </h2>
        {step.subtitle && (
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {step.subtitle}
          </p>
        )}
      </div>

      {/* 3. Algorithm Display (if algorithm exists) */}
      {step.moves.length > 0 && (
        <AlgorithmDisplay
          algorithm={step.algorithm}
          moves={step.moves}
          currentMoveIndex={currentMoveIndex}
          isExecuting={isAnimating || isPlayingAlgorithm}
        />
      )}

      {/* 4. Playback Controls */}
      {step.moves.length > 0 && (
        <PlaybackControls
          onPlayFull={onPlayFullAlgorithm}
          onNextMove={onNextMove}
          onResetStep={onResetStep}
          isPlaying={isPlayingAlgorithm}
          isAnimating={isAnimating}
          canStepForward={canStepForward}
          speedMs={speedMs}
          onSpeedChange={onSpeedChange}
        />
      )}

      {/* Step 10 Celebration Action (clean, gradient styling, no emojis) */}
      {isStep10 && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border border-emerald-300 text-center space-y-2.5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-950">Mastered the 3×3 Cube</div>
            <p className="text-xs text-emerald-800 mt-0.5">
              You know all fundamental stages of the Layer-by-Layer solution!
            </p>
          </div>
          {onSolveAgain && (
            <button
              onClick={onSolveAgain}
              className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Solve Again from Step 1</span>
            </button>
          )}
        </div>
      )}

      {/* 5. Helpful Tips, Instructions, and Progression Map */}
      <HintCard
        instruction={step.instruction}
        subInstructions={step.subInstructions}
        tip={step.tip}
        warning={step.warning}
        stageDiagram={step.stageDiagram}
      />
    </div>
  );
};
