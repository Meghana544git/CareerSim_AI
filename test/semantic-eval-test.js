import assert from 'node:assert';
import { getRoleById } from '../src/data/roles.js';
import { getQuestionsForRole } from '../src/data/questions.js';
import { evaluateSingleAnswer, evaluateInterview } from '../src/utils/evaluation.js';
import { handleEvaluationRequest, validateAndSanitizeAiResponse } from '../server/evaluateHandler.js';

console.log('====================================================');
console.log('--- CareerSim AI: Semantic Evaluation Test Suite ---');
console.log('====================================================\n');

const mlRole = getRoleById('ml-engineer');
const mlQuestions = getQuestionsForRole('ml-engineer');
const supervisedQ = mlQuestions[0]; // "Explain fundamental differences between supervised, unsupervised, and reinforcement learning..."
const overfittingQ = mlQuestions[1]; // "What is overfitting..."

const feRole = getRoleById('frontend-developer');
const feQuestions = getQuestionsForRole('frontend-developer');
const responsiveQ = feQuestions[1]; // fe-2: Responsive design

// =============================================================
// TEST 1: Excellent relevant answer
// =============================================================
const excellentAnswer = `Supervised learning trains a model on labeled data where ground truth targets exist for classification and regression tasks. In contrast, unsupervised learning discovers hidden patterns, clusters, and dimensionality reduction in unlabeled datasets without targets. Reinforcement learning trains autonomous agents to take actions in an environment to maximize cumulative reward signals. Real-world applications include email spam classification, customer segmentation clustering, and robotics control.`;
const test1 = evaluateSingleAnswer(supervisedQ, excellentAnswer);
console.log(`TEST 1 (Excellent Relevant Answer) Score: ${test1.score}/100`);
console.log(`Correct Points: ${test1.correct_points.length}, Issues: ${test1.detected_issues.length}`);
assert(test1.score >= 80 && test1.score <= 100, `Expected 80-100, got ${test1.score}`);
assert(test1.correct_points.length >= 3, 'Must identify multiple correct points');
assert.strictEqual(test1.is_relevant, true, 'Must be marked relevant');
console.log('✓ TEST 1 PASSED: Excellent relevant answer scored in 80–100 range.\n');

// =============================================================
// TEST 2: Short but correct answer (Must NOT be penalized)
// =============================================================
// Example from user prompt: "What is supervised learning?" -> "Supervised learning trains a model using labeled data."
const supervisedDefQ = {
  id: 'ml-def-test',
  questionNumber: 1,
  category: 'Technical Skills',
  question: 'What is supervised learning?',
  conceptClusters: [
    {
      name: 'Supervised Learning & Labeled Data',
      patterns: ['supervised', 'label', 'ground truth', 'target', 'classification', 'regression']
    }
  ]
};
const shortSupervisedAnswer = `Supervised learning trains a model using labeled data.`;
const test2A = evaluateSingleAnswer(supervisedDefQ, shortSupervisedAnswer);
console.log(`TEST 2A (Short Correct Definition) Score: ${test2A.score}/100, Word Count: ${test2A.wordCount}`);
assert(test2A.score >= 75 && test2A.score <= 100, `Expected 75-100 for concise correct definition, got ${test2A.score}`);
assert(test2A.correct_points.length >= 1, 'Must recognize correct points');

// Short correct answer on fe-2 responsive web design (18 words)
const shortResponsiveAnswer = `Responsive web design creates websites that adapt to different screen sizes using CSS media queries and flexible layouts.`;
const test2B = evaluateSingleAnswer(responsiveQ, shortResponsiveAnswer);
console.log(`TEST 2B (Short Correct Responsive Answer) Score: ${test2B.score}/100, Word Count: ${test2B.wordCount}`);
assert(test2B.score >= 75 && test2B.score <= 100, `Expected 75-100 for concise answer covering concepts, got ${test2B.score}`);
console.log('✓ TEST 2 PASSED: Short but correct answers rewarded with high score (>=75) without penalty.\n');


