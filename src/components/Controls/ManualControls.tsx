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
  { face: 'U', label: 'Up', colorBg: 'bg-yellow-50 hover:bg-yellow-100 active:bg-yellow-200', textColor: 'text-amber-800', borderColor: 'border-yellow-300', moves: ['U', "U'", 'U2'] },
  { face: 'D', label: 'Down', colorBg: 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300', textColor: 'text-slate-800', borderColor: 'border-slate-300', moves: ['D', "D'", 'D2'] },
  { face: 'R', label: 'Right', colorBg: 'bg-red-50 hover:bg-red-100 active:bg-red-200', textColor: 'text-red-700', borderColor: 'border-red-300', moves: ['R', "R'", 'R2'] },
  { face: 'L', label: 'Left', colorBg: 'bg-orange-50 hover:bg-orange-100 active:bg-orange-200', textColor: 'text-orange-700', borderColor: 'border-orange-300', moves: ['L', "L'", 'L2'] },
  { face: 'F', label: 'Front', colorBg: 'bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200', textColor: 'text-emerald-700', borderColor: 'border-emerald-300', moves: ['F', "F'", 'F2'] },
  { face: 'B', label: 'Back', colorBg: 'bg-blue-50 hover:bg-blue-100 active:bg-blue-200', textColor: 'text-blue-700', borderColor: 'border-blue-300', moves: ['B', "B'", 'B2'] },
];

export const ManualControls: React.FC<ManualControlsProps> = ({
  onExecuteMove,
  onReset,
  onUndo,
  canUndo,
  isAnimating,
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-2 sm:p-2.5 shadow-xs space-y-1.5 flex-shrink-0">
      {/* Header bar with title & Undo / Reset */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700">
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
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] sm:text-[11px] text-slate-700 transition-colors border border-slate-200"
            title="Undo last move"
          >
            <Undo2 className="w-3 h-3" />
            <span>Undo</span>
          </button>

          <button
            onClick={onReset}
            disabled={isAnimating}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-[10px] sm:text-[11px] text-rose-700 border border-rose-200 transition-colors"
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
            className="bg-slate-50 border border-slate-200 rounded-lg p-1 flex flex-col items-center gap-0.5"
          >
            <span className={`text-[9px] sm:text-[10px] font-bold ${group.textColor}`}>
              {group.label}
            </span>

            <div className="grid grid-cols-3 gap-0.5 w-full">
              {group.moves.map((move) => (
                <button
                  key={move}
                  onClick={() => onExecuteMove(move)}
                  disabled={isAnimating}
                  className={`py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-mono font-bold transition-all border ${group.colorBg} ${group.textColor} ${group.borderColor} active:scale-95 disabled:opacity-40 shadow-xs`}
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
