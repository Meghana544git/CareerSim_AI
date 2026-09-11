import assert from 'node:assert';

// Mock localStorage in Node environment
const mockStore = {};
global.localStorage = {
  getItem: (k) => mockStore[k] || null,
  setItem: (k, v) => { mockStore[k] = String(v); },
  removeItem: (k) => { delete mockStore[k]; },
  clear: () => { Object.keys(mockStore).forEach(k => delete mockStore[k]); }
};

import {
  saveActiveSession,
  loadActiveSession,
  clearActiveSession,
  saveAssessmentToHistory,
  getAssessmentHistory,
  clearAssessmentHistory,
  toggleRoadmapItemProgress,
  getRoadmapProgress
} from '../src/utils/storage.js';

console.log('--- Testing LocalStorage & State Recovery ---');

// 1. Test Active Session Save and Recovery (Stress Test 2)
const testSession = {
  screen: 'interview',
  roleId: 'ml-engineer',
  currentQuestionIndex: 2,
  answers: { 'ml-1': 'supervised vs unsupervised answer', 'ml-2': 'overfitting regularization' },
  assessmentResult: null
};

saveActiveSession(testSession);
const recovered = loadActiveSession();

assert.strictEqual(recovered.screen, 'interview', 'Screen must recover');
assert.strictEqual(recovered.roleId, 'ml-engineer', 'Role must recover');
assert.strictEqual(recovered.currentQuestionIndex, 2, 'Question index must recover');
assert.strictEqual(recovered.answers['ml-1'], 'supervised vs unsupervised answer');
assert(recovered.updatedAt, 'Timestamp must exist');
console.log('✓ Mid-interview session recovery verified.');

// 2. Test Corrupted Storage Fallback
global.localStorage.setItem('careersim_active_session_v1', '{ invalid json bad payload');
const corruptedRecovery = loadActiveSession();
assert.strictEqual(corruptedRecovery, null, 'Corrupted JSON must return null and not throw');
console.log('✓ Corrupted storage gracefully handled.');

// 3. Test Assessment History (Stretch Feature 1 & Empty State Stress Test 6)
clearAssessmentHistory();
assert.deepStrictEqual(getAssessmentHistory(), [], 'History must start empty');

const mockResult = {
  roleId: 'frontend-developer',
  roleTitle: 'Frontend Developer',
  overallReadiness: 82,
  readinessTier: 'Ready for Hire',
  skillBreakdown: { technicalSkills: 85, problemSolving: 80, communication: 78, roleKnowledge: 84, interviewPerformance: 82 },
  summary: 'Great job!'
};

const historyAfter1 = saveAssessmentToHistory(mockResult);
assert.strictEqual(historyAfter1.length, 1, 'History has 1 entry');
assert.strictEqual(historyAfter1[0].overallReadiness, 82);

clearAssessmentHistory();
assert.deepStrictEqual(getAssessmentHistory(), [], 'History cleared successfully');
console.log('✓ Assessment history tracking and empty state resilience verified.');

// 4. Test Roadmap Milestone Tracking
toggleRoadmapItemProgress('rd-fe-1');
assert.strictEqual(getRoadmapProgress()['rd-fe-1'], true, 'Item should be toggled true');
toggleRoadmapItemProgress('rd-fe-1');
assert.strictEqual(getRoadmapProgress()['rd-fe-1'], false, 'Item should be toggled back to false');
console.log('✓ Roadmap interactive progress toggle verified.');

console.log('--- ALL STORAGE TESTS PASSED SUCCESSFULLY ---');
