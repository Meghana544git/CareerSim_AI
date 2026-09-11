import React, { useRef } from 'react';
import ScoreCard from '../components/ScoreCard';
import SkillBar from '../components/SkillBar';
import StrengthCard from '../components/StrengthCard';
import WeaknessCard from '../components/WeaknessCard';
import RoadmapItem from '../components/RoadmapItem';
import QuestionEvaluationCard from '../components/QuestionEvaluationCard';
import { getQuestionsForRole } from '../data/questions';
import { RotateCcw, LayoutGrid, ArrowDown, History, Sparkles, MapPin, Terminal, CheckCircle2 } from 'lucide-react';

export default function Results({
  assessmentResult,
  roadmapProgress = {},
  onToggleRoadmapItem,
  onRetakeInterview,
  onSelectAnotherRole,
  onOpenHistory
}) {
  const roadmapRef = useRef(null);

  if (!assessmentResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Assessment Available</h2>
        <p className="text-sm text-slate-500 mb-6">Please complete a simulation first.</p>
        <button
          onClick={onSelectAnotherRole}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm"
        >
          Choose a Career Role
        </button>
      </div>
    );
  }

  const {
    roleId,
    roleTitle,
    overallReadiness,
    readinessTier,
    tierBadgeColor,
    summary,
    skillBreakdown,
    strengths,
    weaknesses,
    evaluatedQuestions = [],
    roadmap
  } = assessmentResult;

  const questions = getQuestionsForRole(roleId);

  const scrollToRoadmap = () => {
    roadmapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-mesh-pattern">
      {/* Top Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-bold text-slate-700">
            Assessment Completed
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={scrollToRoadmap}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all active:scale-[0.98]"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>View Roadmap</span>
          </button>

          <button
            type="button"
            onClick={onRetakeInterview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Retake</span>
          </button>

          <button
            type="button"
            onClick={onSelectAnotherRole}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all active:scale-[0.98] shadow-xs"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Choose Another Role</span>
          </button>
        </div>
      </div>

      {/* 1. Score Presentation & Hero */}
      <ScoreCard
        roleTitle={roleTitle}
        overallReadiness={overallReadiness}
        readinessTier={readinessTier}
        tierBadgeColor={tierBadgeColor}
        summary={summary}
      />

      {/* 2. Competency Breakdown */}
      <SkillBar skillBreakdown={skillBreakdown} />

      {/* 3. Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <StrengthCard strengths={strengths} />
        <WeaknessCard weaknesses={weaknesses} />
      </div>

      {/* 4. Question-by-Question Detailed Evaluation Breakdown */}
      {evaluatedQuestions && evaluatedQuestions.length > 0 && (
        <div className="mb-12 pt-8 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SEMANTIC ANSWER ANALYSIS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Question-by-Question Evaluation Breakdown
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Detailed evaluation of each response: what was correct, what was incorrect, irrelevant content, and missing concepts.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              5 Questions Analyzed
            </span>
          </div>

          <div className="space-y-3">
            {evaluatedQuestions.map((evalItem, idx) => {
              const qData = questions.find((q) => q.id === evalItem.questionId) || questions[idx];
              return (
                <QuestionEvaluationCard
                  key={evalItem.questionId || idx}
                  evaluation={evalItem}
                  question={qData}
                  index={idx}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Personalized Improvement Roadmap */}
      <div ref={roadmapRef} className="pt-8 border-t border-slate-200/80 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>YOUR NEXT STEPS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Personalized Improvement Roadmap
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Prioritized milestones targeting your lowest-scoring competencies to maximize your hiring readiness.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            4 Milestones Generated
          </span>
        </div>

        {/* Roadmap Items List with visual connection */}
        <div className="space-y-4">
          {roadmap.map((item, idx) => (
            <RoadmapItem
              key={item.id}
              item={item}
              isCompleted={!!roadmapProgress[item.id]}
              onToggleStatus={onToggleRoadmapItem}
              isLastStep={idx === roadmap.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-6 sm:p-7 bg-slate-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h4 className="text-base font-bold mb-1">
            Ready to measure your progress?
          </h4>
          <p className="text-xs text-slate-300">
            Retake the simulation anytime to practice your articulation and update your benchmark score.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRetakeInterview}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] shadow-sm shadow-indigo-900/50"
          >
            Retake Simulation
          </button>
          <button
            type="button"
            onClick={onSelectAnotherRole}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs sm:text-sm transition-all border border-slate-700"
          >
            Explore Other Roles
          </button>
        </div>
      </div>
    </div>
  );
}
