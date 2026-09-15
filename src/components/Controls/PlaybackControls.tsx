import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Zap } from 'lucide-react';

interface PlaybackControlsProps {
  onPlayFull: () => void;
  onNextMove: () => void;
  onResetStep: () => void;
  isPlaying: boolean;
  isAnimating: boolean;
  canStepForward: boolean;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  onPlayFull,
  onNextMove,
  onResetStep,
  isPlaying,
  isAnimating,
  canStepForward,
  speedMs,
  onSpeedChange,
}) => {
  return (
    <div className="w-full space-y-2">
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Play Full Algorithm Button */}
        <button
          onClick={onPlayFull}
          disabled={!canStepForward && !isPlaying}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-xs tracking-wide transition-all shadow-sm ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white font-bold'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Algorithm</span>
            </>
          )}
        </button>

        {/* Next Move Button (Step-by-step single move) */}
        <button
          onClick={onNextMove}
          disabled={isAnimating || isPlaying || !canStepForward}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-semibold text-xs tracking-wide bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 border border-slate-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span>Next Move</span>
          <StepForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Secondary Tools: Reset Step & Speed Selector */}
      <div className="flex items-center justify-between gap-2 px-0.5 text-xs">
        <button
          onClick={onResetStep}
          disabled={isAnimating}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 text-[11px] disabled:opacity-40"
          title="Reset back to the start of this step"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Step</span>
        </button>

        {/* Speed presets */}
        <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
          <Zap className="w-3 h-3 text-amber-600" />
          <span className="text-[10px] text-slate-500">Speed:</span>
          {[
            { label: '0.8s', ms: 800 },
            { label: '0.5s', ms: 500 },
            { label: '0.3s', ms: 300 },
          ].map((item) => (
            <button
              key={item.ms}
              onClick={() => onSpeedChange(item.ms)}
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium transition-all ${
                speedMs === item.ms
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
