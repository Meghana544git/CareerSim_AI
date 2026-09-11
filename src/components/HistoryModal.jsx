import React from 'react';
import { X, History, Trash2, Calendar, Award, ArrowRight } from 'lucide-react';

export default function HistoryModal({
  isOpen,
  onClose,
  history = [],
  onClearHistory,
  onSelectRole
}) {
  if (!isOpen) return null;

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <History className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 id="history-modal-title" className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                Assessment History
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {history.length} {history.length === 1 ? 'record' : 'records'} saved locally
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {history.length === 0 ? (
            /* EMPTY STATE EXACT SPECIFICATION */
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <History className="w-7 h-7" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                No assessment history yet.
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
                Complete your first career simulation to start tracking your progress.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectRole();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] shadow-xs"
              >
                <span>Start Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {entry.roleTitle}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                        {entry.readinessTier}
                      </span>
                    </div>
                    <span className="text-sm font-black text-indigo-600">
                      {entry.overallReadiness} / 100
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    "{entry.summary}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(entry.timestamp)}
                    </span>
                    <span className="text-slate-500 font-medium">
                      Tech: {entry.skillBreakdown?.technicalSkills}% • Prob: {entry.skillBreakdown?.problemSolving}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Danger Button */}
        {history.length > 0 && (
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
