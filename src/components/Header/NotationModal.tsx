import React from 'react';
import { X, Info, Lightbulb } from 'lucide-react';
import { Face, MoveNotation } from '../../types/cube';

interface NotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestMove?: (move: MoveNotation) => void;
}

interface FaceGuide {
  face: Face;
  name: string;
  colorName: string;
  badgeBg: string;
  description: string;
}

const FACES: FaceGuide[] = [
  { face: 'U', name: 'Up', colorName: 'Yellow', badgeBg: 'bg-yellow-400 text-slate-900 border border-yellow-500', description: 'Top face of the cube' },
  { face: 'D', name: 'Down', colorName: 'White', badgeBg: 'bg-white text-slate-900 border border-slate-300', description: 'Bottom face of the cube' },
  { face: 'R', name: 'Right', colorName: 'Red', badgeBg: 'bg-red-600 text-white', description: 'Right side face' },
  { face: 'L', name: 'Left', colorName: 'Orange', badgeBg: 'bg-orange-500 text-white', description: 'Left side face' },
  { face: 'F', name: 'Front', colorName: 'Green', badgeBg: 'bg-emerald-600 text-white', description: 'Face facing directly towards you' },
  { face: 'B', name: 'Back', colorName: 'Blue', badgeBg: 'bg-blue-600 text-white', description: 'Face facing away from you' },
];

export const NotationModal: React.FC<NotationModalProps> = ({ isOpen, onClose, onTestMove }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close notation guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Singmaster Cube Notation</h2>
            <p className="text-xs text-slate-500">Standard international notation used in Rubik's Cube algorithms</p>
          </div>
        </div>

        {/* Core Notation Symbols */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-gradient-to-b from-blue-50/50 to-slate-50 p-3.5 rounded-xl border border-blue-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-base font-bold text-blue-700 bg-gradient-to-b from-blue-100 to-indigo-100 border border-blue-200 px-2.5 py-0.5 rounded-lg shadow-2xs">R</span>
              <span className="text-xs font-bold text-slate-900">Clockwise Turn</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Turn face 90° clockwise as if looking directly at it.
            </p>
          </div>

          <div className="bg-gradient-to-b from-amber-50/50 to-slate-50 p-3.5 rounded-xl border border-amber-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-base font-bold text-amber-700 bg-gradient-to-b from-amber-100 to-yellow-100 border border-amber-200 px-2.5 py-0.5 rounded-lg shadow-2xs">R'</span>
              <span className="text-xs font-bold text-slate-900">Prime / Counter</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              A prime mark ( ' ) means rotate 90° anti-clockwise.
            </p>
          </div>

          <div className="bg-gradient-to-b from-emerald-50/50 to-slate-50 p-3.5 rounded-xl border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-base font-bold text-emerald-700 bg-gradient-to-b from-emerald-100 to-teal-100 border border-emerald-200 px-2.5 py-0.5 rounded-lg shadow-2xs">R2</span>
              <span className="text-xs font-bold text-slate-900">Double Turn</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              The number 2 indicates a 180° rotation (two quarter turns).
            </p>
          </div>
        </div>

        {/* 6 Faces Table with live test buttons */}
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          The 6 Faces & Quick Interactive Tryout
        </h3>
        <div className="space-y-2">
          {FACES.map((face) => (
            <div
              key={face.face}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/60 hover:from-white hover:to-slate-50 border border-slate-200 transition-all gap-2 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm ${face.badgeBg}`}>
                  {face.face}
                </span>
                <div>
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>{face.name}</span>
                    <span className="text-[11px] text-slate-500 font-normal">({face.colorName} center)</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{face.description}</div>
                </div>
              </div>

              {/* Tryout buttons */}
              {onTestMove && (
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">Test:</span>
                  <button
                    onClick={() => onTestMove(face.face as MoveNotation)}
                    className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-gradient-to-b from-white to-slate-100 hover:from-blue-50 hover:to-blue-100 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all shadow-2xs active:scale-95"
                  >
                    {face.face}
                  </button>
                  <button
                    onClick={() => onTestMove(`${face.face}'` as MoveNotation)}
                    className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-gradient-to-b from-white to-slate-100 hover:from-amber-50 hover:to-amber-100 text-slate-700 hover:text-amber-700 border border-slate-200 transition-all shadow-2xs active:scale-95"
                  >
                    {face.face}'
                  </button>
                  <button
                    onClick={() => onTestMove(`${face.face}2` as MoveNotation)}
                    className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-gradient-to-b from-white to-slate-100 hover:from-emerald-50 hover:to-emerald-100 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-all shadow-2xs active:scale-95"
                  >
                    {face.face}2
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tip Box (clean, gradient styling, no emojis) */}
        <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-500/15 border border-blue-300/80 flex items-start gap-2.5 text-xs text-blue-950 shadow-2xs">
          <div className="p-1 rounded-md bg-blue-500/15 text-blue-700 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <div>
            <strong className="font-bold text-blue-950">Tip: </strong>
            To determine clockwise vs counter-clockwise for any face, imagine yourself looking straight at that face as if it were a normal wall clock.
          </div>
        </div>
      </div>
    </div>
  );
};
