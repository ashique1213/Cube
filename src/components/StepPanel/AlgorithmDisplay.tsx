import React from 'react';
import { MoveNotation } from '../../types/cube';
import { CheckCircle2 } from 'lucide-react';

interface AlgorithmDisplayProps {
  algorithm?: string;
  moves: MoveNotation[];
  currentMoveIndex: number;
  isExecuting: boolean;
}

export const AlgorithmDisplay: React.FC<AlgorithmDisplayProps> = ({
  algorithm,
  moves,
  currentMoveIndex,
}) => {
  if (!moves || moves.length === 0) {
    return null;
  }

  const activeMove = currentMoveIndex >= 0 && currentMoveIndex < moves.length ? moves[currentMoveIndex] : null;
  const isFinished = currentMoveIndex >= moves.length;

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
      {/* Top Bar: Current Move Spotlight */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Current Move
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-mono font-bold text-blue-700">
              {isFinished ? (
                <span className="text-emerald-600 flex items-center gap-1 text-sm font-sans font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Sequence Complete
                </span>
              ) : activeMove ? (
                activeMove
              ) : (
                <span className="text-slate-400 text-sm font-sans font-normal">Ready</span>
              )}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Move Progress
          </span>
          <div className="text-xs font-mono font-bold text-slate-700 mt-0.5">
            {isFinished ? moves.length : Math.max(0, currentMoveIndex + 1)} / {moves.length}
          </div>
        </div>
      </div>

      {/* Algorithm Sequence Chips with active highlight */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
          <span>Algorithm Sequence</span>
          <span className="text-[10px] text-slate-500 font-mono font-medium">{algorithm}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
          {moves.map((move, idx) => {
            const isCurrent = idx === currentMoveIndex;
            const isPast = idx < currentMoveIndex;

            return (
              <div key={`${move}-${idx}`} className="flex items-center">
                <div
                  className={`relative flex flex-col items-center justify-center px-2 py-0.5 rounded font-mono text-xs font-bold transition-all duration-200 border ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400/30 scale-105 shadow-sm'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{move}</span>
                  {isCurrent && (
                    <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-600" />
                  )}
                </div>
                {idx < moves.length - 1 && (
                  <span className="text-slate-300 text-[10px] mx-0.5">›</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
