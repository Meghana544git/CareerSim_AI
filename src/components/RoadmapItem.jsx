import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Play } from 'lucide-react';

export default function RoadmapItem({
  item,
  isCompleted,
  onToggleStatus,
  isLastStep
}) {
  return (
    <div className="relative group">
      {/* Visual connector line between steps if not last */}
      {!isLastStep && (
        <div className="hidden sm:block absolute left-5 top-14 bottom-[-16px] w-0.5 bg-slate-200 z-0 group-hover:bg-indigo-200 transition-colors" />
      )}

      <div
        className={`relative z-10 p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
          isCompleted
            ? 'bg-emerald-50/30 border-emerald-300/80 shadow-2xs'
            : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            {/* Step Number Circle */}
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 tracking-tight transition-colors ${
                isCompleted
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-900 text-white group-hover:bg-indigo-600'
              }`}
            >
              {item.number}
            </span>

            <div>
              <h4
                className={`text-base font-bold tracking-tight transition-colors ${
                  isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                }`}
              >
                {item.skill}
              </h4>
              <span className="text-[11px] font-semibold text-slate-400 block sm:inline">
                Milestone {item.number} • Targeted Competency Action
              </span>
            </div>
          </div>

          {/* Action / Completion Button */}
          <button
            type="button"
            onClick={() => onToggleStatus(item.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all self-start active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 shadow-2xs'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current text-slate-500" />
                <span>Start Step</span>
              </>
            )}
          </button>
        </div>

        {/* Details: Why it matters & Recommended action */}
        <div className="space-y-2 text-xs sm:text-sm pl-0 sm:pl-13 mt-3 pt-3 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-700">Why it matters: </span>
            <span className="text-slate-600 leading-relaxed">{item.whyItMatters}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="font-bold text-indigo-900 block mb-0.5 text-xs">Recommended Action:</span>
            <span className="text-slate-700 text-xs leading-relaxed">{item.recommendedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
