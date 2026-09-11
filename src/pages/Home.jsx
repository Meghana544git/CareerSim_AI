import React from 'react';
import { ROLES } from '../data/roles';
import RoleCard from '../components/RoleCard';
import { Sparkles, ShieldCheck, Target, Zap, CheckCircle2, Award, Terminal } from 'lucide-react';

export default function Home({
  selectedRoleId,
  onSelectRole,
  onStartSimulation
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-mesh-pattern">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wider uppercase mb-4 shadow-xs">
          <Terminal className="w-3 h-3 text-indigo-400" />
          <span>Career Simulation Lab</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
          Discover How Ready You Are for Your <span className="text-indigo-600">Next Role</span>
        </h1>

        {/* Supporting Text */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto mb-5">
          Practice a role-specific interview, understand your strengths, identify skill gaps, and get a personalized improvement path.
        </p>

        {/* Small Visual Feature Indicators */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-500 bg-white/80 border border-slate-200/80 px-4 py-2 rounded-full shadow-2xs">
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            5 questions
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Instant assessment
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Personalized roadmap
          </span>
        </div>
      </div>

      {/* Role Selection Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Select Your Career Track
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Choose a target engineering or analytical discipline to launch your simulation.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 hidden sm:block">
            4 Industry Roles Available
          </span>
        </div>

        {/* 4 Role Cards Grid - 1-col on mobile, 2-col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {ROLES.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRoleId === role.id}
              onSelect={onSelectRole}
              onStart={onStartSimulation}
            />
          ))}
        </div>
      </div>

      {/* Methodological Value Props */}
      <div className="pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-0.5">
              Role-Specific Rubrics
            </h4>
            <p className="text-xs text-slate-500 leading-normal">
              Technical prompts tailored to real college internship and junior engineer interviews.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-0.5">
              Deterministic Concept Scoring
            </h4>
            <p className="text-xs text-slate-500 leading-normal">
              Transparent multi-concept cluster extraction with 100% offline reliability.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-0.5">
              Targeted Career Roadmaps
            </h4>
            <p className="text-xs text-slate-500 leading-normal">
              4 concrete, prioritized milestones directly derived from your weakest competencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
