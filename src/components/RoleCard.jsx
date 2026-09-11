import React from 'react';
import { Layout, BrainCircuit, BarChart3, Code2, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Layout: Layout,
  BrainCircuit: BrainCircuit,
  BarChart3: BarChart3,
  Code2: Code2
};

export default function RoleCard({
  role,
  isSelected,
  onSelect,
  onStart
}) {
  const IconComponent = ICON_MAP[role.iconName] || Code2;

  return (
    <div
      onClick={() => onSelect(role.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(role.id);
        }
      }}
      className={`card-hover group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border text-left cursor-pointer transition-all duration-200 outline-none ${
        isSelected
          ? 'border-indigo-600 ring-2 ring-indigo-600/15 shadow-md shadow-indigo-100/50'
          : 'border-slate-200/90 hover:border-slate-300/90 shadow-2xs hover:shadow-sm'
      }`}
    >
      {/* Top Header & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200/80'
            }`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase block">
                Career Track
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                {role.title}
              </h3>
            </div>
          </div>

          {/* Selection indicator pill */}
          {isSelected ? (
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/80 animate-fadeIn shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Selected</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 shrink-0">
              <span>5 Qs</span>
            </div>
          )}
        </div>

        {/* Tagline & Description */}
        <p className="text-xs font-semibold text-indigo-600/90 mb-1.5">
          {role.tagline}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {role.description}
        </p>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {role.skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100/80 rounded-md border border-slate-200/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer Section with subtle difficulty indicator and CTA */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>~4 min simulation</span>
          </span>
          <span>Entry / Intern Level</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStart(role.id);
          }}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isSelected
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
              : 'bg-slate-900 hover:bg-slate-800 text-white group-hover:bg-indigo-600'
          }`}
        >
          <span>Start Simulation</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
