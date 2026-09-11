export const QUESTIONS_BY_ROLE = {
  'frontend-developer': [
    {
      id: 'fe-1',
      roleId: 'frontend-developer',
      questionNumber: 1,
      category: 'Technical Skills',
      question: 'What is the difference between HTML, CSS, and JavaScript, and how do they work together to create an interactive web page?',
      guidanceTip: 'Mention the core role of each layer: HTML for structure/semantics, CSS for styling/presentation, and JavaScript for behavior/interactivity.',
      conceptClusters: [
        {
          name: 'HTML Structure & Semantics',
          patterns: ['html', 'structure', 'skeleton', 'content', 'semantic', 'markup', 'elements', 'tag']
        },
        {
          name: 'CSS Styling & Appearance',
          patterns: ['css', 'style', 'styling', 'presentation', 'appearance', 'visual', 'layout', 'design', 'color']
        },
        {
          name: 'JavaScript Interactivity & Behavior',
          patterns: ['javascript', 'js', 'behavior', 'interactivity', 'interactive', 'dynamic', 'logic', 'event', 'action']
        },
        {
          name: 'Collaboration & DOM Integration',
          patterns: ['dom', 'browser', 'render', 'manipulat', 'together', 'tree', 'combine', 'parse', 'work together', 'listener']
        }
      ],
      exemplaryKeywords: ['semantic html', 'dom tree', 'cssom', 'event listener', 'accessibility', 'render tree'],
      categoryWeights: { technical: 0.5, problemSolving: 0.1, communication: 0.2, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Solid breakdown of web fundamentals. You clearly distinguished between structure, styling, and behavior.',
      improvementFeedback: 'Consider detailing DOM manipulation and how semantic HTML aids web accessibility.'
    },
    {
      id: 'fe-2',
      roleId: 'frontend-developer',
      questionNumber: 2,
      category: 'Role Knowledge',
      question: 'What is responsive web design, and what specific techniques (like media queries, flexbox, or viewport units) do you use to ensure sites work across mobile and desktop?',
      guidanceTip: 'Highlight mobile-first approaches, CSS Flexbox/Grid, fluid layouts, viewport meta tag, and media queries.',
      conceptClusters: [
        {
          name: 'Device & Screen Adaptability',
          patterns: ['adapt', 'screen', 'device', 'mobile', 'tablet', 'desktop', 'resolution', 'viewport']
        },
        {
          name: 'Media Queries & Breakpoints',
          patterns: ['media quer', '@media', 'breakpoint']
        },
        {
          name: 'Flexible Layouts & Units',
          patterns: ['flexbox', 'grid', 'flexible', 'fluid', 'layout', 'percentage', 'rem', 'em', 'vw', 'vh', 'relative unit']
        },
        {
          name: 'Core Responsive Concepts',
          patterns: ['responsive', 'mobile-first', 'meta viewport', 'scaling', 'shrink', 'expand', 'resize', 'fit']
        }
      ],
      exemplaryKeywords: ['mobile-first', 'container queries', 'fluid typography', 'picture element', 'meta viewport', 'calc'],
      categoryWeights: { technical: 0.3, problemSolving: 0.2, communication: 0.1, roleKnowledge: 0.3, interviewPerformance: 0.1 },
      goodFeedback: 'Great grasp of responsive design principles and layout techniques across modern screen sizes.',
      improvementFeedback: 'Strengthen your answer by mentioning mobile-first development paradigms and dynamic viewport units.'
    },
    {
      id: 'fe-3',
      roleId: 'frontend-developer',
      questionNumber: 3,
      category: 'Problem Solving',
      question: 'How do you diagnose and optimize a slow-loading web application that has heavy images, large bundle sizes, and sluggish UI interactions?',
      guidanceTip: 'Discuss browser DevTools (Lighthouse/Performance tab), lazy loading, code splitting, image compression (WebP/AVIF), and minimizing DOM re-renders.',
      conceptClusters: [
        {
          name: 'Diagnostics & Profiling Tools',
          patterns: ['devtools', 'lighthouse', 'network tab', 'profil', 'audit', 'performance tab', 'waterfall', 'metric', 'core web vital', 'diagnos']
        },
        {
          name: 'Image & Asset Optimization',
          patterns: ['compress', 'image', 'webp', 'avif', 'svg', 'lazy load', 'cdn', 'asset', 'resiz', 'media']
        },
        {
          name: 'Bundle & Code Splitting',
          patterns: ['bundle', 'code split', 'tree shak', 'minif', 'minify', 'chunk', 'dynamic import', 'defer', 'async']
        },
        {
          name: 'Runtime & Rendering Efficiency',
          patterns: ['re-render', 'dom', 'cache', 'caching', 'memo', 'debounce', 'throttle', 'critical render', 'optimiz']
        }
      ],
      exemplaryKeywords: ['tree shaking', 'critical rendering path', 'webp', 'debounce', 'throttle', 'code splitting', 'lcp', 'cls'],
      categoryWeights: { technical: 0.3, problemSolving: 0.4, communication: 0.1, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Excellent analytical approach to web performance profiling and concrete asset optimization strategies.',
      improvementFeedback: 'You can enrich this by explaining how code-splitting and tree-shaking reduce initial JavaScript bundle overhead.'
    },
    {
      id: 'fe-4',
      roleId: 'frontend-developer',
      questionNumber: 4,
      category: 'Technical Skills',
      question: 'Explain state management in React. When would you use local component state (useState) versus global state (Context/Redux), and how do you prevent unnecessary re-renders?',
      guidanceTip: 'Contrast component-level state with shared application state. Mention techniques like useMemo, useCallback, React.memo, and state colocation.',
      conceptClusters: [
        {
          name: 'Local Component State',
          patterns: ['usestate', 'local state', 'component state', 'isolated', 'internal state', 'single component', 'local']
        },
        {
          name: 'Global & Shared State',
          patterns: ['global', 'context', 'redux', 'zustand', 'shared state', 'prop drill', 'lift state', 'multiple component']
        },
        {
          name: 'State Scope Decision Trade-offs',
          patterns: ['simple', 'complex', 'when to use', 'deeply nested', 'pass down', 'app-level', 'shared across', 'prop drilling', 'scope']
        },
        {
          name: 'Re-render Prevention Techniques',
          patterns: ['re-render', 'render', 'memo', 'usememo', 'usecallback', 'react.memo', 'colocat', 'immutab', 'prevent']
        }
      ],
      exemplaryKeywords: ['state colocation', 'usememo', 'usecallback', 'react.memo', 'prop drilling', 'immutability', 'reducer'],
      categoryWeights: { technical: 0.5, problemSolving: 0.2, communication: 0.1, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Strong clarity on React state paradigms, lifecycles, and render optimization hooks.',
      improvementFeedback: 'Highlight state colocation (keeping state as close to where it is used as possible) to prevent prop drilling.'
    },
    {
      id: 'fe-5',
      roleId: 'frontend-developer',
      questionNumber: 5,
      category: 'Communication',
      question: 'Describe a challenging UI bug or cross-browser issue you encountered. How did you isolate the problem, test the resolution, and communicate it to your team?',
      guidanceTip: 'Use a structured STAR method: Situation, Task, Action, Result. Mention debugging steps, reproducing edge cases, and documentation or PR explanations.',
      conceptClusters: [
        {
          name: 'Bug Context & Symptoms',
          patterns: ['bug', 'issue', 'inconsistency', 'layout', 'rendering', 'cross-browser', 'safari', 'firefox', 'chrome', 'edge', 'browser']
        },
        {
          name: 'Isolation & Root Cause Analysis',
          patterns: ['isolate', 'debug', 'console', 'reproduce', 'inspect', 'devtools', 'root cause', 'breakpoint', 'edge case', 'investigat']
        },
        {
          name: 'Resolution & Cross-Browser Testing',
          patterns: ['fix', 'polyfill', 'fallback', 'solution', 'patch', 'workaround', 'unit test', 'test', 'verif', 'resolved']
        },
        {
          name: 'Team Communication & Documentation',
          patterns: ['communicat', 'team', 'pull request', 'pr', 'document', 'explain', 'ticket', 'review', 'star', 'jira', 'share']
        }
      ],
      exemplaryKeywords: ['star method', 'pull request', 'git bisect', 'cross-browser compatibility', 'regression testing', 'post-mortem'],
      categoryWeights: { technical: 0.1, problemSolving: 0.2, communication: 0.4, roleKnowledge: 0.1, interviewPerformance: 0.2 },
      goodFeedback: 'Clear structured storytelling and effective articulation of troubleshooting under pressure.',
      improvementFeedback: 'Try formatting collaborative technical anecdotes using the STAR method (Situation, Task, Action, Result).'
    }
  ],

  'ml-engineer': [
    {
      id: 'ml-1',
      roleId: 'ml-engineer',
      questionNumber: 1,
      category: 'Technical Skills',
      question: 'Explain the fundamental differences between supervised, unsupervised, and reinforcement learning, giving a real-world application for each.',
      guidanceTip: 'Distinguish labeled data (classification/regression) from unlabeled data (clustering/PCA) and reward-based agent learning (game playing/robotics).',
      conceptClusters: [
        {
          name: 'Supervised Learning & Labeled Data',
          patterns: ['supervised', 'label', 'ground truth', 'classification', 'regression', 'target']
        },
        {
          name: 'Unsupervised Learning & Pattern Discovery',
          patterns: ['unsupervised', 'unlabeled', 'cluster', 'k-means', 'pca', 'pattern', 'dimensionality']
        },
        {
          name: 'Reinforcement Learning & Agent Rewards',
          patterns: ['reinforcement', 'agent', 'environment', 'reward', 'penalty', 'policy', 'action', 'q-learning', 'feedback']
        },
        {
          name: 'Practical Real-World Examples',
          patterns: ['example', 'fraud', 'spam', 'image', 'customer segment', 'robotics', 'game', 'chess', 'autonomous', 'diagnosis', 'recommend']
        }
      ],
      exemplaryKeywords: ['ground truth', 'q-learning', 'policy gradient', 'k-means', 'feature representation', 'markov decision process'],
      categoryWeights: { technical: 0.5, problemSolving: 0.1, communication: 0.2, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Clear differentiation between core learning paradigms with relevant practical use cases.',
      improvementFeedback: 'Include concrete examples of objective functions or loss optimization in each paradigm.'
    },
    {
      id: 'ml-2',
      roleId: 'ml-engineer',
      questionNumber: 2,
      category: 'Problem Solving',
      question: 'What is overfitting in machine learning models, how do you detect it during training, and what specific regularization techniques do you apply to mitigate it?',
      guidanceTip: 'Discuss high variance, disparity between training and validation loss, dropout, L1/L2 regularization, data augmentation, and early stopping.',
      conceptClusters: [
        {
          name: 'Overfitting Concept & High Variance',
          patterns: ['overfit', 'variance', 'memoriz', 'generaliz', 'training data', 'noise', 'fit too closely', 'unseen data', 'unseen']
        },
        {
          name: 'Detection via Validation Curves',
          patterns: ['detect', 'validation', 'training loss', 'diverg', 'evaluat', 'curve', 'cross-validation', 'test set', 'gap']
        },
        {
          name: 'Regularization Techniques',
          patterns: ['regulariz', 'l1', 'l2', 'ridge', 'lasso', 'dropout', 'weight decay', 'penalty']
        },
        {
          name: 'Data & Early Stopping Strategies',
          patterns: ['early stop', 'data augment', 'more data', 'simpler model', 'complex', 'complexity', 'decision tree', 'pruning', 'feature selection', 'stopping']
        }
      ],
      exemplaryKeywords: ['bias-variance trade-off', 'l1 regularization', 'l2 regularization', 'dropout', 'data augmentation', 'early stopping'],
      categoryWeights: { technical: 0.3, problemSolving: 0.4, communication: 0.1, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Strong understanding of model generalization error and pragmatic regularization strategies.',
      improvementFeedback: 'Be sure to mention monitoring learning curves and validation loss divergence for early stopping.'
    },
    {
      id: 'ml-3',
      roleId: 'ml-engineer',
      questionNumber: 3,
      category: 'Role Knowledge',
      question: 'Why is data preprocessing and feature engineering frequently more impactful on model accuracy than selecting a more sophisticated model architecture?',
      guidanceTip: 'Mention the "garbage in, garbage out" principle, handling outliers, normalization/scaling, encoding categorical features, and domain-driven feature extraction.',
      conceptClusters: [
        {
          name: 'Data Quality & Garbage In Garbage Out',
          patterns: ['garbage in', 'quality', 'clean data', 'raw data', 'noisy', 'foundation', 'signal', 'clean']
        },
        {
          name: 'Data Preprocessing Techniques',
          patterns: ['preprocess', 'missing', 'null', 'imput', 'outlier', 'normaliz', 'scal', 'standardiz']
        },
        {
          name: 'Feature Engineering & Domain Knowledge',
          patterns: ['feature engineer', 'feature extract', 'domain knowledge', 'encoding', 'one-hot', 'transform', 'feature']
        },
        {
          name: 'Impact Over Complex Architectures',
          patterns: ['complex model', 'architecture', 'simpler model', 'performance', 'accuracy', 'data leakage', 'informative']
        }
      ],
      exemplaryKeywords: ['data leakage', 'one-hot encoding', 'domain knowledge', 'imputation', 'feature representation', 'collinearity'],
      categoryWeights: { technical: 0.2, problemSolving: 0.2, communication: 0.1, roleKnowledge: 0.4, interviewPerformance: 0.1 },
      goodFeedback: 'Excellent industry perspective recognizing that data quality dictates production ML performance.',
      improvementFeedback: 'Mention the danger of data leakage during transformation steps like scaling or target encoding.'
    },
    {
      id: 'ml-4',
      roleId: 'ml-engineer',
      questionNumber: 4,
      category: 'Technical Skills',
      question: 'Explain the trade-offs between Precision and Recall. In what specific production scenario would you intentionally prioritize high Recall over high Precision?',
      guidanceTip: 'Define true positives, false positives, false negatives. Highlight medical diagnosis, fraud alert screening, or safety-critical defect detection.',
      conceptClusters: [
        {
          name: 'Precision & False Positive Trade-off',
          patterns: ['precision', 'false positive', 'positive prediction', 'accurate positive']
        },
        {
          name: 'Recall & False Negative Trade-off',
          patterns: ['recall', 'false negative', 'missed case', 'sensitivity', 'catch', 'detect all']
        },
        {
          name: 'Prioritizing Recall & Cost of Misses',
          patterns: ['prioritize recall', 'high recall', 'cost of miss', 'worse to miss', 'cannot afford', 'trade-off', 'threshold', 'priority']
        },
        {
          name: 'Concrete Production Scenario',
          patterns: ['medical', 'cancer', 'disease', 'diagnos', 'fraud', 'security', 'defect', 'alert', 'screening', 'safety']
        }
      ],
      exemplaryKeywords: ['roc-auc', 'confusion matrix', 'f1-score', 'false negatives', 'classification threshold', 'sensitivity'],
      categoryWeights: { technical: 0.4, problemSolving: 0.3, communication: 0.1, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Accurate grasp of classification metrics and the business cost of false negative errors.',
      improvementFeedback: 'Discuss how adjusting classification probability thresholds shifts the operating point on the ROC curve.'
    },
    {
      id: 'ml-5',
      roleId: 'ml-engineer',
      questionNumber: 5,
      category: 'Communication',
      question: 'How would you explain the decision logic of a complex "black box" model (e.g., XGBoost or Deep Neural Network) to non-technical business stakeholders?',
      guidanceTip: 'Discuss SHAP values, feature importance, partial dependence plots, analogy-based explanations, and connecting technical weights to business KPIs.',
      conceptClusters: [
        {
          name: 'Interpretability Frameworks & Features',
          patterns: ['shap', 'lime', 'feature importance', 'interpret', 'explain', 'surrogate', 'partial dependence', 'weight', 'driver']
        },
        {
          name: 'Non-Technical Communication & Analogies',
          patterns: ['non-technical', 'stakeholder', 'analogy', 'simple term', 'jargon', 'plain language', 'intuitive', 'visual']
        },
        {
          name: 'Business Context & KPI Alignment',
          patterns: ['business', 'roi', 'impact', 'decision', 'metric', 'kpi', 'revenue', 'actionable', 'value']
        },
        {
          name: 'Building Trust & Accountability',
          patterns: ['trust', 'confidence', 'transparency', 'validate', 'reasoning', 'why', 'compliance']
        }
      ],
      exemplaryKeywords: ['shap values', 'lime', 'feature importance', 'business impact', 'model transparency', 'analogy'],
      categoryWeights: { technical: 0.1, problemSolving: 0.2, communication: 0.4, roleKnowledge: 0.1, interviewPerformance: 0.2 },
      goodFeedback: 'Great stakeholder communication approach, translating algorithmic weights into clear business levers.',
      improvementFeedback: 'Introduce model interpretability frameworks like SHAP or LIME to quantify individual prediction contributions.'
    }
  ],

  'data-analyst': [
    {
      id: 'da-1',
      roleId: 'data-analyst',
      questionNumber: 1,
      category: 'Technical Skills',
      question: 'What is the difference between WHERE and HAVING clauses in SQL, and when do you use aggregate functions like COUNT or SUM with GROUP BY?',
      guidanceTip: 'WHERE filters rows before aggregation; HAVING filters groups after aggregation. GROUP BY clusters rows sharing common values.',
      conceptClusters: [
        {
          name: 'WHERE Row-Level Filtering',
          patterns: ['where', 'before aggregat', 'row level', 'filter row', 'individual row', 'pre-filter', 'raw data']
        },
        {
          name: 'HAVING Group-Level Filtering',
          patterns: ['having', 'after aggregat', 'filter group', 'group level', 'aggregated condition', 'post-filter']
        },
        {
          name: 'GROUP BY & Aggregations',
          patterns: ['group by', 'aggregate', 'count', 'sum', 'avg', 'min', 'max', 'summary']
        },
        {
          name: 'SQL Query Context & Execution',
          patterns: ['sql', 'query', 'syntax', 'order of execution', 'from', 'select', 'table', 'dataset', 'relational database']
        }
      ],
      exemplaryKeywords: ['order of execution', 'window functions', 'aggregate functions', 'predicate pushdown', 'subquery'],
      categoryWeights: { technical: 0.5, problemSolving: 0.1, communication: 0.1, roleKnowledge: 0.2, interviewPerformance: 0.1 },
      goodFeedback: 'Accurate distinction between pre-aggregation row filtering and post-aggregation group filtering.',
      improvementFeedback: 'Mention SQL order of execution (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY).'
    },
    {
      id: 'da-2',
      roleId: 'data-analyst',
      questionNumber: 2,
      category: 'Problem Solving',
      question: 'How do you identify and handle missing values, duplicates, and inconsistent data types when preparing a messy transactional dataset for reporting?',
      guidanceTip: 'Mention profiling, null imputation strategies (mean/median/mode vs dropping), deduplication on unique primary keys, and data casting.',
      conceptClusters: [
        {
          name: 'Missing Value Handling & Imputation',
          patterns: ['missing', 'null', 'imput', 'mean', 'median', 'mode', 'drop', 'fillna', 'fill']
        },
        {
          name: 'Deduplication & Primary Keys',
          patterns: ['duplicate', 'dedup', 'unique', 'primary key', 'distinct', 'drop duplicates', 'transaction id', 'id']
        },
        {
          name: 'Inconsistent Data Types & Formatting',
          patterns: ['inconsistent', 'data type', 'type', 'cast', 'format', 'standardiz', 'date', 'convert', 'schema']
        },
        {
          name: 'Profiling & Data Integrity Checks',
          patterns: ['profil', 'inspect', 'validate', 'audit', 'check', 'summary stat', 'integrity', 'clean']
        }
      ],
      exemplaryKeywords: ['median imputation', 'data profiling', 'primary keys', 'type casting', 'data integrity', 'outliers'],
      categoryWeights: { technical: 0.3, problemSolving: 0.4, communication: 0.1, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Methodical data sanitation process ensuring reporting integrity and reproducible cleaning pipelines.',
      improvementFeedback: 'Specify when imputing with median is superior to mean for skewed distributions containing outliers.'
    },
    {
      id: 'da-3',
      roleId: 'data-analyst',
      questionNumber: 3,
      category: 'Role Knowledge',
      question: 'What is Exploratory Data Analysis (EDA)? What specific statistical measures and visualizations do you run first when inspecting a new dataset?',
      guidanceTip: 'Highlight summary statistics (mean, median, variance, min/max), distribution histograms, box plots for outliers, and correlation heatmaps.',
      conceptClusters: [
        {
          name: 'EDA Purpose & Exploration',
          patterns: ['eda', 'exploratory', 'understand data', 'discover pattern', 'hypothes', 'initial inspection', 'explore']
        },
        {
          name: 'Descriptive Summary Statistics',
          patterns: ['summary stat', 'mean', 'median', 'mode', 'std', 'standard deviation', 'min', 'max', 'quartil', 'percentil', 'statistic']
        },
        {
          name: 'Distribution & Outlier Visualizations',
          patterns: ['distribution', 'skew', 'outlier', 'histogram', 'box plot', 'boxplot', 'anomal']
        },
        {
          name: 'Correlations & Variable Relationships',
          patterns: ['correlation', 'scatter', 'heatmap', 'relationship', 'multivariate', 'pairplot', 'variable']
        }
      ],
      exemplaryKeywords: ['summary statistics', 'correlation heatmap', 'box plot', 'distribution skewness', 'outlier detection', 'eda'],
      categoryWeights: { technical: 0.3, problemSolving: 0.2, communication: 0.1, roleKnowledge: 0.3, interviewPerformance: 0.1 },
      goodFeedback: 'Comprehensive EDA checklist combining descriptive statistics with visual pattern discovery.',
      improvementFeedback: 'Emphasize checking for multicollinearity and variable distributions before building downstream models.'
    },
    {
      id: 'da-4',
      roleId: 'data-analyst',
      questionNumber: 4,
      category: 'Technical Skills',
      question: 'How do you determine the most effective chart type (e.g., bar chart vs line chart vs scatter plot) to communicate insights to executives without cognitive overload?',
      guidanceTip: 'Line charts for trends over time, bar charts for discrete categorical comparisons, scatter plots for relationships, avoiding clutter/pie charts.',
      conceptClusters: [
        {
          name: 'Line Charts for Trends Over Time',
          patterns: ['line chart', 'line graph', 'trend', 'time', 'over time', 'continuous', 'temporal', 'timeline']
        },
        {
          name: 'Bar Charts for Categorical Comparison',
          patterns: ['bar chart', 'bar graph', 'categorical', 'categor', 'comparison', 'compare group', 'discrete']
        },
        {
          name: 'Scatter Plots for Correlation',
          patterns: ['scatter', 'relationship', 'correlation', 'two variable', 'distribution of point', 'bivariate']
        },
        {
          name: 'Executive Clarity & Low Cognitive Load',
          patterns: ['executive', 'clarity', 'cognitive load', 'data-ink', 'simple', 'actionable', 'dashboard', 'storytelling', 'clutter']
        }
      ],
      exemplaryKeywords: ['cognitive load', 'data-to-ink ratio', 'actionable insights', 'chart selection', 'data storytelling'],
      categoryWeights: { technical: 0.4, problemSolving: 0.1, communication: 0.3, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Thoughtful data visualization principles prioritizing clarity, audience context, and low cognitive load.',
      improvementFeedback: 'Reference Edward Tufte’s "data-ink ratio" or intentional use of color accents to highlight key takeaways.'
    },
    {
      id: 'da-5',
      roleId: 'data-analyst',
      questionNumber: 5,
      category: 'Communication',
      question: 'Describe an instance where your data analysis contradicted a widely held assumption by business leadership. How did you present your findings effectively?',
      guidanceTip: 'Focus on empathy, objective visual evidence, root cause analysis, actionable recommendations, and facilitating collaborative discussion.',
      conceptClusters: [
        {
          name: 'Contradiction or Unexpected Finding',
          patterns: ['assumption', 'contradict', 'finding', 'insight', 'trend', 'anomaly', 'unexpected', 'discovery', 'contrary', 'belief']
        },
        {
          name: 'Objective Evidence & Data Validation',
          patterns: ['data', 'evidence', 'metric', 'validate', 'sample', 'verify', 'number', 'chart', 'empirical', 'proof']
        },
        {
          name: 'Stakeholder Presentation & Diplomacy',
          patterns: ['present', 'stakeholder', 'leadership', 'meeting', 'walk through', 'visual', 'storytelling', 'objective', 'empath']
        },
        {
          name: 'Actionable Business Decision',
          patterns: ['action', 'decision', 'recommendation', 'change strategy', 'convince', 'agree', 'result', 'impact', 'next step']
        }
      ],
      exemplaryKeywords: ['data storytelling', 'objective evidence', 'stakeholder alignment', 'root cause analysis', 'actionable recommendations'],
      categoryWeights: { technical: 0.1, problemSolving: 0.2, communication: 0.4, roleKnowledge: 0.1, interviewPerformance: 0.2 },
      goodFeedback: 'Mature stakeholder alignment skill, using objective empirical evidence to guide strategic decisions.',
      improvementFeedback: 'Ground unexpected discoveries with sensitivity analysis to show the financial impact of taking action.'
    }
  ],

  'software-engineer': [
    {
      id: 'se-1',
      roleId: 'software-engineer',
      questionNumber: 1,
      category: 'Technical Skills',
      question: 'Compare an Array with a Singly Linked List regarding memory layout, contiguous allocation, and Big-O time complexity for random access vs insertion.',
      guidanceTip: 'Arrays have contiguous memory and O(1) random access but O(n) middle insertions. Linked lists have pointer overhead and O(n) access but O(1) insertions given a node pointer.',
      conceptClusters: [
        {
          name: 'Memory Layout & Allocation',
          patterns: ['contiguous', 'memory', 'pointer', 'node', 'cache locality', 'allocation', 'reference', 'element']
        },
        {
          name: 'Random Access & Index Lookup',
          patterns: ['random access', 'index', 'lookup', 'o(1)', 'constant access', 'o(n) access', 'traverse', 'access']
        },
        {
          name: 'Insertion & Deletion Time Complexity',
          patterns: ['insert', 'delet', 'o(1) insert', 'o(n)', 'shift', 'repoint', 'middle', 'head']
        },
        {
          name: 'Trade-offs & Overhead',
          patterns: ['trade-off', 'overhead', 'resize', 'dynamic array', 'capacity', 'spatial locality', 'difference']
        }
      ],
      exemplaryKeywords: ['cache locality', 'contiguous memory', 'constant time', 'pointer overhead', 'big-o complexity'],
      categoryWeights: { technical: 0.5, problemSolving: 0.2, communication: 0.1, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Accurate theoretical and algorithmic comparison of fundamental data structures and memory layouts.',
      improvementFeedback: 'Mention CPU cache locality—arrays benefit from spatial locality, reducing cache misses relative to linked nodes.'
    },
    {
      id: 'se-2',
      roleId: 'software-engineer',
      questionNumber: 2,
      category: 'Problem Solving',
      question: 'How would you design a Least Recently Used (LRU) Cache? Which data structures combine to allow both get() and put() operations in O(1) time complexity?',
      guidanceTip: 'Combine a Hash Map (O(1) key-node lookup) with a Doubly Linked List (O(1) node removal and eviction from head/tail).',
      conceptClusters: [
        {
          name: 'Hash Map for O(1) Lookup',
          patterns: ['hash map', 'hash table', 'dictionary', 'map', 'o(1) lookup', 'key', 'o(1) get', 'lookup']
        },
        {
          name: 'Doubly Linked List for O(1) Node Updates',
          patterns: ['doubly linked list', 'linked list', 'prev', 'next', 'node', 'o(1) remove', 'head', 'tail']
        },
        {
          name: 'Eviction Policy & Recency Ordering',
          patterns: ['evict', 'least recently used', 'lru', 'head', 'tail', 'most recent', 'capacity', 'order']
        },
        {
          name: 'O(1) Get and Put Invariant',
          patterns: ['get', 'put', 'o(1)', 'constant time', 'move to head', 'update order', 'operation']
        }
      ],
      exemplaryKeywords: ['hash map', 'doubly linked list', 'constant time', 'sentinel nodes', 'eviction policy', 'o(1) complexity'],
      categoryWeights: { technical: 0.3, problemSolving: 0.4, communication: 0.1, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Excellent algorithmic intuition pairing a hash table with a doubly linked list for optimal O(1) caching.',
      improvementFeedback: 'Mention using dummy head and tail sentinel nodes to eliminate edge cases during pointer reassignment.'
    },
    {
      id: 'se-3',
      roleId: 'software-engineer',
      questionNumber: 3,
      category: 'Role Knowledge',
      question: 'What are the principles of RESTful API architecture? Explain the purpose of HTTP methods (GET, POST, PUT, DELETE) and key HTTP status code families (2xx, 4xx, 5xx).',
      guidanceTip: 'Mention statelessness, resource-oriented URIs, idempotency (PUT vs POST), client error codes (400, 401, 404) vs server errors (500, 503).',
      conceptClusters: [
        {
          name: 'REST Architecture Principles',
          patterns: ['stateless', 'resource', 'uri', 'endpoint', 'client-server', 'crud', 'api']
        },
        {
          name: 'HTTP Verbs & Idempotency',
          patterns: ['get', 'post', 'put', 'delete', 'http method', 'verb', 'idempotent']
        },
        {
          name: 'HTTP Status Code Families',
          patterns: ['status code', '200', '201', '2xx', '400', '401', '404', '4xx', '500', '503', '5xx', 'success', 'client error', 'server error']
        },
        {
          name: 'Communication Contract & Payloads',
          patterns: ['payload', 'json', 'header', 'request', 'response', 'representation']
        }
      ],
      exemplaryKeywords: ['idempotency', 'stateless architecture', 'resource-oriented', 'http status codes', 'crud operations'],
      categoryWeights: { technical: 0.3, problemSolving: 0.1, communication: 0.1, roleKnowledge: 0.4, interviewPerformance: 0.1 },
      goodFeedback: 'Solid architectural understanding of REST conventions, resource semantics, and HTTP status codes.',
      improvementFeedback: 'Clarify idempotency differences: PUT is idempotent (multiple calls produce same state), while POST is not.'
    },
    {
      id: 'se-4',
      roleId: 'software-engineer',
      questionNumber: 4,
      category: 'Technical Skills',
      question: 'Explain the difference between synchronous and asynchronous code execution. How do race conditions occur in multi-threaded or concurrent environments, and how do you prevent them?',
      guidanceTip: 'Contrast blocking vs non-blocking I/O, event loops/threads, shared mutable state, locks, mutexes, and atomic operations.',
      conceptClusters: [
        {
          name: 'Sync vs Async Execution Models',
          patterns: ['synchronous', 'asynchronous', 'blocking', 'non-blocking', 'event loop', 'thread', 'concurrent']
        },
        {
          name: 'Race Condition Mechanics',
          patterns: ['race condition', 'shared state', 'mutable', 'simultaneous', 'interleave', 'concurrent access', 'shared memory']
        },
        {
          name: 'Synchronization & Prevention Locks',
          patterns: ['lock', 'mutex', 'semaphore', 'atomic', 'synchroniz', 'thread-safe', 'critical section']
        },
        {
          name: 'Concurrency Safety & Immutability',
          patterns: ['immutable', 'promise', 'async/await', 'deadlock', 'isolation', 'thread']
        }
      ],
      exemplaryKeywords: ['mutex lock', 'atomic operations', 'race condition', 'critical section', 'non-blocking io', 'deadlock prevention'],
      categoryWeights: { technical: 0.5, problemSolving: 0.2, communication: 0.1, roleKnowledge: 0.1, interviewPerformance: 0.1 },
      goodFeedback: 'Clear differentiation of execution models and synchronization safety in concurrent systems.',
      improvementFeedback: 'Discuss deadlock prevention techniques when acquiring multiple resource locks.'
    },
    {
      id: 'se-5',
      roleId: 'software-engineer',
      questionNumber: 5,
      category: 'Communication',
      question: 'Describe a time you engaged in a constructive code review or architectural disagreement with another engineer. How did you resolve the conflict professionally?',
      guidanceTip: 'Highlight objective benchmarking, evaluating trade-offs, separating ego from code, proposing a proof-of-concept, and agreeing to commit once decided.',
      conceptClusters: [
        {
          name: 'Technical Disagreement Context',
          patterns: ['disagree', 'code review', 'pull request', 'pr', 'architecture', 'design', 'approach', 'conflict']
        },
        {
          name: 'Objective Metrics & Trade-offs',
          patterns: ['trade-off', 'benchmark', 'performance', 'readability', 'maintainab', 'data', 'proof of concept', 'poc']
        },
        {
          name: 'Constructive & Egoless Discussion',
          patterns: ['listen', 'respect', 'discuss', 'collaborat', 'egoless', 'team', 'feedback', 'open-minded', 'professional']
        },
        {
          name: 'Consensus & Decision Alignment',
          patterns: ['consensus', 'decision', 'align', 'compromise', 'document', 'agree', 'standard', 'moving forward']
        }
      ],
      exemplaryKeywords: ['egoless engineering', 'proof of concept', 'benchmarking trade-offs', 'constructive code review', 'consensus building'],
      categoryWeights: { technical: 0.1, problemSolving: 0.2, communication: 0.4, roleKnowledge: 0.1, interviewPerformance: 0.2 },
      goodFeedback: 'High emotional intelligence and engineering maturity demonstrated in constructive peer reviews.',
      improvementFeedback: 'Emphasize setting up reproducible benchmarks or spikes to let objective data resolve architectural debates.'
    }
  ]
};

export function getQuestionsForRole(roleId) {
  return QUESTIONS_BY_ROLE[roleId] || [];
}
