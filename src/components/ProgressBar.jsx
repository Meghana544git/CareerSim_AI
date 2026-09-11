import React from 'react';
import { Terminal } from 'lucide-react';

export default function ProgressBar({
  currentQuestionIndex,
  totalQuestions,
  roleTitle
}) {
  const currentStep = currentQuestionIndex + 1;
  const percentage = Math.round((currentStep / totalQuestions) * 100);
  const formattedStep = String(currentStep).padStart(2, '0');
  const formattedTotal = String(totalQuestions).padStart(2, '0');

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs mb-5 transition-all">
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Assessment in Progress
          </span>
          <span className="text-slate-300">•</span>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            {roleTitle}
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="font-semibold text-slate-500">
            Question <span className="text-slate-900 font-bold">{formattedStep}</span> of {formattedTotal}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            {percentage}% Complete
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between items-center mt-2.5 px-0.5 text-[11px] font-semibold text-slate-400">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i <= currentQuestionIndex ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
            <span
              className={`hidden sm:inline transition-colors ${
                i === currentQuestionIndex ? 'text-indigo-600 font-bold' : i < currentQuestionIndex ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Q{String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
