export const ROLES = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    iconName: 'Layout',
    tagline: 'Build modern, responsive web experiences.',
    description: 'Design and implement intuitive, high-performance user interfaces using modern web standards, component architectures, and responsive layouts.',
    skills: ['HTML & CSS', 'JavaScript (ES6+)', 'React', 'Responsive Design'],
    color: {
      primary: 'indigo',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-600',
      borderHover: 'hover:border-indigo-400',
      accent: '#6366f1'
    }
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    iconName: 'BrainCircuit',
    tagline: 'Develop and deploy intelligent machine learning systems.',
    description: 'Train, optimize, and deploy predictive models, neural networks, and ML pipelines that translate raw data into production-ready intelligence.',
    skills: ['Python', 'Model Evaluation', 'Feature Engineering', 'PyTorch / Scikit-Learn'],
    color: {
      primary: 'purple',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-600',
      borderHover: 'hover:border-purple-400',
      accent: '#a855f7'
    }
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    iconName: 'BarChart3',
    tagline: 'Transform raw datasets into actionable business insights.',
    description: 'Leverage SQL querying, exploratory analysis, metrics dashboards, and statistical models to answer strategic business questions.',
    skills: ['SQL Querying', 'Data Cleaning', 'BI Dashboards', 'Statistical Analysis'],
    color: {
      primary: 'emerald',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-600',
      borderHover: 'hover:border-emerald-400',
      accent: '#10b981'
    }
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    iconName: 'Code2',
    tagline: 'Architect robust, scalable, and maintainable software systems.',
    description: 'Design end-to-end applications, master algorithms and data structures, apply clean coding standards, and build resilient backend APIs.',
    skills: ['Data Structures', 'OOP & Design Patterns', 'REST APIs', 'System Reliability'],
    color: {
      primary: 'sky',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      iconBg: 'bg-sky-100 text-sky-600',
      borderHover: 'hover:border-sky-400',
      accent: '#0ea5e9'
    }
  }
];

export function getRoleById(roleId) {
  return ROLES.find(r => r.id === roleId) || null;
}
