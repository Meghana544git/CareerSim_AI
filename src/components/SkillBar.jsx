import React from 'react';

export default function SkillBar({
  skillBreakdown
}) {
  const skills = [
    { label: 'Technical Skills', value: skillBreakdown.technicalSkills, color: 'bg-indigo-600' },
    { label: 'Problem Solving', value: skillBreakdown.problemSolving, color: 'bg-purple-600' },
    { label: 'Communication', value: skillBreakdown.communication, color: 'bg-teal-600' },
    { label: 'Role Knowledge', value: skillBreakdown.roleKnowledge, color: 'bg-sky-600' },
    { label: 'Interview Performance', value: skillBreakdown.interviewPerformance, color: 'bg-emerald-600' }
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-7 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-5 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Competency Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Calculated across fundamental technical, problem-solving, and communication dimensions.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          Benchmark: 75%
        </span>
      </div>

      <div className="space-y-4">
        {skills.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
              <span className="text-slate-700">{item.label}</span>
              <span className="text-slate-900 font-bold">{item.value}%</span>
            </div>

            {/* Bar Track with smooth animated indicator */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${item.value === 0 ? 0 : Math.min(100, Math.max(3, item.value))}%` }}
                role="progressbar"
                aria-valuenow={item.value}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
