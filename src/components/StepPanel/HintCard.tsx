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
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-normal">
        <p className="font-medium text-slate-900 mb-1.5 text-xs sm:text-sm">{instruction}</p>

        {subInstructions.length > 0 && (
          <ul className="space-y-1 mt-2 text-slate-600">
            {subInstructions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stage Progression Flow Diagram */}
      {stageDiagram.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Stage Roadmap
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[11px]">
            {stageDiagram.map((stage, idx) => (
              <React.Fragment key={idx}>
                <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium shadow-sm">
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

      {/* Tip Box (clean, no emojis) */}
      {tip && (
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-950">Tip: </span>
            <span>{tip}</span>
          </div>
        </div>
      )}

      {/* Warning Box (clean, no emojis) */}
      {warning && (
        <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-900 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-rose-950">Important: </span>
            <span>{warning}</span>
          </div>
        </div>
      )}
    </div>
  );
};
