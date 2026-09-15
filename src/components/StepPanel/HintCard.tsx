import React from 'react';
import { Lightbulb, AlertTriangle, ChevronRight } from 'lucide-react';

interface HintCardProps {
  instruction: string;
  subInstructions?: string[];
  tip?: string;
  warning?: string;
  stageDiagram?: string[];
}

export const HintCard: React.FC<HintCardProps> = ({
  instruction,
  subInstructions = [],
  tip,
  warning,
  stageDiagram = [],
}) => {
  return (
    <div className="space-y-2.5 text-xs">
      {/* Primary Instruction */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border border-slate-200/90 text-slate-700 leading-relaxed font-normal shadow-2xs">
        <p className="font-semibold text-slate-900 mb-1.5 text-xs sm:text-sm">{instruction}</p>

        {subInstructions.length > 0 && (
          <ul className="space-y-1.5 mt-2.5 text-slate-600">
            {subInstructions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5 shadow-xs">
                  {idx + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stage Progression Flow Diagram */}
      {stageDiagram.length > 0 && (
        <div className="p-2.5 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/50 border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Stage Roadmap
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {stageDiagram.map((stage, idx) => (
              <React.Fragment key={idx}>
                <span className="px-2.5 py-0.5 rounded-lg bg-white text-slate-800 border border-slate-200 font-semibold shadow-2xs">
                  {stage}
                </span>
                {idx < stageDiagram.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Tip Box (clean, gradient styling, no emojis) */}
      {tip && (
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/15 border border-amber-300/80 text-amber-950 flex items-start gap-2.5 shadow-2xs">
          <div className="p-1 rounded-md bg-amber-500/15 text-amber-700 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <div className="leading-snug">
            <span className="font-bold text-amber-950">Tip: </span>
            <span className="text-amber-900">{tip}</span>
          </div>
        </div>
      )}

      {/* Warning Box (clean, gradient styling, no emojis) */}
      {warning && (
        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/10 via-red-500/5 to-rose-500/15 border border-rose-300/80 text-rose-950 flex items-start gap-2.5 shadow-2xs">
          <div className="p-1 rounded-md bg-rose-500/15 text-rose-700 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="leading-snug">
            <span className="font-bold text-rose-950">Important: </span>
            <span className="text-rose-900">{warning}</span>
          </div>
        </div>
      )}
    </div>
  );
};
