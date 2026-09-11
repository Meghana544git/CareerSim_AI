/**
 * Deterministic local evaluation engine for CareerSim AI.
 * Runs 100% in-browser with zero external API dependencies.
 * Strictly evaluates based on concept coverage, keyword relevance, depth, and irrelevance detection.
 */

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Pattern matcher supporting exact phrases, plurals/singulars, word boundaries, and morphological stems.
 */
function matchesPattern(normalizedText, pattern) {
  const cleanPat = pattern.toLowerCase().trim();
  if (!cleanPat) return false;

  // Exact phrase substring match
  if (normalizedText.includes(cleanPat)) return true;

  // Plural/singular handling for phrase or word
  let singularPat = cleanPat;
  if (cleanPat.endsWith('ies') && cleanPat.length > 4) {
    singularPat = cleanPat.slice(0, -3) + 'y';
  } else if (cleanPat.endsWith('es') && cleanPat.length > 4) {
    singularPat = cleanPat.slice(0, -2);
  } else if (cleanPat.endsWith('s') && cleanPat.length > 3) {
    singularPat = cleanPat.slice(0, -1);
  }

  if (singularPat !== cleanPat && normalizedText.includes(singularPat)) {
    return true;
  }

  // Word boundary stem for single words
  if (!cleanPat.includes(' ') && !cleanPat.includes('-')) {
    const escaped = escapeRegex(cleanPat);
    if (cleanPat.length <= 3) {
      const wordBoundaryRegex = new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, 'i');
      return wordBoundaryRegex.test(normalizedText);
    }
    const stemPat = singularPat.length >= 4 ? singularPat : cleanPat;
    const stemRegex = new RegExp(`(?:^|\\W)${escapeRegex(stemPat)}`, 'i');
    return stemRegex.test(normalizedText);
  }

  return false;
}

// Generic tech keywords that might be dumped into an answer
const GENERIC_TECH_KEYWORDS = [
  'python', 'java', 'sql', 'react', 'tensorflow', 'numpy', 'pandas', 'c++', 'c#',
  'rust', 'golang', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'mongodb',
  'postgresql', 'mysql', 'neural networks', 'machine learning', 'deep learning',
  'angular', 'vue', 'spring', 'django', 'flask'
];

// Common misconception / contradiction patterns for key technical questions
const COMMON_CONTRADICTIONS = [
  {
    topicPattern: /(?:supervised)/i,
    contradictionPattern: /(?:without\s+labeled|never\s+(?:needs?|uses?)\s+label|unlabeled\s+data\s+(?:only|to\s+train)|no\s+labels?\s+needed)/i,
    issue: 'Supervised learning strictly requires labeled training data; stating it works without labeled data is incorrect.'
  },
  {
    topicPattern: /(?:hash\s*map|hashtable)/i,
    contradictionPattern: /(?:sorted\s+order|guarantees?\s+sorted|in\s+sorted|maintains?\s+sorted)/i,
    issue: 'A standard HashMap does not guarantee or store elements in sorted order (unlike a TreeMap).'
  },
  {
    topicPattern: /(?:where|having)/i,
    contradictionPattern: /(?:where\s+filters?\s+groups|having\s+filters?\s+rows?\s+before|having\s+before\s+aggregat)/i,
    issue: 'WHERE filters rows before aggregation; HAVING filters groups after aggregation.'
  },
  {
    topicPattern: /(?:rest|http)/i,
    contradictionPattern: /(?:post\s+is\s+idempotent|put\s+is\s+not\s+idempotent|rest\s+is\s+stateful)/i,
    issue: 'In REST, PUT is designed to be idempotent while POST is non-idempotent; REST is stateless.'
  },
  {
    topicPattern: /(?:overfit)/i,
    contradictionPattern: /(?:performs?\s+well\s+on\s+unseen|generalizes?\s+well\s+to\s+new|high\s+bias)/i,
    issue: 'Overfitting leads to poor generalization on unseen data (high variance, not low error on test sets).'
  }
];

/**
 * Evaluates a single question answer based on:
 * - Unified 5-dimension rubric (Relevance 35%, Correctness 30%, Concept 20%, Completeness 10%, Clarity 5%)
 * - Mandatory Relevance Gate
 * - Separation of correct, incorrect, irrelevant, and missing points
 * - Immunity against keyword stuffing
 */