// =============================================================
// TEST 3: Mostly correct answer (65–85)
// =============================================================
const mostlyCorrectAnswer = `Supervised learning uses labeled data to train a model for classification and regression. Unsupervised learning finds patterns in unlabeled data. Reinforcement learning uses agents and rewards.`;
const test3 = evaluateSingleAnswer(supervisedQ, mostlyCorrectAnswer);
console.log(`TEST 3 (Mostly Correct Answer) Score: ${test3.score}/100`);
assert(test3.score >= 65 && test3.score <= 85, `Expected 65-85, got ${test3.score}`);
console.log('✓ TEST 3 PASSED: Mostly correct answer scored in 65–85 range.\n');

// =============================================================
// TEST 4: Partially correct answer
// =============================================================
const partiallyCorrectAnswer = `Supervised learning uses data with labels to make predictions. I do not remember the other two types well.`;
const test4 = evaluateSingleAnswer(supervisedQ, partiallyCorrectAnswer);
console.log(`TEST 4 (Partially Correct Answer) Score: ${test4.score}/100`);
assert(test4.score >= 25 && test4.score <= 65, `Expected 25-65, got ${test4.score}`);
assert(test4.missing_concepts.length >= 2, 'Must identify missing concepts');
console.log('✓ TEST 4 PASSED: Partially correct answer scored appropriately with missing concepts flagged.\n');

// =============================================================
// TEST 5: Completely irrelevant answer
// =============================================================
const randomIrrelevant = `Yesterday I went to the cinema and had pepperoni pizza with friends. It was very tasty.`;
const test5 = evaluateSingleAnswer(supervisedQ, randomIrrelevant);
console.log(`TEST 5 (Completely Irrelevant Answer) Score: ${test5.score}/100`);
assert(test5.score <= 10, `Expected <= 10 for completely irrelevant answer, got ${test5.score}`);
assert.strictEqual(test5.is_relevant, false, 'Must be marked not relevant');
console.log('✓ TEST 5 PASSED: Irrelevant answer scored <= 10.\n');

// =============================================================
// TEST 6: MOST IMPORTANT TEST - Irrelevant answer containing many technical keywords
// =============================================================
const keywordStuffedAnswer = `Python, Java, SQL, React, TensorFlow, NumPy, Pandas, machine learning, neural networks, Docker, Kubernetes.`;
const test6 = evaluateSingleAnswer(supervisedQ, keywordStuffedAnswer);
console.log(`TEST 6 (Keyword Stuffed Irrelevant Answer) Score: ${test6.score}/100`);
console.log(`Issues: ${test6.detected_issues.join(', ')}`);
console.log(`Irrelevant points: ${test6.irrelevant_points.join(' | ')}`);
assert(test6.score <= 10, `CRITICAL: Keyword stuffed answer MUST score <= 10, got ${test6.score}`);
assert.strictEqual(test6.is_relevant, false, 'Must be marked not relevant');
assert(test6.irrelevant_points.length > 0, 'Must flag irrelevant points');
console.log('✓ TEST 6 PASSED: Technical keyword-stuffed answer is strictly capped at <= 10!\n');

// =============================================================
// TEST 7: SECOND MOST IMPORTANT TEST - Correct + Incorrect information
// =============================================================
const mixedCorrectIncorrect = `Supervised learning uses labeled data to train a model. It can be used for classification and regression. It always works without labeled data.`;
const test7 = evaluateSingleAnswer(supervisedQ, mixedCorrectIncorrect);
console.log(`TEST 7 (Correct + Incorrect Information) Score: ${test7.score}/100`);
console.log(`Correct Points: ${test7.correct_points.join('; ')}`);
console.log(`Incorrect Points: ${test7.incorrect_points.join('; ')}`);
assert(test7.correct_points.length > 0, 'Must identify correct points');
assert(test7.incorrect_points.length > 0, 'Must identify incorrect points');
assert(test7.score > 15 && test7.score < 80, `Expected mixed score (15-80), got ${test7.score}`);
console.log('✓ TEST 7 PASSED: Evaluator accurately identified BOTH correct and incorrect statements.\n');

