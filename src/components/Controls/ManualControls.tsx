import React from 'react';
import { Face, MoveNotation } from '../../types/cube';

interface ManualControlsProps {
  onExecuteMove: (move: MoveNotation) => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isAnimating: boolean;
}

interface FaceButtonGroup {
  face: Face;
  label: string;
  faceClass: string;
  tagColor: string;
  moves: { notation: MoveNotation; shortcut: string }[];
}

const FACE_GROUPS: FaceButtonGroup[] = [
  {
    face: 'U',
    label: 'Up (White)',
    faceClass: 'btn-face-u',
    tagColor: 'text-amber-900 bg-amber-200/60 border-amber-300',
    moves: [
      { notation: 'U', shortcut: 'U' },
      { notation: "U'", shortcut: '⇧U' },
      { notation: 'U2', shortcut: '2x' },
    ],
  },
  {
    face: 'D',
    label: 'Down (Yellow)',
    faceClass: 'btn-face-d',
    tagColor: 'text-yellow-900 bg-yellow-100 border-yellow-300',
    moves: [
      { notation: 'D', shortcut: 'D' },
      { notation: "D'", shortcut: '⇧D' },
      { notation: 'D2', shortcut: '2x' },
    ],
  },
  {
    face: 'R',
    label: 'Right (Red)',
    faceClass: 'btn-face-r',
    tagColor: 'text-rose-900 bg-rose-100 border-rose-300',
    moves: [
      { notation: 'R', shortcut: 'R' },
      { notation: "R'", shortcut: '⇧R' },
      { notation: 'R2', shortcut: '2x' },
    ],
  },
  {
    face: 'L',
    label: 'Left (Orange)',
    faceClass: 'btn-face-l',
    tagColor: 'text-orange-900 bg-orange-100 border-orange-300',
    moves: [
      { notation: 'L', shortcut: 'L' },
      { notation: "L'", shortcut: '⇧L' },
      { notation: 'L2', shortcut: '2x' },
    ],
  },
  {
    face: 'F',
    label: 'Front (Green)',
    faceClass: 'btn-face-f',
    tagColor: 'text-emerald-900 bg-emerald-100 border-emerald-300',
    moves: [
      { notation: 'F', shortcut: 'F' },
      { notation: "F'", shortcut: '⇧F' },
      { notation: 'F2', shortcut: '2x' },
    ],
  },
  {
    face: 'B',
    label: 'Back (Blue)',
    faceClass: 'btn-face-b',
    tagColor: 'text-blue-900 bg-blue-100 border-blue-300',
    moves: [
      { notation: 'B', shortcut: 'B' },
      { notation: "B'", shortcut: '⇧B' },
      { notation: 'B2', shortcut: '2x' },
    ],
  },
];

export const ManualControls: React.FC<ManualControlsProps> = ({
  onExecuteMove,
  isAnimating,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-indigo-100/90 p-2.5 sm:p-3 shadow-md shadow-indigo-500/5 flex flex-col justify-between gap-2 h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-0.5 border-b border-slate-100 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent">
            TURNING CONTROLS
          </span>
          <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded-full">
            6 Faces
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-bold hidden sm:inline">
          [U, D, R, L, F, B]
        </span>
      </div>

      {/* Grid: 2 columns on desktop (side panel), 3 cols on tablet, 2 cols on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 sm:gap-2 flex-1 items-center">
        {FACE_GROUPS.map((group) => (
          <div
            key={group.face}
            className="bg-slate-50/90 hover:bg-slate-100/80 transition-colors border border-slate-200/90 rounded-xl p-1.5 sm:p-2 flex flex-col justify-center gap-1 shadow-2xs"
          >
            {/* Face Badge */}
            <div className="w-full flex items-center justify-between px-0.5">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-slate-700 truncate">
                {group.label}
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${group.tagColor}`}>
                {group.face}
              </span>
            </div>

            {/* 3 Tactile Buttons per face: Normal, Inverse, Double */}
            <div className="grid grid-cols-3 gap-1 w-full">
              {group.moves.map(({ notation, shortcut }) => (
                <button
                  key={notation}
                  onClick={() => onExecuteMove(notation)}
                  disabled={isAnimating}
                  className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-mono font-black border transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-0.5 ${group.faceClass}`}
                  title={`Turn ${notation} (${shortcut})`}
                >
                  <span className="leading-none">{notation}</span>
                  <span className="text-[7px] sm:text-[8px] font-sans opacity-60 leading-none">
                    {shortcut}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-slate-400 px-0.5">
        <span>Click button or press Key</span>
        <span className="text-indigo-600">Shift = Counter-Clockwise</span>
      </div>
    </div>
  );
};


