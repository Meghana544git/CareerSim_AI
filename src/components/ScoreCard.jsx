import React from 'react';
import { Award, CheckCircle2, TrendingUp, Sparkles, Terminal } from 'lucide-react';

export default function ScoreCard({
  roleTitle,
  overallReadiness,
  readinessTier,
  tierBadgeColor,
  summary
}) {
  const getScoreTheme = (score) => {
    if (score >= 80) {
      return {
        text: 'text-emerald-700',
        ring: 'border-emerald-500',
        bg: 'bg-emerald-50/50',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    if (score >= 65) {
      return {
        text: 'text-indigo-700',
        ring: 'border-indigo-600',
        bg: 'bg-indigo-50/50',
        badge: 'bg-indigo-50 text-indigo-800 border-indigo-300'
      };
    }
    if (score >= 45) {
      return {
        text: 'text-amber-700',
        ring: 'border-amber-500',
        bg: 'bg-amber-50/50',
        badge: 'bg-amber-50 text-amber-800 border-amber-300'
      };
    }
    return {
      text: 'text-rose-700',
      ring: 'border-rose-500',
      bg: 'bg-rose-50/50',
      badge: 'bg-rose-50 text-rose-800 border-rose-300'
    };
  };

  const theme = getScoreTheme(overallReadiness);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-6 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Your Career Readiness Report</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {roleTitle} Assessment
          </h2>
        </div>

        <div>
          <span className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-full border shadow-2xs ${theme.badge}`}>
            {readinessTier}
          </span>
        </div>
      </div>

      {/* Main Score Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 py-6">
        {/* Visual Prominent Score */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center shadow-inner relative bg-slate-50/30">
            <div
              className={`absolute inset-0 rounded-full border-8 transition-all duration-700 ${theme.ring}`}
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`
              }}
            />
            <span className={`text-4xl sm:text-5xl font-black tracking-tight leading-none ${theme.text}`}>
              {overallReadiness}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              / 100
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
              Career Readiness
            </span>
          </div>
        </div>

        {/* Executive Summary Statement */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Simulation Summary</span>
          </div>

          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed mb-3">
            "{summary}"
          </p>

          <p className="text-xs text-slate-500 leading-normal">
            Calculated from multi-factor concept extraction across 5 technical questions, weighted against standard entry-level hiring rubrics.
          </p>
        </div>
      </div>
    </div>
  );
}