export function evaluateSingleAnswer(question, answerText = '') {
  const trimmed = answerText.trim();
  const clusters = question.conceptClusters || [];
  const totalClusters = Math.max(1, clusters.length);
  const missingAll = clusters.map(c => c.name);

  if (!trimmed) {
    return {
      questionId: question.id,
      questionNumber: question.questionNumber,
      category: question.category,
      is_relevant: false,
      relevance_score: 0,
      correctness_score: 0,
      concept_score: 0,
      completeness_score: 0,
      clarity_score: 0,
      final_score: 0,
      score: 0,
      correct_points: [],
      incorrect_points: [],
      irrelevant_points: [],
      missing_concepts: missingAll,
      matchedClusters: [],
      missingClusters: missingAll,
      matchedConcepts: [],
      matchedExemplary: [],
      coveragePercent: 0,
      wordCount: 0,
      feedback: 'No response was provided for this question.',
      detected_issues: ['Empty submission'],
      evaluationMode: 'fallback'
    };
  }

  const normalized = trimmed.toLowerCase();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const matchedClusters = [];
  const missingClusters = [];
  const matchedPatternList = [];

  // 1. Evaluate Concept Clusters
  clusters.forEach(cluster => {
    const matchedPats = cluster.patterns.filter(pat => matchesPattern(normalized, pat));
    if (matchedPats.length > 0) {
      matchedClusters.push(cluster.name);
      matchedPatternList.push(...matchedPats);
    } else {
      missingClusters.push(cluster.name);
    }
  });

  const clusterCoverageRatio = matchedClusters.length / totalClusters;
  const coveragePercent = Math.round(clusterCoverageRatio * 100);

  // 2. Evaluate Exemplary / In-Depth Terms
  const matchedExemplary = (question.exemplaryKeywords || []).filter(kw =>
    matchesPattern(normalized, kw)
  );

  // 3. Detect Contradictions and Technical Inaccuracies
  const incorrect_points = [];
  COMMON_CONTRADICTIONS.forEach(item => {
    if (item.topicPattern.test(question.question + ' ' + normalized) && item.contradictionPattern.test(normalized)) {
      incorrect_points.push(item.issue);
    }
  });

  // 4. Detect Irrelevant Technical Buzzwords & Keyword Stuffing
  const allowedPatterns = [
    ...(question.conceptClusters || []).flatMap(c => c.patterns),
    ...(question.exemplaryKeywords || []),
    question.category.toLowerCase()
  ];

  const irrelevantFound = GENERIC_TECH_KEYWORDS.filter(kw =>
    matchesPattern(normalized, kw) && !allowedPatterns.some(p => p.includes(kw) || kw.includes(p))
  );

  const irrelevant_points = [];
  const detected_issues = [];

  if (irrelevantFound.length > 0) {
    irrelevant_points.push(
      `Mentions technologies (${irrelevantFound.join(', ')}) that are not directly relevant to explaining this specific concept.`
    );
    detected_issues.push('Contains irrelevant technical information');
  }

  if (incorrect_points.length > 0) {
    detected_issues.push('Contains incorrect information');
  }

  // 5. Build Correct Points
  const correct_points = matchedClusters.map(cName => `Accurately explains ${cName}`);
  if (matchedExemplary.length > 0) {
    correct_points.push(`Includes specialized industry concepts: ${matchedExemplary.slice(0, 2).join(', ')}`);
  }

  // 6. Calculate Dimension Scores (Scale 0-100)
  // A. Relevance (35%):
  let relevance_score = 0;
  if (clusterCoverageRatio === 0) {
    relevance_score = irrelevantFound.length > 0 ? 5 : 0;
  } else {
    const exemplaryBonus = Math.min(15, matchedExemplary.length * 8);
    let baseRel = Math.round(clusterCoverageRatio * (matchedExemplary.length > 0 ? 90 : 85)) + exemplaryBonus;
    if (irrelevantFound.length > 0) {
      baseRel = Math.max(25, baseRel - (irrelevantFound.length * 3));
      if (clusterCoverageRatio >= 0.5) {
        baseRel = Math.max(45, baseRel);
      }
    }
    relevance_score = Math.min(100, Math.max(0, baseRel));
  }

  // B. Correctness (30%):
  let correctness_score = 0;
  if (clusterCoverageRatio === 0) {
    correctness_score = 0;
  } else if (incorrect_points.length > 0) {
    correctness_score = Math.max(25, Math.min(65, Math.round(clusterCoverageRatio * 70)));
  } else {
    const exemplaryBonus = Math.min(15, matchedExemplary.length * 8);
    correctness_score = Math.min(100, Math.round(clusterCoverageRatio * (matchedExemplary.length > 0 ? 85 : 80)) + exemplaryBonus);
  }

  // C. Concept Understanding (20%):
  const exemplaryBonus = Math.min(15, matchedExemplary.length * 8);
  const concept_score = Math.min(100, Math.round(clusterCoverageRatio * (matchedExemplary.length > 0 ? 85 : 80)) + exemplaryBonus);


  // D. Completeness & Depth (10%):
  // Concise but correct answers are NOT penalized!
  let completeness_score = 0;
  if (clusterCoverageRatio >= 0.75) {
    if (wordCount >= 10 && wordCount < 30) {
      completeness_score = 85; // Strong mark for concise, direct answers
    } else if (wordCount >= 30) {
      completeness_score = 95;
    } else {
      completeness_score = 70;
    }
  } else if (clusterCoverageRatio >= 0.4) {
    completeness_score = wordCount >= 15 ? 70 : 50;
  } else if (clusterCoverageRatio > 0) {
    completeness_score = 30;
  } else {
    completeness_score = 0;
  }

  // E. Clarity (5%):
  let clarity_score = 0;
  if (wordCount >= 6 && /[.,!?]/.test(trimmed)) {
    clarity_score = 85;
  } else if (wordCount >= 3) {
    clarity_score = 65;
  } else if (wordCount > 0) {
    clarity_score = 40;
  }

  // Keyword stuffing penalty: when an answer is a buzzword dump without addressing the question
  const isBuzzwordDumping = (clusterCoverageRatio === 0 && irrelevantFound.length >= 2) ||
    ((irrelevantFound.length / Math.max(1, wordCount)) >= 0.35 && clusterCoverageRatio < 0.2);

  if (isBuzzwordDumping) {
    if (!detected_issues.includes('Keyword stuffing detected')) {
      detected_issues.push('Keyword stuffing detected');
    }
    relevance_score = Math.min(relevance_score, 10);
  }

  if (clusterCoverageRatio === 0 && !detected_issues.includes('Off-topic response')) {
    detected_issues.push('Off-topic response');
  }

  // 7. Canonical Raw Score
  const rawScore = (relevance_score * 0.35) +
    (correctness_score * 0.30) +
    (concept_score * 0.20) +
    (completeness_score * 0.10) +
    (clarity_score * 0.05);

  // 8. Mandatory Relevance Gate
  let maxAllowedScore = 100;
  if (relevance_score < 20) {
    maxAllowedScore = 10;
  } else if (relevance_score < 40) {
    maxAllowedScore = 25;
  } else if (relevance_score < 60) {
    maxAllowedScore = 50;
  }

  if (matchedClusters.length === 0) {
    maxAllowedScore = Math.min(maxAllowedScore, 5);
  }

  const finalScore = Math.min(maxAllowedScore, Math.max(0, Math.round(rawScore)));

  // 9. Feedback Generation
  let feedback = '';
  if (finalScore >= 80) {
    feedback = `Excellent answer. You demonstrated strong command of ${matchedClusters.join(', ')}.`;
    if (matchedExemplary.length > 0) {
      feedback += ` Outstanding inclusion of specialized industry concepts like ${matchedExemplary.slice(0, 2).join(', ')}.`;
    }
  } else if (finalScore >= 65) {
    feedback = `Solid answer covering ${matchedClusters.join(', ')}.`;
    if (missingClusters.length > 0) {
      feedback += ` To make your answer more thorough, consider expanding on: ${missingClusters.slice(0, 2).join(', ')}.`;
    }
    if (incorrect_points.length > 0) {
      feedback += ` Note: ${incorrect_points[0]}`;
    }
  } else if (finalScore >= 35) {
    feedback = `Partially correct. You addressed ${matchedClusters.length > 0 ? matchedClusters.join(', ') : 'some aspects'}, but lacked depth on core concepts such as: ${missingClusters.slice(0, 3).join(', ')}.`;
    if (incorrect_points.length > 0) {
      feedback += ` Note: ${incorrect_points[0]}`;
    }
  } else if (finalScore >= 12) {
    feedback = `Low relevance to the question. While you wrote a response, it missed critical requirements. Be sure to address: ${missingClusters.slice(0, 3).join(', ')}.`;
  } else {
    feedback = `Irrelevant response. The answer does not address the question asked. Expected concepts include: ${missingClusters.slice(0, 3).join(', ')}.`;
  }

  return {
    questionId: question.id,
    questionNumber: question.questionNumber,
    category: question.category,
    score: finalScore,
    final_score: finalScore,
    is_relevant: relevance_score >= 40,
    relevance_score,
    correctness_score,
    concept_score,
    completeness_score,
    clarity_score,
    wordCount,
    matchedClusters,
    missingClusters,
    matchedConcepts: [...new Set(matchedPatternList)],
    matchedExemplary,
    coveragePercent,
    correct_points,
    incorrect_points,
    irrelevant_points,
    missing_concepts: missingClusters,
    feedback,
    detected_issues,
    evaluationMode: 'fallback'
  };
}

