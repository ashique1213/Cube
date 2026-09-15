import React from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';
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
  colorBg: string;
  textColor: string;
  borderColor: string;
  moves: [MoveNotation, MoveNotation, MoveNotation];
}

const FACE_GROUPS: FaceButtonGroup[] = [
  {
    face: 'U',
    label: 'Up',
    colorBg: 'bg-gradient-to-b from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 active:from-amber-300 active:to-yellow-300',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-300/80',
    moves: ['U', "U'", 'U2'],
  },
  {
    face: 'D',
    label: 'Down',
    colorBg: 'bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200 active:from-slate-200 active:to-slate-300',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    moves: ['D', "D'", 'D2'],
  },
  {
    face: 'R',
    label: 'Right',
    colorBg: 'bg-gradient-to-b from-red-50 to-rose-100 hover:from-red-100 hover:to-rose-200 active:from-red-200 active:to-rose-300',
    textColor: 'text-red-800',
    borderColor: 'border-red-300/80',
    moves: ['R', "R'", 'R2'],
  },
  {
    face: 'L',
    label: 'Left',
    colorBg: 'bg-gradient-to-b from-orange-50 to-amber-100 hover:from-orange-100 hover:to-amber-200 active:from-orange-200 active:to-amber-300',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300/80',
    moves: ['L', "L'", 'L2'],
  },
  {
    face: 'F',
    label: 'Front',
    colorBg: 'bg-gradient-to-b from-emerald-50 to-teal-100 hover:from-emerald-100 hover:to-teal-200 active:from-emerald-200 active:to-teal-300',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300/80',
    moves: ['F', "F'", 'F2'],
  },
  {
    face: 'B',
    label: 'Back',
    colorBg: 'bg-gradient-to-b from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 active:from-blue-200 active:to-indigo-300',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300/80',
    moves: ['B', "B'", 'B2'],
  },
];

export const ManualControls: React.FC<ManualControlsProps> = ({
  onExecuteMove,
  onReset,
  onUndo,
  canUndo,
  isAnimating,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 p-2 sm:p-2.5 shadow-xs space-y-1.5 flex-shrink-0">
      {/* Header bar with title & Undo / Reset */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Manual Face Turns
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:inline">
            (Interactive 3D layer controls)
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo || isAnimating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200 active:to-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] sm:text-[11px] font-semibold text-slate-700 transition-all border border-slate-300 shadow-2xs"
            title="Undo last move"
          >
            <Undo2 className="w-3 h-3" />
            <span>Undo</span>
          </button>

          <button
            onClick={onReset}
            disabled={isAnimating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-b from-rose-50 to-red-100 hover:from-rose-100 hover:to-red-200 active:to-red-300 text-[10px] sm:text-[11px] font-semibold text-rose-700 border border-rose-300 transition-all shadow-2xs"
            title="Reset cube"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Responsive Grid: 3 cols on mobile, 6 cols on sm/md and up */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-1.5">
        {FACE_GROUPS.map((group) => (
          <div
            key={group.face}
            className="bg-gradient-to-b from-slate-50 to-slate-100/60 border border-slate-200/90 rounded-xl p-1 sm:p-1.5 flex flex-col items-center gap-1 shadow-2xs"
          >
            <span className={`text-[9px] sm:text-[10px] font-bold ${group.textColor} uppercase tracking-wider`}>
              {group.label}
            </span>

            <div className="grid grid-cols-3 gap-0.5 sm:gap-1 w-full">
              {group.moves.map((move) => (
                <button
                  key={move}
                  onClick={() => onExecuteMove(move)}
                  disabled={isAnimating}
                  className={`py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold transition-all border ${group.colorBg} ${group.textColor} ${group.borderColor} active:scale-95 disabled:opacity-40 shadow-xs hover:shadow-sm`}
                >
                  {move}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
