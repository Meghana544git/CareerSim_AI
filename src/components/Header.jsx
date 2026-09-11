import React from 'react';
import { Compass, History, RotateCcw, Sparkles, MapPin, CheckCircle } from 'lucide-react';

export default function Header({
  activeScreen,
  activeRole,
  historyCount = 0,
  onOpenHistory,
  onResetSession,
  onNavigateHome,
  onScrollToRoadmap
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <button
          onClick={onNavigateHome || onResetSession}
          className="flex items-center gap-2.5 text-left group focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -ml-1"
          title="CareerSim AI — Home"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-600 transition-colors shrink-0">
            <Compass className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none">
                CareerSim<span className="text-indigo-600">AI</span>
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 rounded">
                LAB
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:block tracking-tight">
              AI Career Simulation Lab
            </span>
          </div>
        </button>

        {/* Center Navigation (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={onNavigateHome || onResetSession}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeScreen === 'home' || activeScreen === 'interview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Assessment
          </button>
          <button
            type="button"
            onClick={() => {
              if (activeScreen === 'results' && onScrollToRoadmap) {
                onScrollToRoadmap();
              } else if (onNavigateHome) {
                onNavigateHome();
              }
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeScreen === 'results'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Roadmap
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-white/60 transition-all flex items-center gap-1.5"
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[9px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Status & Action Area */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/80 text-emerald-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold">Career Readiness</span>
          </div>

          {/* History Button (Always available on mobile & desktop) */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 shadow-2xs active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="View assessment history"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xs:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-slate-900 text-white rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Reset / New Assessment Button when inside interview or results */}
          {activeScreen !== 'home' && (
            <button
              type="button"
              onClick={onResetSession}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Start a new assessment"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start New</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
