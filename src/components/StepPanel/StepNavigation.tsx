import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { SOLVING_STEPS } from '../../data/solvingSteps';

interface StepNavigationProps {
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isAnimating: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStepIndex,
  onStepChange,
  isAnimating,
}) => {
  const totalSteps = SOLVING_STEPS.length;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  return (
    <div className="w-full space-y-2">
      {/* Step Header with Prev / Next Buttons */}
      <div className="flex items-center justify-between gap-1.5">
        <button
          onClick={() => onStepChange(currentStepIndex - 1)}
          disabled={isFirst || isAnimating}
          className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-all border border-slate-200 shadow-xs flex-shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        <div className="text-center min-w-0">
          <div className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Step {currentStepIndex + 1} of {totalSteps}
          </div>
          <div className="text-xs text-slate-800 font-semibold truncate max-w-[150px] sm:max-w-[240px]">
            {SOLVING_STEPS[currentStepIndex].title}
          </div>
        </div>

        <button
          onClick={() => onStepChange(currentStepIndex + 1)}
          disabled={isLast || isAnimating}
          className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white transition-all shadow-xs flex-shrink-0"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 10-Node Connected Progress Bar */}
      <div className="relative flex items-center justify-between px-1 pt-0.5 w-full">
        {/* Connecting line */}
        <div className="absolute left-2.5 right-2.5 top-[12px] sm:top-[14px] h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${(currentStepIndex / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>

        {/* 10 Step Dots */}
        {SOLVING_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(idx)}
              disabled={isAnimating}
              title={`Step ${idx + 1}: ${step.title}`}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
            >
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-bold transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-200 scale-110 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" /> : idx + 1}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
