/**
 * Server-side evaluation request handler for CareerSim AI.
 * Coordinates between OpenRouter AI evaluation and local deterministic fallback.
 * Strictly validates, sanitizes, and gates scores.
 */

import { evaluateWithOpenRouter } from './openrouter.js';
import { evaluateSingleAnswer } from '../src/utils/evaluation.js';

/**
 * Clamps a value between min and max as an integer.
 */
function clampScore(val, defaultValue = 0) {
  const num = Number(val);
  if (!Number.isFinite(num)) return defaultValue;
  return Math.min(100, Math.max(0, Math.round(num)));
}

/**
 * Ensures an input is an array of non-empty strings.
 */
function sanitizeStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(item => (typeof item === 'string' ? item.trim() : String(item || '').trim()))
    .filter(Boolean);
}

/**
 * Applies the mandatory Relevance Gate to the final score.
 */
function applyRelevanceGate(rawScore, relevanceScore) {
  let cap = 100;
  if (relevanceScore < 20) {
    cap = 10;
  } else if (relevanceScore < 40) {
    cap = 25;
  } else if (relevanceScore < 60) {
    cap = 50;
  }
  return Math.min(cap, Math.max(0, rawScore));
}

/**
 * Validates, sanitizes, and applies scoring rules to AI output.
 */
export function validateAndSanitizeAiResponse(raw, question) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI output is not a valid object');
  }

  // 1. Sanitize dimension scores
  const relevance_score = clampScore(raw.relevance_score, 0);
  const correctness_score = clampScore(raw.correctness_score, 0);
  const concept_score = clampScore(raw.concept_score, 0);
  const completeness_score = clampScore(raw.completeness_score, 0);
  const clarity_score = clampScore(raw.clarity_score, 0);

  // 2. Compute canonical weighted raw score
  const computedRaw = (relevance_score * 0.35) +
    (correctness_score * 0.30) +
    (concept_score * 0.20) +
    (completeness_score * 0.10) +
    (clarity_score * 0.05);

  // 3. Apply relevance gate to both computed raw and any AI-provided final_score
  const aiGivenFinal = Number.isFinite(Number(raw.final_score))
    ? clampScore(raw.final_score)
    : Math.round(computedRaw);

  const gatedAiScore = applyRelevanceGate(aiGivenFinal, relevance_score);
  const gatedComputedScore = applyRelevanceGate(Math.round(computedRaw), relevance_score);

  // Use the gated score, guaranteeing it never exceeds the relevance cap
  const final_score = Math.min(gatedAiScore, gatedComputedScore);

  // 4. Sanitize list properties
  const correct_points = sanitizeStringArray(raw.correct_points);
  const incorrect_points = sanitizeStringArray(raw.incorrect_points);
  const irrelevant_points = sanitizeStringArray(raw.irrelevant_points);
  const missing_concepts = sanitizeStringArray(raw.missing_concepts);
  const detected_issues = sanitizeStringArray(raw.detected_issues);

  // 5. Add automated issue tags if relevant
  if (relevance_score < 30 && !detected_issues.includes('Off-topic response')) {
    detected_issues.push('Off-topic response');
  }
  if (irrelevant_points.length > 0 && !detected_issues.includes('Contains irrelevant information')) {
    detected_issues.push('Contains irrelevant information');
  }
  if (incorrect_points.length > 0 && !detected_issues.includes('Contains incorrect information')) {
    detected_issues.push('Contains incorrect information');
  }

  const feedback = typeof raw.feedback === 'string' && raw.feedback.trim()
    ? raw.feedback.trim()
    : `Answer evaluated across relevance (${relevance_score}%), correctness (${correctness_score}%), and concept coverage (${concept_score}%).`;

  return {
    questionId: question.id,
    questionNumber: question.questionNumber,
    category: question.category,
    is_relevant: relevance_score >= 40,
    relevance_score,
    correctness_score,
    concept_score,
    completeness_score,
    clarity_score,
    final_score,
    score: final_score, // backward compatibility
    correct_points,
    incorrect_points,
    irrelevant_points,
    missing_concepts,
    feedback,
    detected_issues,
    evaluationMode: 'ai'
  };
}

/**
 * Handles incoming evaluation request.
 * @param {Object} body
 * @param {Object} body.role
 * @param {Object} body.question
 * @param {string} body.answer
 * @returns {Promise<Object>} Unified evaluation result
 */
export async function handleEvaluationRequest({ role, question, answer }) {
  if (!question || !role) {
    throw new Error('Invalid request payload: "role" and "question" are required.');
  }

  const trimmed = (answer || '').trim();

  // 1. Immediate local handling for empty/whitespace answers
  if (!trimmed) {
    const missingClusters = (question.conceptClusters || []).map(c => c.name);
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
      missing_concepts: missingClusters,
      feedback: 'No response was provided for this question.',
      detected_issues: ['Empty submission'],
      evaluationMode: 'fallback'
    };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  // 2. If API Key is present, attempt OpenRouter AI evaluation
  if (apiKey && apiKey.trim()) {
    try {
      const rawAi = await evaluateWithOpenRouter({
        role,
        question,
        answer: trimmed,
        apiKey: apiKey.trim(),
        model: process.env.OPENROUTER_MODEL
      });

      const validated = validateAndSanitizeAiResponse(rawAi, question);
      return validated;
    } catch (aiErr) {
      console.warn(`[CareerSim Evaluation] OpenRouter evaluation failed or unavailable: ${aiErr.message}. Falling back to deterministic evaluator.`);
      // Proceed to fallback below
    }
  }

  // 3. Fallback to enhanced local deterministic evaluation
  const fallbackResult = evaluateSingleAnswer(question, trimmed);
  return {
    ...fallbackResult,
    evaluationMode: 'fallback'
  };
}
