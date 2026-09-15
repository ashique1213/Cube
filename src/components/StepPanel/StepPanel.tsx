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
    <div className="w-full flex flex-col h-full bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-sm space-y-3 overflow-y-auto">
      {/* 1. Step Navigation Header */}
      <StepNavigation
        currentStepIndex={currentStepIndex}
        onStepChange={onStepChange}
        isAnimating={isAnimating || isPlayingAlgorithm}
      />

      <div className="h-px w-full bg-slate-200" />

      {/* 2. Step Title & Subtitle */}
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
            Step {step.id}
          </span>
          {isStep10 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Solved
            </span>
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
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

      {/* Step 10 Celebration Action (clean, no emojis) */}
      {isStep10 && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Trophy className="w-4 h-4" />
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
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
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