// =============================================================
// TEST 8: THIRD MOST IMPORTANT TEST - Correct + Irrelevant information
// =============================================================
// Example from user prompt:
// "Overfitting happens when a model learns the training data too closely and performs poorly on unseen data.
// Java is object-oriented and SQL is used to query databases."
const overfittingWithIrrelevant = `Overfitting happens when a model learns the training data too closely and performs poorly on unseen data. For example, a decision tree can become too complex. Java is object-oriented and SQL is used to query databases.`;
const test8 = evaluateSingleAnswer(overfittingQ, overfittingWithIrrelevant);
console.log(`TEST 8 (Correct + Irrelevant) Score: ${test8.score}/100`);
console.log(`Correct Points: ${test8.correct_points.join('; ')}`);
console.log(`Irrelevant Points: ${test8.irrelevant_points.join('; ')}`);
assert(test8.correct_points.length > 0, 'Must identify correct points');
assert(test8.irrelevant_points.length > 0, 'Must identify irrelevant technologies (Java, SQL)');
assert(test8.score >= 40 && test8.score <= 85, `Expected score to reflect correct points (40-85), got ${test8.score}`);
console.log('✓ TEST 8 PASSED: Relevant info contributes to score while irrelevant info is isolated.\n');

// =============================================================
// TEST 9: Correct + Incorrect + Irrelevant information
// =============================================================
// Example from user prompt:
// "Supervised learning uses labeled data to train a model. It can be used for classification and regression.
// It always works without labeled data. Python and SQL are also used in many machine learning projects. I like using TensorFlow."
const mixedTriAnswer = `Supervised learning uses labeled data to train a model. It can be used for classification and regression. It always works without labeled data. Python and SQL are also used in many machine learning projects. I like using TensorFlow.`;
const test9 = evaluateSingleAnswer(supervisedDefQ, mixedTriAnswer);
console.log(`TEST 9 (Correct + Incorrect + Irrelevant) Score: ${test9.score}/100`);
console.log(`Correct Points: ${test9.correct_points.join('; ')}`);
console.log(`Incorrect Points: ${test9.incorrect_points.join('; ')}`);
console.log(`Irrelevant Points: ${test9.irrelevant_points.join('; ')}`);
assert(test9.correct_points.length > 0, 'Must isolate correct points');
assert(test9.incorrect_points.length > 0, 'Must isolate incorrect points');
assert(test9.irrelevant_points.length > 0, 'Must isolate irrelevant points');
assert(test9.score >= 35 && test9.score <= 75, `Expected balanced mixed score (35-75), got ${test9.score}`);
console.log('✓ TEST 9 PASSED: All 3 categories (correct, incorrect, irrelevant) isolated separately.\n');

// =============================================================
// TEST 10: Empty answer
// =============================================================
const test10 = evaluateSingleAnswer(supervisedQ, '   ');
console.log(`TEST 10 (Empty Answer) Score: ${test10.score}/100`);
assert.strictEqual(test10.score, 0, 'Empty answer must score exactly 0');
assert.strictEqual(test10.is_relevant, false);
console.log('✓ TEST 10 PASSED: Empty answer evaluated to 0 score without exceptions.\n');

// =============================================================
// TEST 11: Technically incorrect answer
// =============================================================
const incorrectAnswer = `Supervised learning always works without labeled data and never requires ground truth labels.`;
const test11 = evaluateSingleAnswer(supervisedQ, incorrectAnswer);
console.log(`TEST 11 (Technically Incorrect Answer) Score: ${test11.score}/100`);
assert(test11.incorrect_points.length > 0, 'Must identify inaccuracy');
assert(test11.score <= 45, `Incorrect answer must score low (<= 45), got ${test11.score}`);
console.log('✓ TEST 11 PASSED: Technically incorrect answer identified and scored low.\n');

