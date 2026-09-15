import React from 'react';
import { MoveNotation } from '../../types/cube';
import { CheckCircle2 } from 'lucide-react';

interface AlgorithmDisplayProps {
  algorithm?: string;
  moves: MoveNotation[];
  currentMoveIndex: number;
  isExecuting?: boolean;
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
    <div className="w-full bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 border border-indigo-100 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
      {/* Top Bar: Current Move Spotlight with Gradient */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900/70">
            Current Move
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-mono font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
              {isFinished ? (
                <span className="text-emerald-600 flex items-center gap-1.5 text-sm font-sans font-bold">
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900/70">
            Move Progress
          </span>
          <div className="text-xs font-mono font-extrabold text-indigo-950 mt-0.5">
            {isFinished ? moves.length : Math.max(0, currentMoveIndex + 1)} / {moves.length}
          </div>
        </div>
      </div>

      {/* Algorithm Sequence Chips with gradient active highlight */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-900/70 mb-1 flex items-center justify-between">
          <span>Algorithm Sequence</span>
          <span className="text-[10px] text-indigo-600 font-mono font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
            {algorithm}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1.5 bg-white/90 rounded-xl border border-indigo-100/80 shadow-inner-glow">
          {moves.map((move, idx) => {
            const isCurrent = idx === currentMoveIndex;
            const isPast = idx < currentMoveIndex;

            return (
              <div key={`${move}-${idx}`} className="flex items-center">
                <div
                  className={`relative flex flex-col items-center justify-center px-2 py-0.5 rounded-lg font-mono text-xs font-black transition-all duration-200 border ${
                    isCurrent
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white border-transparent ring-2 ring-indigo-200 scale-105 shadow-md shadow-indigo-500/30'
                      : isPast
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{move}</span>
                  {isCurrent && (
                    <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 ring-2 ring-white" />
                  )}
                </div>
                {idx < moves.length - 1 && (
                  <span className="text-indigo-300 text-[10px] mx-0.5 font-bold">›</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
