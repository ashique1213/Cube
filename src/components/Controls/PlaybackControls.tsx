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
      {/* Primary Action Buttons with Gradients */}
      <div className="grid grid-cols-2 gap-2">
        {/* Play Full Algorithm Button */}
        <button
          onClick={onPlayFull}
          disabled={!canStepForward && !isPlaying}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-black text-xs tracking-wide transition-all shadow-md active:scale-[0.98] ${
            isPlaying
              ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-rose-500/25'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/35'
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

        {/* Next Move Button */}
        <button
          onClick={onNextMove}
          disabled={isAnimating || isPlaying || !canStepForward}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 active:scale-[0.98] text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span>Next Move</span>
          <StepForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Secondary Tools: Reset Step & Speed Selector with Gradients */}
      <div className="flex items-center justify-between gap-2 px-0.5 text-xs">
        <button
          onClick={onResetStep}
          disabled={isAnimating}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 text-[11px] font-semibold disabled:opacity-40 active:scale-95"
          title="Reset back to the start of this step"
        >
          <RotateCcw className="w-3 h-3 text-rose-500" />
          <span>Reset Step</span>
        </button>

        {/* Speed presets */}
        <div className="flex items-center gap-1 bg-gradient-to-r from-slate-100 to-indigo-50/60 px-1.5 py-0.5 rounded-lg border border-indigo-100/80">
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] text-slate-500 font-medium">Speed:</span>
          {[
            { label: '0.8s', ms: 800 },
            { label: '0.5s', ms: 500 },
            { label: '0.3s', ms: 300 },
          ].map((item) => (
            <button
              key={item.ms}
              onClick={() => onSpeedChange(item.ms)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                speedMs === item.ms
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
