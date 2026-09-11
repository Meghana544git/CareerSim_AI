import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function WeaknessCard({
  weaknesses = []
}) {
  return (
    <div className="flex-1 bg-white rounded-3xl border border-amber-200/70 shadow-2xs p-6 sm:p-7">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-amber-50">
        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-none">
            NEEDS IMPROVEMENT
          </h3>
          <span className="text-xs text-amber-700 font-semibold">
            High-leverage areas to practice
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {weaknesses.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              △
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>{item.title}</span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200/80">
                  {item.score}%
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