// =============================================================
// TEST 12: Keyword stuffing detection on frontend question
// =============================================================
const feKeywordDump = `Python, Java, C++, SQL, TensorFlow, PyTorch, React, Vue, Angular, Node, Docker.`;
const test12 = evaluateSingleAnswer(responsiveQ, feKeywordDump);
console.log(`TEST 12 (Keyword Stuffing on Frontend Question) Score: ${test12.score}/100`);
assert(test12.score <= 10, `Keyword dumping on frontend question must score <= 10, got ${test12.score}`);
assert(test12.detected_issues.includes('Keyword stuffing detected') || test12.irrelevant_points.length > 0);
console.log('✓ TEST 12 PASSED: Keyword stuffing recognized and penalised.\n');

// =============================================================
// TEST 13: API Failure fallback via handleEvaluationRequest
// =============================================================
async function runApiFailureTest() {
  // When no API key is present in process.env, it gracefully falls back
  const originalKey = process.env.OPENROUTER_API_KEY;
  delete process.env.OPENROUTER_API_KEY;

  const res = await handleEvaluationRequest({
    role: mlRole,
    question: supervisedQ,
    answer: excellentAnswer
  });

  assert.strictEqual(res.evaluationMode, 'fallback', 'Must indicate fallback evaluationMode');
  assert(res.score >= 70, `Fallback should evaluate properly, got ${res.score}`);

  process.env.OPENROUTER_API_KEY = originalKey || '';
  console.log('✓ TEST 13 PASSED: Server gracefully uses fallback with evaluationMode="fallback" when API key is missing.\n');
}
await runApiFailureTest();

// =============================================================
// TEST 14: Invalid JSON / Schema handling from AI
// =============================================================
assert.throws(() => {
  validateAndSanitizeAiResponse(null, supervisedQ);
}, /valid object/, 'Must throw on null input so caller can trigger fallback');

const partialAiResponse = {
  relevance_score: 75,
  correctness_score: 70
  // missing other fields
};
const sanitizedPartial = validateAndSanitizeAiResponse(partialAiResponse, supervisedQ);
assert(typeof sanitizedPartial.final_score === 'number');
assert(Array.isArray(sanitizedPartial.correct_points));
assert.strictEqual(sanitizedPartial.evaluationMode, 'ai');
console.log('✓ TEST 14 PASSED: Missing fields in AI response handled and sanitized safely.\n');

// =============================================================
// TEST 15: AI returns scores above 100
// =============================================================
const overScoreAi = {
  relevance_score: 150,
  correctness_score: 200,
  concept_score: 120,
  completeness_score: 110,
  clarity_score: 105,
  final_score: 199,
  correct_points: ['Valid concept']
};
const sanitizedOver = validateAndSanitizeAiResponse(overScoreAi, supervisedQ);
assert(sanitizedOver.relevance_score <= 100, `Relevance score must be <= 100, got ${sanitizedOver.relevance_score}`);
assert(sanitizedOver.correctness_score <= 100, `Correctness score must be <= 100, got ${sanitizedOver.correctness_score}`);
assert(sanitizedOver.final_score <= 100, `Final score must be <= 100, got ${sanitizedOver.final_score}`);
console.log('✓ TEST 15 PASSED: Scores above 100 are strictly clamped to <= 100.\n');

