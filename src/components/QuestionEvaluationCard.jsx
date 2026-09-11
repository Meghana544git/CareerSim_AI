import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRightCircle,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
  HelpCircle
} from 'lucide-react';

export default function QuestionEvaluationCard({
  evaluation,
  question,
  index
}) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  if (!evaluation) return null;

  const score = evaluation.final_score !== undefined ? evaluation.final_score : evaluation.score || 0;
  const isAi = evaluation.evaluationMode === 'ai';

  const correctPoints = evaluation.correct_points || [];
  const incorrectPoints = evaluation.incorrect_points || [];
  const irrelevantPoints = evaluation.irrelevant_points || [];
  const missingConcepts = evaluation.missing_concepts || evaluation.missingClusters || [];
  const detectedIssues = evaluation.detected_issues || [];

  const getScoreBadge = (val) => {
    if (val >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (val >= 60) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (val >= 40) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all mb-4">
      {/* Card Header / Summary Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors focus-visible:outline-indigo-500"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
            Q{evaluation.questionNumber || index + 1}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {evaluation.category || question?.category || 'Question'}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isAi
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isAi ? (
                  <>
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>AI Evaluated</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-slate-500" />
                    <span>Deterministic Fallback</span>
                  </>
                )}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-1">
              {question?.question || `Question ${index + 1}`}
            </h4>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Score:</span>
            <span
              className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black border ${getScoreBadge(
                score
              )}`}
            >
              ★ {score}/100
            </span>
          </div>
          <div className="text-slate-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expandable Detailed Breakdown Area */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/40 space-y-5 animate-fadeIn">
          {/* Question Text in Full */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
              Interview Question:
            </span>
            <p className="font-semibold text-slate-900">{question?.question}</p>
          </div>

          {/* Dimension Breakdown Metrics */}
          {(evaluation.relevance_score !== undefined || evaluation.correctness_score !== undefined) && (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Relevance (35%)</span>
                <span className="text-sm font-black text-slate-800">{evaluation.relevance_score ?? 0}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Correctness (30%)</span>
                <span className="text-sm font-black text-slate-800">{evaluation.correctness_score ?? 0}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Concepts (20%)</span>
                <span className="text-sm font-black text-slate-800">{evaluation.concept_score ?? 0}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Depth (10%)</span>
                <span className="text-sm font-black text-slate-800">{evaluation.completeness_score ?? 0}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 col-span-2 xs:col-span-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Clarity (5%)</span>
                <span className="text-sm font-black text-slate-800">{evaluation.clarity_score ?? 0}%</span>
              </div>
            </div>
          )}

          {/* Detected Issues Badges */}
          {detectedIssues.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Detected Notes:</span>
              {detectedIssues.map((issue, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-800"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  {issue}
                </span>
              ))}
            </div>
          )}

          {/* Structured Feedback Sections: Correct, Incorrect, Irrelevant, Missing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. What was correct */}
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>What was correct</span>
              </div>
              {correctPoints.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {correctPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-700/80 italic">No correct technical points identified.</p>
              )}
            </div>

            {/* 2. What was incorrect */}
            <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>What was incorrect</span>
              </div>
              {incorrectPoints.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-rose-950">
                  {incorrectPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-rose-700/80 italic">No technical inaccuracies detected.</p>
              )}
            </div>

            {/* 3. What was irrelevant */}
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>What was irrelevant</span>
              </div>
              {irrelevantPoints.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-amber-950">
                  {irrelevantPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-amber-700/80 italic">No off-topic or irrelevant content identified.</p>
              )}
            </div>

            {/* 4. What was missing */}
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 mb-2">
                <ArrowRightCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>What was missing</span>
              </div>
              {missingConcepts.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-indigo-950">
                  {missingConcepts.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-indigo-700/80 italic">Comprehensive coverage of expected concepts.</p>
              )}
            </div>
          </div>

          {/* Feedback Summary Paragraph */}
          {evaluation.feedback && (
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Interviewer Assessment:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {evaluation.feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
