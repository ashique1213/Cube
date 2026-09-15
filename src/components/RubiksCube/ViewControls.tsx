import React from 'react';
import { RotateCcw, Compass } from 'lucide-react';
import { CameraPreset } from '../../types/cube';

interface ViewControlsProps {
  onPresetSelect: (preset: CameraPreset) => void;
  onResetView: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({ onPresetSelect, onResetView }) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 items-center bg-white/90 backdrop-blur-md px-1.5 sm:px-2 py-1 rounded-lg border border-slate-200 shadow-xs text-xs select-none max-w-[calc(100%-1rem)]">
      <div className="hidden sm:flex items-center gap-1 text-slate-500 font-medium mr-0.5">
        <Compass className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-[11px]">View:</span>
      </div>

      <button
        onClick={() => onPresetSelect('isometric')}
        className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all font-medium text-[10px] sm:text-[11px]"
        title="Isometric 3D View"
      >
        3D Iso
      </button>
      <button
        onClick={() => onPresetSelect('front')}
        className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all font-medium text-[10px] sm:text-[11px]"
        title="Front Face (Green)"
      >
        Front
      </button>
      <button
        onClick={() => onPresetSelect('top')}
        className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all font-medium text-[10px] sm:text-[11px]"
        title="Top Face (Yellow)"
      >
        Top
      </button>
      <button
        onClick={() => onPresetSelect('right')}
        className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all font-medium text-[10px] sm:text-[11px]"
        title="Right Face (Red)"
      >
        Right
      </button>

      <div className="h-3 w-px bg-slate-200 mx-0.5" />

      <button
        onClick={onResetView}
        className="flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-[10px] sm:text-[11px] transition-all border border-blue-200"
        title="Reset Camera View"
      >
        <RotateCcw className="w-2.5 h-2.5" />
        <span>Reset</span>
      </button>
    </div>
  );
};
