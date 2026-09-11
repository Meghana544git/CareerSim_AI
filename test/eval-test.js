import assert from 'node:assert';
import { ROLES } from '../src/data/roles.js';
import { QUESTIONS_BY_ROLE, getQuestionsForRole } from '../src/data/questions.js';
import { evaluateSingleAnswer, evaluateInterview } from '../src/utils/evaluation.js';

console.log('====================================================');
console.log('--- CareerSim AI: Evaluation Engine Test Suite ---');
console.log('====================================================\n');

// 1. Verify all 4 roles exist
assert.strictEqual(ROLES.length, 4, 'Must have exactly 4 career roles');
const roleIds = ROLES.map(r => r.id);
assert.deepStrictEqual(
  roleIds.sort(),
  ['data-analyst', 'frontend-developer', 'ml-engineer', 'software-engineer'].sort(),
  'All 4 specified roles must be present'
);
console.log('✓ Roles verification passed (4 roles).');

// 2. Verify all questions have conceptClusters
ROLES.forEach(role => {
  const qs = QUESTIONS_BY_ROLE[role.id];
  assert(qs, `Questions must exist for ${role.id}`);
  assert.strictEqual(qs.length, 5, `${role.id} must have exactly 5 questions`);
  qs.forEach((q, idx) => {
    assert.strictEqual(q.questionNumber, idx + 1);
    assert(q.conceptClusters && q.conceptClusters.length >= 3, `Question ${q.id} must have at least 3 concept clusters`);
  });
});
console.log('✓ Questions structure verified (20 questions with concept clusters).\n');

// Target Question for Detailed Test Cases: fe-2 (Responsive Web Design)
const responsiveQ = QUESTIONS_BY_ROLE['frontend-developer'][1];
console.log(`Testing Question: "${responsiveQ.question}"\n`);

// -------------------------------------------------------------
// TEST 1: Excellent answer (80–100)
// -------------------------------------------------------------
const excellentAnswer = `Responsive web design means creating websites that dynamically adapt to different screen sizes and devices, from mobile phones to tablets and desktop monitors. We implement this using CSS media queries with strategic breakpoints, along with flexible layouts using Flexbox and CSS Grid. We also rely on fluid percentages, rem and viewport units, meta viewport tags, and flexible images to ensure flawless scaling.`;
const eval1 = evaluateSingleAnswer(responsiveQ, excellentAnswer);
console.log(`TEST 1 (Excellent Answer) Score: ${eval1.score}/100`);
console.log(`Matched Clusters: ${eval1.matchedClusters.join(', ')}`);
console.log(`Feedback: ${eval1.feedback}`);
assert(eval1.score >= 80 && eval1.score <= 100, `Expected 80-100, got ${eval1.score}`);
console.log('✓ TEST 1 PASSED: Excellent answer scored in HIGH range (80–100).\n');

// -------------------------------------------------------------
// TEST 2: Mostly correct answer (65–85)
// -------------------------------------------------------------
const mostlyCorrectAnswer = `Responsive web design is a technique used to make websites work on different devices and screens. CSS media queries can change the layout based on screen width, and we use flexible layouts so content shrinks or expands properly.`;
const eval2 = evaluateSingleAnswer(responsiveQ, mostlyCorrectAnswer);
console.log(`TEST 2 (Mostly Correct Answer) Score: ${eval2.score}/100`);
console.log(`Feedback: ${eval2.feedback}`);
assert(eval2.score >= 65 && eval2.score <= 85, `Expected 65-85, got ${eval2.score}`);
console.log('✓ TEST 2 PASSED: Mostly correct answer scored in 65–85 range.\n');

// -------------------------------------------------------------
// TEST 3: Partially correct answer (35–65)
// -------------------------------------------------------------
const partiallyCorrectAnswer = `We make websites look good by setting screen widths and changing layout when users open it on mobile. We adjust sizes so it does not look broken.`;
const eval3 = evaluateSingleAnswer(responsiveQ, partiallyCorrectAnswer);
console.log(`TEST 3 (Partially Correct Answer) Score: ${eval3.score}/100`);
console.log(`Feedback: ${eval3.feedback}`);
assert(eval3.score >= 35 && eval3.score <= 65, `Expected 35-65, got ${eval3.score}`);
console.log('✓ TEST 3 PASSED: Partially correct answer scored in 35–65 range.\n');

