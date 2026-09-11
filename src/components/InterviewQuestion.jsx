import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function InterviewQuestion({
  question,
  answer,
  onChangeAnswer,
  onPrevious,
  onSubmit,
  isFirst,
  isLast,
  isSubmitting,
  totalQuestions = 5
}) {
  const [showTip, setShowTip] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleTextChange = (e) => {
    if (validationError) {
      setValidationError('');
    }
    onChangeAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = (answer || '').trim();
    if (!trimmed) {
      setValidationError('Please enter your answer before continuing.');
      return;
    }

    setValidationError('');
    onSubmit();
  };

  const charCount = (answer || '').length;
  const wordCount = (answer || '').trim() ? answer.trim().split(/\s+/).length : 0;
  const formattedNumber = String(question.questionNumber).padStart(2, '0');
  const formattedTotal = String(totalQuestions).padStart(2, '0');

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all">
      {/* Question Header: Category & Number */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
            QUESTION {formattedNumber} / {formattedTotal}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            {question.category}
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
          Technical Evaluation
        </span>
      </div>

      {/* Main Question Text (Visually Dominant) */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
        {question.question}
      </h3>

      {/* Guidance Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowTip(!showTip)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 rounded p-0.5"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showTip ? 'Hide answer guidance' : 'Show answer guidance & hints'}</span>
          </button>
          <span className="text-[11px] text-slate-400 hidden xs:inline">
            Tip: Explain in your own words with examples
          </span>
        </div>

        {showTip && (
          <div className="mt-2.5 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950 leading-relaxed animate-fadeIn">
            <span className="font-bold block mb-0.5 text-indigo-900">Interviewer Guidance:</span>
            {question.guidanceTip}
          </div>
        )}
      </div>

      {/* Form with Textarea and Validation */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="relative mb-2">
          <label htmlFor={`answer-${question.id}`} className="sr-only">
            Your Answer to Question {formattedNumber}
          </label>
          <textarea
            id={`answer-${question.id}`}
            rows={7}
            value={answer || ''}
            onChange={handleTextChange}
            placeholder="Type your answer here... (e.g. explain the concepts, technical trade-offs, and practical examples)"
            disabled={isSubmitting}
            className={`w-full p-4 sm:p-5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none transition-all resize-y min-h-[150px] max-h-[380px] leading-relaxed ${
              isSubmitting ? 'bg-slate-50 cursor-not-allowed opacity-90' : ''
            } ${
              validationError
                ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/10'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
        </div>

        {/* Inline Error Message */}
        {validationError && (
          <div
            id="validation-error-msg"
            role="alert"
            className="flex items-center gap-2 p-3 mb-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Counter & Technical Subtext */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 mb-6">
          <div className="flex items-center gap-3">
            <span>
              Words: <strong className="text-slate-800 font-semibold">{wordCount}</strong>
            </span>
            <span>
              Characters: <strong className="text-slate-800 font-semibold">{charCount}</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Evaluated with semantic AI analysis & relevance verification
          </span>
        </div>

        {/* Navigation Buttons (Standardized Button System) */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirst || isSubmitting}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              isFirst
                ? 'invisible'
                : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 active:scale-[0.98] disabled:opacity-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isSubmitting
                ? 'bg-indigo-500 cursor-not-allowed opacity-90'
                : isLast
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 focus-visible:ring-emerald-500'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 focus-visible:ring-indigo-500'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin shrink-0" />
                <span>Analyzing your answer...</span>
              </span>
            ) : isLast ? (
              <>
                <span>Finish Interview</span>
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