/**
 * Dynamic Feedback Templates across 7 distinct performance tiers.
 * Each tier provides multiple complete, professional variations.
 */
const FEEDBACK_TEMPLATES = {
  EXCELLENT: [
    (role, strong, weak) =>
      `Outstanding performance across the board. Your answers demonstrate deep technical command of ${role.title} concepts and clear architectural reasoning. You are exhibiting exceptional readiness for industry interview loops.`,
    (role, strong, weak) =>
      `Exemplary technical simulation. You articulated core principles with precision, particularly in ${strong.name.toLowerCase()}, showing the depth expected of a high-performing ${role.title} candidate.`,
    (role, strong, weak) =>
      `High-caliber interview execution. Your responses combined conceptual accuracy with production context, proving thorough preparation for ${role.title} roles.`
  ],
  STRONG: [
    (role, strong, weak) =>
      `Strong performance overall. You covered most of the important concepts and showed a solid understanding of the role. A little more depth in ${weak.name.toLowerCase()} could make your answers even stronger.`,
    (role, strong, weak) =>
      `Very good technical demonstration. You exhibited clear fluency in ${strong.name.toLowerCase()} and structured your answers well. Targeting your remaining gaps will position you as a top candidate.`,
    (role, strong, weak) =>
      `Solid interview round. Your core fundamentals are well-established for ${role.title}, with only minor refinements needed in specialized scenarios.`
  ],
  GOOD: [
    (role, strong, weak) =>
      `Good progress. You understand several core concepts, but strengthening a few weaker areas like ${weak.name.toLowerCase()} will help you perform more confidently in interviews.`,
    (role, strong, weak) =>
      `Promising assessment. You demonstrated workable knowledge in ${strong.name.toLowerCase()}, though some answers would benefit from more concrete technical terminology and trade-off analysis.`,
    (role, strong, weak) =>
      `Decent foundational knowledge. You successfully handled foundational concepts for ${role.title}, but deeper technical articulation is needed on complex questions.`
  ],
  DEVELOPING: [
    (role, strong, weak) =>
      `You're building a useful foundation. Some concepts are understood, while others need more practice and clearer explanations before entering live technical screens.`,
    (role, strong, weak) =>
      `Mixed performance on this attempt. While you showed glimpses of understanding in ${strong.name.toLowerCase()}, several key areas in ${weak.name.toLowerCase()} lacked technical substance.`,
    (role, strong, weak) =>
      `Developing competency. Your responses touched on basic ideas, but interviewers will expect significantly more depth and relevant terminology for ${role.title}.`
  ],
  NEEDS_IMPROVEMENT: [
    (role, strong, weak) =>
      `Your current answers show that several core areas need attention. Focus on the recommended roadmap topics before attempting the interview again.`,
    (role, strong, weak) =>
      `Significant conceptual gaps identified. Most answers were either incomplete or lacked the necessary technical concepts required for a ${role.title} interview.`,
    (role, strong, weak) =>
      `More structured preparation required. To succeed in technical screenings, focus your study sessions on core principles and practice explaining concepts out loud.`
  ],
  LOW: [
    (role, strong, weak) =>
      `This attempt highlights several skill gaps. Start with the fundamentals in your roadmap, practice regularly, and retake the simulation to measure your progress.`,
    (role, strong, weak) =>
      `Substantial preparation needed. The answers provided showed minimal alignment with standard ${role.title} interview benchmarks. Dedicate focused time to foundational learning.`,
    (role, strong, weak) =>
      `Early stage readiness. Begin by studying the recommended action items step by step, and return to retake the simulation once you have reviewed the core curriculum.`
  ],
  VERY_LOW: [
    (role, strong, weak) =>
      `The submitted responses did not demonstrate relevant knowledge for this role. Review the required domain fundamentals in the roadmap below before attempting another simulation.`,
    (role, strong, weak) =>
      `Responses lacked topic relevance. Ensure you carefully read each interview question and provide structured answers addressing the specific concepts requested.`,
    (role, strong, weak) =>
      `No demonstrated proficiency on this attempt. Please utilize the structured curriculum below to build your baseline knowledge before retaking the assessment.`
  ]
};