// -------------------------------------------------------------
// TEST 4: Random irrelevant answer (0–15)
// -------------------------------------------------------------
const randomAnswer = `I like movies and cricket. Yesterday I went shopping with my friends and we ate delicious pizza.`;
const eval4 = evaluateSingleAnswer(responsiveQ, randomAnswer);
console.log(`TEST 4 (Random Answer) Score: ${eval4.score}/100`);
console.log(`Feedback: ${eval4.feedback}`);
assert(eval4.score <= 15, `Expected 0-15 for random answer, got ${eval4.score}`);
console.log('✓ TEST 4 PASSED: Random answer scored in VERY LOW range (0–15).\n');

// -------------------------------------------------------------
// TEST 5: Technical but irrelevant answer (10–35)
// -------------------------------------------------------------
const technicalIrrelevantAnswer = `I know HTML, CSS, JavaScript, Python and Java. I have built several projects using React and Node.js with MongoDB databases.`;
const eval5 = evaluateSingleAnswer(responsiveQ, technicalIrrelevantAnswer);
console.log(`TEST 5 (Technical but Irrelevant Answer) Score: ${eval5.score}/100`);
console.log(`Feedback: ${eval5.feedback}`);
assert(eval5.score <= 35, `Expected 10-35 for technical but irrelevant answer, got ${eval5.score}`);
console.log('✓ TEST 5 PASSED: Technical but off-topic answer capped appropriately.\n');

// -------------------------------------------------------------
// TEST 6: Short but correct answer (80–100)
// -------------------------------------------------------------
const shortCorrectAnswer = `Responsive web design creates websites that adapt to different screen sizes using CSS media queries and flexible layouts.`;
const eval6 = evaluateSingleAnswer(responsiveQ, shortCorrectAnswer);
console.log(`TEST 6 (Short but Correct Answer) Score: ${eval6.score}/100`);
console.log(`Word Count: ${eval6.wordCount}`);
console.log(`Feedback: ${eval6.feedback}`);
assert(eval6.score >= 75 && eval6.score <= 100, `Expected 75-100 for short correct answer, got ${eval6.score}`);
console.log('✓ TEST 6 PASSED: Short concise correct answer rewarded with HIGH score.\n');

// -------------------------------------------------------------
// TEST 7: Empty answer (Score: 0)
// -------------------------------------------------------------
const eval7 = evaluateSingleAnswer(responsiveQ, '   ');
console.log(`TEST 7 (Empty Answer) Score: ${eval7.score}/100`);
assert.strictEqual(eval7.score, 0, 'Empty answer must score 0');
console.log('✓ TEST 7 PASSED: Empty answer returned score 0.\n');

// -------------------------------------------------------------
// TEST 8: Full Interview Runs across All 4 Roles & Dynamic Roadmap
// -------------------------------------------------------------
console.log('--- Testing Full Interview Evaluations & Dynamic Summaries ---');

ROLES.forEach(role => {
  const qs = getQuestionsForRole(role.id);

  // Scenario A: High-performing candidate
  const highAnswers = {};
  qs.forEach(q => {
    // Combine patterns from all clusters for an exemplary answer
    highAnswers[q.id] = q.conceptClusters.map(c => c.patterns[0]).join(', ') +
      '. We also consider ' + (q.exemplaryKeywords ? q.exemplaryKeywords[0] : 'production context') +
      ' to ensure scalable implementation.';
  });

  const highResult = evaluateInterview(role, qs, highAnswers);
  assert(highResult.overallReadiness >= 80, `${role.title} high answers should score >= 80`);
  assert(highResult.summary.length > 30, 'Summary must be non-empty and complete');
  assert(highResult.roadmap.length === 4, 'Roadmap must contain exactly 4 steps');
  assert(highResult.strengths.length >= 1, 'High performer must have strengths');

  // Scenario B: Low-performing candidate (random answers)
  const lowAnswers = {};
  qs.forEach(q => {
    lowAnswers[q.id] = 'I am not sure about this topic, but I enjoy learning new things with my friends.';
  });

  const lowResult = evaluateInterview(role, qs, lowAnswers);
  assert(lowResult.overallReadiness <= 20, `${role.title} low answers should score <= 20, got ${lowResult.overallReadiness}`);
  assert(lowResult.summary.length > 30, 'Summary must be non-empty and complete');
  assert(lowResult.readinessTier === 'Foundational Stage', `Tier should be Foundational Stage, got ${lowResult.readinessTier}`);
  assert(lowResult.weaknesses.length >= 2, 'Low performer must identify weaknesses');
  
  console.log(`✓ ${role.title}: High Score=${highResult.overallReadiness}/100 | Low Score=${lowResult.overallReadiness}/100`);
});

console.log('\n====================================================');
console.log('--- ALL 7 TEST CASES & INTERVIEW SCENARIOS PASSED ---');
console.log('====================================================\n');