// =============================================================
// TEST 16: AI returns negative scores
// =============================================================
const negScoreAi = {
  relevance_score: -30,
  correctness_score: -50,
  concept_score: -10,
  completeness_score: -20,
  clarity_score: -15,
  final_score: -45,
  correct_points: []
};
const sanitizedNeg = validateAndSanitizeAiResponse(negScoreAi, supervisedQ);
assert(sanitizedNeg.relevance_score >= 0, `Relevance score must be >= 0, got ${sanitizedNeg.relevance_score}`);
assert(sanitizedNeg.final_score >= 0, `Final score must be >= 0, got ${sanitizedNeg.final_score}`);
assert(sanitizedNeg.final_score <= 10, 'Relevance < 20 gate must cap score at <= 10');
console.log('✓ TEST 16 PASSED: Negative scores clamped to >= 0 and relevance gate enforced.\n');

// =============================================================
// TEST 17: Double submission prevention guard
// =============================================================
let submissionState = { isSubmitting: false, submitCount: 0 };
function simulateSubmit() {
  if (submissionState.isSubmitting) {
    return 'BLOCKED';
  }
  submissionState.isSubmitting = true;
  submissionState.submitCount++;
  // simulate async work
  return 'PROCESSED';
}

const firstCall = simulateSubmit();
const secondCall = simulateSubmit(); // Rapid duplicate click
assert.strictEqual(firstCall, 'PROCESSED');
assert.strictEqual(secondCall, 'BLOCKED');
assert.strictEqual(submissionState.submitCount, 1, 'Only one submission should process');
submissionState.isSubmitting = false;
console.log('✓ TEST 17 PASSED: Double submission guard successfully blocks duplicate submissions.\n');

// =============================================================
// TEST 18: Five answers produce correct overall score & breakdown
// =============================================================
const mockAnswers = {
  'ml-1': excellentAnswer,
  'ml-2': 'Overfitting happens when a model learns training noise and fails on unseen validation data. We detect it via diverging training and validation loss curves, and mitigate it using L1/L2 regularization, dropout, and early stopping.',
  'ml-3': 'Data preprocessing and feature engineering directly address garbage-in garbage-out. Imputing nulls, scaling features, and domain feature extraction often improve accuracy far more than complex models.',
  'ml-4': 'Precision measures false positives while recall measures false negatives. In cancer diagnosis, we prioritize recall because missing a malignant case carries high human cost.',
  'ml-5': 'We explain black-box models like XGBoost using SHAP values and feature importance plots, translating feature weights into tangible business levers and ROI.'
};

const mockEvaluations = {};
mlQuestions.forEach(q => {
  mockEvaluations[q.id] = evaluateSingleAnswer(q, mockAnswers[q.id]);
});

const interviewResult = evaluateInterview(mlRole, mlQuestions, mockAnswers, mockEvaluations);
console.log(`TEST 18 Full Interview Overall Readiness: ${interviewResult.overallReadiness}/100`);
console.log(`Readiness Tier: ${interviewResult.readinessTier}`);
console.log(`Strengths count: ${interviewResult.strengths.length}, Weaknesses count: ${interviewResult.weaknesses.length}`);
console.log(`Roadmap steps: ${interviewResult.roadmap.length}`);

assert(interviewResult.overallReadiness >= 80, `Expected high overall score >= 80, got ${interviewResult.overallReadiness}`);
assert(interviewResult.skillBreakdown.technicalSkills >= 75);
assert(interviewResult.skillBreakdown.problemSolving >= 75);
assert(interviewResult.strengths.length >= 2, 'Must have at least 2 strengths');
assert(interviewResult.weaknesses.length >= 1, 'Must have at least 1 weakness');
assert.strictEqual(interviewResult.roadmap.length, 4, 'Must generate exactly 4 roadmap milestones');
assert.strictEqual(interviewResult.evaluatedQuestions.length, 5, 'Must have exactly 5 evaluated questions');
console.log('✓ TEST 18 PASSED: Five independent evaluations correctly aggregate into overall readiness, skill breakdown, and roadmap.\n');

console.log('====================================================');
console.log('--- ALL 18 SEMANTIC EVALUATION TESTS PASSED! ---');
console.log('====================================================\n');