/**
 * Dynamically selects a complete, non-repeating feedback summary based on performance
 */
function getDynamicSummary(role, overallScore, strongestSkill, weakestSkill) {
  let tierKey = 'GOOD';
  if (overallScore >= 85) tierKey = 'EXCELLENT';
  else if (overallScore >= 75) tierKey = 'STRONG';
  else if (overallScore >= 65) tierKey = 'GOOD';
  else if (overallScore >= 50) tierKey = 'DEVELOPING';
  else if (overallScore >= 30) tierKey = 'NEEDS_IMPROVEMENT';
  else if (overallScore >= 15) tierKey = 'LOW';
  else tierKey = 'VERY_LOW';

  const templates = FEEDBACK_TEMPLATES[tierKey];
  // Deterministic variation index based on score & role to avoid identical phrasing
  const seed = (overallScore * 7) + role.id.length + (strongestSkill.score * 3) + (weakestSkill.score * 5);
  const variationIndex = Math.abs(seed) % templates.length;

  return templates[variationIndex](role, strongestSkill, weakestSkill);
}

/**
 * Evaluates the full interview across all questions
 */
export function evaluateInterview(role, questions, answers, preEvaluatedMap = {}) {
  const evaluatedQuestions = questions.map(q => {
    if (preEvaluatedMap && preEvaluatedMap[q.id]) {
      return preEvaluatedMap[q.id];
    }
    const studentAnswer = answers[q.id] || '';
    return evaluateSingleAnswer(q, studentAnswer);
  });

  // Calculate scores across the 5 standard rubric dimensions:
  // 1. Technical Skills
  // 2. Problem Solving
  // 3. Communication
  // 4. Role Knowledge
  // 5. Interview Performance
  const categoryTotals = {
    'Technical Skills': { weightedSum: 0, totalWeight: 0 },
    'Problem Solving': { weightedSum: 0, totalWeight: 0 },
    'Communication': { weightedSum: 0, totalWeight: 0 },
    'Role Knowledge': { weightedSum: 0, totalWeight: 0 },
    'Interview Performance': { weightedSum: 0, totalWeight: 0 }
  };

  evaluatedQuestions.forEach((evalResult, idx) => {
    const q = questions[idx];
    const weights = q.categoryWeights || {
      technical: 0.3,
      problemSolving: 0.2,
      communication: 0.2,
      roleKnowledge: 0.2,
      interviewPerformance: 0.1
    };

    const qScore = evalResult.final_score !== undefined ? evalResult.final_score : evalResult.score; // 0 to 100

    categoryTotals['Technical Skills'].weightedSum += qScore * (weights.technical || 0.3);
    categoryTotals['Technical Skills'].totalWeight += (weights.technical || 0.3);

    categoryTotals['Problem Solving'].weightedSum += qScore * (weights.problemSolving || 0.2);
    categoryTotals['Problem Solving'].totalWeight += (weights.problemSolving || 0.2);

    categoryTotals['Communication'].weightedSum += qScore * (weights.communication || 0.2);
    categoryTotals['Communication'].totalWeight += (weights.communication || 0.2);

    categoryTotals['Role Knowledge'].weightedSum += qScore * (weights.roleKnowledge || 0.2);
    categoryTotals['Role Knowledge'].totalWeight += (weights.roleKnowledge || 0.2);

    categoryTotals['Interview Performance'].weightedSum += qScore * (weights.interviewPerformance || 0.1);
    categoryTotals['Interview Performance'].totalWeight += (weights.interviewPerformance || 0.1);
  });

  // Genuinely calculate skill breakdown without artificial floors
  const skillBreakdown = {
    technicalSkills: Math.min(100, Math.max(0, Math.round(categoryTotals['Technical Skills'].weightedSum / Math.max(0.01, categoryTotals['Technical Skills'].totalWeight)))),
    problemSolving: Math.min(100, Math.max(0, Math.round(categoryTotals['Problem Solving'].weightedSum / Math.max(0.01, categoryTotals['Problem Solving'].totalWeight)))),
    communication: Math.min(100, Math.max(0, Math.round(categoryTotals['Communication'].weightedSum / Math.max(0.01, categoryTotals['Communication'].totalWeight)))),
    roleKnowledge: Math.min(100, Math.max(0, Math.round(categoryTotals['Role Knowledge'].weightedSum / Math.max(0.01, categoryTotals['Role Knowledge'].totalWeight)))),
    interviewPerformance: Math.min(100, Math.max(0, Math.round(categoryTotals['Interview Performance'].weightedSum / Math.max(0.01, categoryTotals['Interview Performance'].totalWeight))))
  };

  // Overall Readiness (weighted composite of actual skills)
  const overallReadiness = Math.min(100, Math.max(0, Math.round(
    (skillBreakdown.technicalSkills * 0.35) +
    (skillBreakdown.problemSolving * 0.25) +
    (skillBreakdown.roleKnowledge * 0.15) +
    (skillBreakdown.communication * 0.15) +
    (skillBreakdown.interviewPerformance * 0.10)
  )));

  // Category rankings
  const categoryScores = [
    { name: 'Technical Skills', key: 'technicalSkills', score: skillBreakdown.technicalSkills },
    { name: 'Problem Solving', key: 'problemSolving', score: skillBreakdown.problemSolving },
    { name: 'Communication', key: 'communication', score: skillBreakdown.communication },
    { name: 'Role Knowledge', key: 'roleKnowledge', score: skillBreakdown.roleKnowledge },
    { name: 'Interview Performance', key: 'interviewPerformance', score: skillBreakdown.interviewPerformance }
  ].sort((a, b) => b.score - a.score);

  const strongestSkill = categoryScores[0];
  const weakestSkill = categoryScores[categoryScores.length - 1];

  // Specific role strengths mapping
  const roleStrengthsMap = {
    'frontend-developer': {
      technicalSkills: 'HTML5 semantics, modern CSS standards, and component architecture',
      problemSolving: 'Performance profiling, bundle optimization, and rendering efficiency',
      communication: 'Articulating technical trade-offs and cross-browser troubleshooting',
      roleKnowledge: 'Mobile-first responsive methodology and layout flexibility',
      interviewPerformance: 'Clear, structured explanations using standard web terminology'
    },
    'ml-engineer': {
      technicalSkills: 'Supervised vs unsupervised algorithms and objective functions',
      problemSolving: 'Generalization diagnostics, regularization, and overfitting mitigation',
      communication: 'Translating black-box model decisions into business value',
      roleKnowledge: 'Data preprocessing, feature engineering, and data cleanliness',
      interviewPerformance: 'Precision vs recall optimization and metric evaluation'
    },
    'data-analyst': {
      technicalSkills: 'SQL aggregations, grouping operations, and analytical querying',
      problemSolving: 'Data sanitation, deduplication, and null value imputation',
      communication: 'Data storytelling and presenting objective findings to leadership',
      roleKnowledge: 'Exploratory data analysis (EDA) and distribution sanity checks',
      interviewPerformance: 'Choosing low cognitive load visualizations tailored to stakeholders'
    },
    'software-engineer': {
      technicalSkills: 'Data structure memory layout and Big-O algorithmic complexity',
      problemSolving: 'Designing scalable LRU caching with hash maps and linked lists',
      communication: 'Constructive peer reviews and egoless technical resolution',
      roleKnowledge: 'REST API resource modeling, HTTP verbs, and status codes',
      interviewPerformance: 'Concurrency models, race condition prevention, and thread safety'
    }
  };

  const roleWeaknessesMap = {
    'frontend-developer': {
      technicalSkills: 'State management hooks, memoization, and re-render prevention',
      problemSolving: 'Systematic network waterfall profiling and bundle tree-shaking',
      communication: 'Structuring technical conflict resolutions using the STAR method',
      roleKnowledge: 'Deep responsive CSS techniques, media queries, and viewport units',
      interviewPerformance: 'Elaborating beyond high-level syntax into browser rendering internals'
    },
    'ml-engineer': {
      technicalSkills: 'Mathematical formulation of objective functions and learning algorithms',
      problemSolving: 'Detecting subtle data leakage during cross-validation transformations',
      communication: 'Using model-agnostic interpretability tools like SHAP or LIME',
      roleKnowledge: 'Handling class imbalances, scaling transforms, and feature encoding',
      interviewPerformance: 'Translating model evaluation curves into concrete business value'
    },
    'data-analyst': {
      technicalSkills: 'Advanced SQL clauses (HAVING vs WHERE) and aggregation syntax',
      problemSolving: 'Statistical hypothesis testing and multivariate distribution analysis',
      communication: 'Framing anomalies in terms of financial and business risk',
      roleKnowledge: 'Multicollinearity diagnosis and comprehensive EDA steps',
      interviewPerformance: 'Adhering strictly to cognitive ergonomics in executive dashboards'
    },
    'software-engineer': {
      technicalSkills: 'CPU cache spatial locality and pointer overhead trade-offs',
      problemSolving: 'Edge cases in concurrent eviction locks and thread-safe caches',
      communication: 'Articulating architectural trade-offs using objective benchmarks',
      roleKnowledge: 'Idempotent PUT vs non-idempotent POST semantics and caching headers',
      interviewPerformance: 'Deadlock avoidance hierarchies and distributed concurrency patterns'
    }
  };

  const strengthsMap = roleStrengthsMap[role.id] || roleStrengthsMap['frontend-developer'];
  const weaknessesMap = roleWeaknessesMap[role.id] || roleWeaknessesMap['frontend-developer'];

  // Analyze answer evaluations for specific strength and weakness nuances
  const allIrrelevantPoints = evaluatedQuestions.flatMap(eq => eq.irrelevant_points || []);
  const allIncorrectPoints = evaluatedQuestions.flatMap(eq => eq.incorrect_points || []);
  const hasFrequentIrrelevant = allIrrelevantPoints.length >= 2 || evaluatedQuestions.some(eq => eq.detected_issues?.includes('Contains irrelevant technical information'));
  const hasIncomplete = evaluatedQuestions.some(eq => (eq.completeness_score !== undefined && eq.completeness_score < 60 && eq.relevance_score >= 50));
  const hasStrongTechnical = evaluatedQuestions.filter(eq => eq.category === 'Technical Skills').every(eq => (eq.correctness_score ?? eq.score) >= 70);

  // STRENGTHS: Only award strengths if the candidate actually scored decently (e.g. >= 65)
  const highScoringCategories = categoryScores.filter(c => c.score >= 65);
  let strengths = [];

  if (highScoringCategories.length >= 2) {
    strengths = highScoringCategories.slice(0, 3).map(cat => {
      if (cat.key === 'technicalSkills' && hasStrongTechnical) {
        return {
          title: 'Strong technical understanding',
          score: cat.score,
          detail: `Demonstrated accurate technical command of ${role.title} fundamentals, core mechanisms, and expected concepts.`
        };
      }
      return {
        title: cat.name,
        score: cat.score,
        detail: strengthsMap[cat.key]
      };
    });
  } else if (highScoringCategories.length === 1) {
    strengths = [
      {
        title: highScoringCategories[0].name,
        score: highScoringCategories[0].score,
        detail: strengthsMap[highScoringCategories[0].key]
      },
      {
        title: 'Foundational Baseline',
        score: categoryScores[1].score,
        detail: `Shows emerging understanding in ${categoryScores[1].name.toLowerCase()}, ready for structured reinforcement.`
      }
    ];
  } else {
    // All scores low
    strengths = [
      {
        title: 'Foundations in Progress',
        score: strongestSkill.score,
        detail: `Currently beginning skill development in ${strongestSkill.name.toLowerCase()}. Focus on foundational modules in the roadmap.`
      }
    ];
  }

  // WEAKNESSES: Derived from the lowest-scoring areas and evaluation observations
  let weaknesses = categoryScores.slice(-2).reverse().map(cat => ({
    title: cat.name,
    score: cat.score,
    detail: weaknessesMap[cat.key]
  }));

  // Reflect specific evaluation findings
  if (hasFrequentIrrelevant) {
    weaknesses[0] = {
      title: 'Needs to improve answer focus and relevance',
      score: weaknesses[0].score,
      detail: 'Submitted answers frequently contained irrelevant technical keywords or off-topic information. Focus strictly on answering the specific question asked.'
    };
  } else if (hasIncomplete) {
    weaknesses[0] = {
      title: 'Needs greater depth in technical explanations',
      score: weaknesses[0].score,
      detail: 'Answers were on-topic but lacked sufficient technical depth. Include concrete architectural trade-offs and implementation details.'
    };
  }

  // Generate Personalized Roadmap tailored to the actual weakest competencies
  const roadmap = generatePersonalizedRoadmap(role, categoryScores.slice(-2));

  // Readiness Tier and Badging
  let readinessTier = '';
  let tierBadgeColor = '';

  if (overallReadiness >= 85) {
    readinessTier = 'Ready for Hire';
    tierBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (overallReadiness >= 75) {
    readinessTier = 'Strong Candidate';
    tierBadgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-300';
  } else if (overallReadiness >= 65) {
    readinessTier = 'Good Potential';
    tierBadgeColor = 'bg-sky-100 text-sky-800 border-sky-300';
  } else if (overallReadiness >= 50) {
    readinessTier = 'Developing Competency';
    tierBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  } else if (overallReadiness >= 30) {
    readinessTier = 'Needs Preparation';
    tierBadgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
  } else {
    readinessTier = 'Foundational Stage';
    tierBadgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
  }

  // Dynamic Summary with 6-8 distinct performance tiers
  const summary = getDynamicSummary(role, overallReadiness, strongestSkill, weakestSkill);

  return {
    roleId: role.id,
    roleTitle: role.title,
    evaluatedAt: new Date().toISOString(),
    overallReadiness,
    readinessTier,
    tierBadgeColor,
    summary,
    skillBreakdown,
    strengths,
    weaknesses,
    evaluatedQuestions,
    roadmap
  };
}

/**
 * Roadmap Catalog keyed by competency and role.
 * Ensures roadmap recommendations specifically target the candidate's actual weakest skills.
 */
const ROADMAP_TOPIC_CATALOG = {
  'frontend-developer': {
    technicalSkills: {
      skill: 'Master Modern JavaScript & DOM Internals',
      whyItMatters: 'Top interviewers test closures, async event loops, and DOM manipulation depth rather than just syntax.',
      recommendedAction: 'Build 3 vanilla JS interactive components (modal, autocomplete, drag-and-drop) without external libraries.'
    },
    problemSolving: {
      skill: 'Optimize Rendering & React State Patterns',
      whyItMatters: 'Preventing unnecessary re-renders and managing state colocation demonstrates production-grade code craft.',
      recommendedAction: 'Profile a sample app using React DevTools profiler; apply React.memo, useMemo, and state colocation.'
    },
    roleKnowledge: {
      skill: 'Master Mobile-First Responsive CSS Architecture',
      whyItMatters: 'Every modern tech company builds mobile-first; understanding CSS grid, flexbox, and media queries is mandatory.',
      recommendedAction: 'Implement a complex responsive dashboard layout that flawlessly reflows down to 375px screens.'
    },
    communication: {
      skill: 'Structure Technical Anecdotes with the STAR Method',
      whyItMatters: 'Interviewers evaluate how clearly you articulate past technical challenges and debugging workflows.',
      recommendedAction: 'Write down 3 detailed STAR-format technical stories covering complex bugs you diagnosed and fixed.'
    },
    interviewPerformance: {
      skill: 'Simulate Mock Technical Interview Under Time Constraints',
      whyItMatters: 'Retaking the simulation solidifies your articulation and helps practice concise delivery.',
      recommendedAction: 'Review your personalized feedback report and retake the CareerSim AI assessment in 48 hours.'
    }
  },

  'ml-engineer': {
    technicalSkills: {
      skill: 'Solidify Model Evaluation & Generalization',
      whyItMatters: 'Recognizing overfitting, data leakage, and choosing the right trade-off (Precision vs Recall) separates junior from senior engineers.',
      recommendedAction: 'Analyze ROC-AUC curves and implement stratified k-fold cross-validation on an imbalanced dataset in Scikit-Learn.'
    },
    problemSolving: {
      skill: 'Mitigate Overfitting with Advanced Regularization',
      whyItMatters: 'Applying L1/L2 penalties, dropout, and early stopping ensures machine learning models generalize to production data.',
      recommendedAction: 'Build a training pipeline comparing unregularized vs L2/dropout models on a noisy dataset.'
    },
    roleKnowledge: {
      skill: 'Production Feature Engineering Pipelines',
      whyItMatters: 'Real-world machine learning success is 80% data cleaning, transformation, and feature engineering.',
      recommendedAction: 'Build an end-to-end data pipeline using Pandas/Polars handling nulls, categorical encoding, and standard scaling safely.'
    },
    communication: {
      skill: 'Stakeholder Communication & Model Interpretability',
      whyItMatters: 'Engineering leaders require ML engineers who can defend black-box decisions to business stakeholders.',
      recommendedAction: 'Practice explaining model predictions using SHAP summary plots and prepare 2-minute non-technical analogies.'
    },
    interviewPerformance: {
      skill: 'Complete Follow-up Technical ML Simulation',
      whyItMatters: 'Reinforce algorithmic depth under simulated interview constraints.',
      recommendedAction: 'Retake the ML Engineer assessment to measure your readiness score progression.'
    }
  },

  'data-analyst': {
    technicalSkills: {
      skill: 'Master Advanced SQL & Aggregations',
      whyItMatters: 'SQL is the primary technical filter in 90% of data analyst technical screenings.',
      recommendedAction: 'Solve 15 intermediate SQL challenges focusing on GROUP BY, HAVING, and window functions like ROW_NUMBER().'
    },
    problemSolving: {
      skill: 'Data Cleaning & Outlier Imputation Workflows',
      whyItMatters: 'Messy real-world datasets require systematic null handling and deduplication to ensure trustworthy reporting.',
      recommendedAction: 'Clean a dirty transactional dataset in SQL/Python, addressing missing values and inconsistent data types.'
    },
    roleKnowledge: {
      skill: 'Perform Rigorous Exploratory Data Analysis (EDA)',
      whyItMatters: 'Identifying distribution skew, outliers, and data integrity gaps early prevents flawed reporting.',
      recommendedAction: 'Take a raw dataset, conduct end-to-end EDA with distribution plots and correlation heatmaps.'
    },
    communication: {
      skill: 'High-Impact Executive Data Storytelling',
      whyItMatters: 'Executives look for actionable business recommendations, not just chart dumps.',
      recommendedAction: 'Design a clean 3-chart executive dashboard with clear narrative takeaways and low cognitive overhead.'
    },
    interviewPerformance: {
      skill: 'Retake Data Analyst Technical Simulation',
      whyItMatters: 'Benchmark your improvements and practice articulate communication.',
      recommendedAction: 'Retake the simulated interview to demonstrate structured stakeholder presentation.'
    }
  },

  'software-engineer': {
    technicalSkills: {
      skill: 'Strengthen Core Data Structures & Complexity',
      whyItMatters: 'Memory layouts, pointers, and Big-O efficiency are the core foundation of technical coding rounds.',
      recommendedAction: 'Implement Linked Lists, Hash Maps, and an LRU Cache from scratch in your language of choice.'
    },
    problemSolving: {
      skill: 'Concurrency & Race Condition Mitigation',
      whyItMatters: 'Handling asynchronous workflows and concurrent mutations safely is essential for scalable backend systems.',
      recommendedAction: 'Write unit tests reproducing a simulated race condition, then fix it using atomic operations or mutex locks.'
    },
    roleKnowledge: {
      skill: 'Master RESTful API Design & HTTP Semantics',
      whyItMatters: 'Building resilient client-server interfaces requires mastery of status codes, idempotency, and error handling.',
      recommendedAction: 'Design and document a clean CRUD REST service adhering strictly to HTTP verb semantics and error payloads.'
    },
    communication: {
      skill: 'Constructive Technical Code Reviews',
      whyItMatters: 'Senior engineering teams evaluate how well you collaborate, review peer code, and resolve technical debates.',
      recommendedAction: 'Practice articulating architectural trade-offs using objective benchmarks and proof-of-concept tests.'
    },
    interviewPerformance: {
      skill: 'Mock Technical Coding Screen Practice',
      whyItMatters: 'Verbalizing design trade-offs while writing clean code is what interviewers score most heavily.',
      recommendedAction: 'Retake this simulation and practice narrating your algorithmic reasoning out loud.'
    }
  }
};

/**
 * Generates 4 prioritized roadmap steps dynamically targeting the student's weakest competencies
 */
function generatePersonalizedRoadmap(role, weakestCategories) {
  const roleCatalog = ROADMAP_TOPIC_CATALOG[role.id] || ROADMAP_TOPIC_CATALOG['frontend-developer'];
  const steps = [];
  const addedKeys = new Set();

  // 1. Add steps targeting the weakest categories first
  weakestCategories.forEach(cat => {
    const key = cat.key;
    if (roleCatalog[key] && !addedKeys.has(key)) {
      steps.push({
        id: `rd-${role.id}-${key}`,
        ...roleCatalog[key]
      });
      addedKeys.add(key);
    }
  });

  // 2. Fill in remaining steps from catalog until 4 steps are present
  const allKeys = ['technicalSkills', 'problemSolving', 'roleKnowledge', 'communication', 'interviewPerformance'];
  for (const key of allKeys) {
    if (steps.length >= 4) break;
    if (roleCatalog[key] && !addedKeys.has(key)) {
      steps.push({
        id: `rd-${role.id}-${key}`,
        ...roleCatalog[key]
      });
      addedKeys.add(key);
    }
  }

  // Assign clean step numbers
  return steps.map((item, idx) => ({
    ...item,
    number: String(idx + 1).padStart(2, '0'),
    status: 'pending'
  }));
}
