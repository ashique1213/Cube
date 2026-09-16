import React from 'react';
import { RotateCcw, Compass } from 'lucide-react';
import { CameraPreset } from '../../types/cube';

interface ViewControlsProps {
  onPresetSelect: (preset: CameraPreset) => void;
  onResetView: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({ onPresetSelect, onResetView }) => {
  return (
    <div className="absolute top-1.5 left-1.5 z-10 flex flex-wrap gap-0.5 sm:gap-1 items-center bg-white/90 backdrop-blur-md px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-slate-200/90 shadow-2xs text-xs select-none max-w-[calc(100%-0.75rem)]">
      <div className="hidden sm:flex items-center gap-1 text-slate-800 font-bold mr-0.5">
        <Compass className="w-3.5 h-3.5 text-blue-700" />
        <span className="text-[11px] font-black">View:</span>
      </div>

      <button
        onClick={() => onPresetSelect('isometric')}
        className="px-1 sm:px-2 py-0.2 sm:py-0.5 rounded-md sm:rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-black transition-all font-bold text-[9px] sm:text-[11px] border border-slate-200"
        title="Isometric 3D View"
      >
        3D Iso
      </button>
      <button
        onClick={() => onPresetSelect('front')}
        className="px-1 sm:px-2 py-0.2 sm:py-0.5 rounded-md sm:rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-black transition-all font-bold text-[9px] sm:text-[11px] border border-slate-200"
        title="Front Face (Green)"
      >
        Front
      </button>
      <button
        onClick={() => onPresetSelect('top')}
        className="px-1 sm:px-2 py-0.2 sm:py-0.5 rounded-md sm:rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-black transition-all font-bold text-[9px] sm:text-[11px] border border-slate-200"
        title="Top Face (Yellow)"
      >
        Top
      </button>
      <button
        onClick={() => onPresetSelect('right')}
        className="px-1 sm:px-2 py-0.2 sm:py-0.5 rounded-md sm:rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-black transition-all font-bold text-[9px] sm:text-[11px] border border-slate-200"
        title="Right Face (Red)"
      >
        Right
      </button>

      <div className="h-2.5 w-px bg-slate-300 mx-0.5" />

      <button
        onClick={onResetView}
        className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.2 sm:py-0.5 rounded-md sm:rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-[9px] sm:text-[11px] transition-all border border-blue-300"
        title="Reset Camera View"
      >
        <RotateCcw className="w-2.5 h-2.5 text-blue-700" />
        <span>Reset</span>
      </button>
    </div>
  );
};
