import React from 'react';
import { RotateCcw, Compass } from 'lucide-react';
import { CameraPreset } from '../../types/cube';

interface ViewControlsProps {
  onPresetSelect: (preset: CameraPreset) => void;
  onResetView: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({ onPresetSelect, onResetView }) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 items-center bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-300 shadow-sm text-xs select-none max-w-[calc(100%-1rem)]">
      <div className="hidden sm:flex items-center gap-1 text-slate-800 font-bold mr-0.5">
        <Compass className="w-3.5 h-3.5 text-blue-700" />
        <span className="text-[11px] font-black">View:</span>
      </div>

      <button
        onClick={() => onPresetSelect('isometric')}
        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-black transition-all font-bold text-[10px] sm:text-[11px] border border-slate-200"
        title="Isometric 3D View"
      >
        3D Iso
      </button>
      <button
        onClick={() => onPresetSelect('front')}
        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-black transition-all font-bold text-[10px] sm:text-[11px] border border-slate-200"
        title="Front Face (Green)"
      >
        Front
      </button>
      <button
        onClick={() => onPresetSelect('top')}
        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-black transition-all font-bold text-[10px] sm:text-[11px] border border-slate-200"
        title="Top Face (Yellow)"
      >
        Top
      </button>
      <button
        onClick={() => onPresetSelect('right')}
        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 hover:text-black transition-all font-bold text-[10px] sm:text-[11px] border border-slate-200"
        title="Right Face (Red)"
      >
        Right
      </button>

      <div className="h-3 w-px bg-slate-300 mx-0.5" />

      <button
        onClick={onResetView}
        className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-[10px] sm:text-[11px] transition-all border border-blue-300"
        title="Reset Camera View"
      >
        <RotateCcw className="w-2.5 h-2.5 text-blue-700" />
        <span>Reset</span>
      </button>
    </div>
  );
};
