import React from 'react';
import { Face, MoveNotation } from '../../types/cube';
import { ViewFaceMapping } from '../../engine/rotationPhysics';

interface ManualControlsProps {
  onExecuteMove: (visualMove: MoveNotation) => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isAnimating: boolean;
  viewMapping?: ViewFaceMapping;
}

interface VisualFaceConfig {
  visualFace: Face;
  label: string;
  sublabel: string;
  moves: { notation: MoveNotation; shortcut: string }[];
}

const VISUAL_FACE_CONFIGS: VisualFaceConfig[] = [
  {
    visualFace: 'U',
    label: 'UP',
    sublabel: 'Top',
    moves: [
      { notation: 'U', shortcut: 'U' },
      { notation: "U'", shortcut: '⇧U' },
      { notation: 'U2', shortcut: '2x' },
    ],
  },
  {
    visualFace: 'D',
    label: 'DOWN',
    sublabel: 'Bottom',
    moves: [
      { notation: 'D', shortcut: 'D' },
      { notation: "D'", shortcut: '⇧D' },
      { notation: 'D2', shortcut: '2x' },
    ],
  },
  {
    visualFace: 'F',
    label: 'FRONT',
    sublabel: 'Facing',
    moves: [
      { notation: 'F', shortcut: 'F' },
      { notation: "F'", shortcut: '⇧F' },
      { notation: 'F2', shortcut: '2x' },
    ],
  },
  {
    visualFace: 'B',
    label: 'BACK',
    sublabel: 'Rear',
    moves: [
      { notation: 'B', shortcut: 'B' },
      { notation: "B'", shortcut: '⇧B' },
      { notation: 'B2', shortcut: '2x' },
    ],
  },
  {
    visualFace: 'L',
    label: 'LEFT',
    sublabel: 'Left',
    moves: [
      { notation: 'L', shortcut: 'L' },
      { notation: "L'", shortcut: '⇧L' },
      { notation: 'L2', shortcut: '2x' },
    ],
  },
  {
    visualFace: 'R',
    label: 'RIGHT',
    sublabel: 'Right',
    moves: [
      { notation: 'R', shortcut: 'R' },
      { notation: "R'", shortcut: '⇧R' },
      { notation: 'R2', shortcut: '2x' },
    ],
  },
];

export const ManualControls: React.FC<ManualControlsProps> = ({
  onExecuteMove,
  isAnimating,
  viewMapping = { U: 'U', D: 'D', R: 'R', L: 'L', F: 'F', B: 'B' },
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-indigo-100/90 p-2.5 sm:p-3 shadow-md shadow-indigo-500/5 flex flex-col justify-between gap-2 h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-0.5 border-b border-slate-200 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
            TURNING CONTROLS
          </span>
          <span className="text-[9px] font-black text-indigo-900 bg-indigo-100 border border-indigo-300 px-1.5 py-0.2 rounded-full">
            View-Relative
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-700 font-bold hidden sm:inline">
          Adapts on Rotation
        </span>
      </div>

      {/* Grid: 2 columns on desktop (side panel), 3 cols on tablet, 2 cols on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 sm:gap-2 flex-1 items-center">
        {VISUAL_FACE_CONFIGS.map((config) => {
          const physicalFace = viewMapping[config.visualFace] || config.visualFace;

          return (
            <div
              key={config.visualFace}
              className="bg-slate-100/90 hover:bg-slate-200/70 transition-colors border border-slate-300 rounded-xl p-1.5 sm:p-2 flex flex-col justify-center gap-1 shadow-2xs"
            >
              {/* Face Title & Active Physical Face indicator */}
              <div className="w-full flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1 truncate">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-slate-950">
                    {config.label}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase">
                    ({config.sublabel})
                  </span>
                </div>
                <span
                  className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded border shadow-2xs text-indigo-950 bg-indigo-100/90 border-indigo-300"
                  title={`Currently mapped to Physical Face [${physicalFace}]`}
                >
                  [{physicalFace}]
                </span>
              </div>

              {/* 3 Tactile Buttons per face: Normal, Inverse, Double */}
              <div className="grid grid-cols-3 gap-1 w-full">
                {config.moves.map(({ notation, shortcut }) => (
                  <button
                    key={notation}
                    onClick={() => onExecuteMove(notation)}
                    disabled={isAnimating}
                    className="py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-mono font-black border border-slate-300 bg-white hover:bg-indigo-50 hover:border-indigo-400 text-slate-950 transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-0.5 shadow-2xs active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Turn ${config.label} ${notation} (${shortcut})`}
                  >
                    <span className="leading-none text-slate-950 font-black">{notation}</span>
                    <span className="text-[7px] sm:text-[8px] font-sans font-black text-slate-700 leading-none">
                      {shortcut}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[9px] sm:text-[10px] font-black text-slate-700 px-0.5">
        <span>Click button or press Key</span>
        <span className="text-indigo-900">Touch/Rotate 3D cube to re-orient</span>
      </div>
    </div>
  );
};
