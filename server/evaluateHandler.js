/**
 * Server-side evaluation handler for CareerSim AI.
 * Keeps the OpenRouter API key off the browser and applies the
 * canonical scoring/relevance rules to the AI response.
 */

import { evaluateWithOpenRouter } from './openrouter.js';
import { evaluateSingleAnswer } from '../src/utils/evaluation.js';

function clampScore(value, defaultValue = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return defaultValue;
  return Math.min(100, Math.max(0, Math.round(number)));
}

function sanitizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
    .filter(Boolean);
}

function applyRelevanceGate(score, relevance) {
  let cap = 100;
  if (relevance < 20) cap = 10;
  else if (relevance < 40) cap = 25;
  else if (relevance < 60) cap = 50;
  return Math.min(cap, Math.max(0, score));
}

export function validateAndSanitizeAiResponse(raw, question) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI output is not a valid object.');
  }

  const relevance_score = clampScore(raw.relevance_score);
  const correctness_score = clampScore(raw.correctness_score);
  const concept_score = clampScore(raw.concept_score);
  const completeness_score = clampScore(raw.completeness_score);
  const clarity_score = clampScore(raw.clarity_score);

  const computedRaw = Math.round(
    relevance_score * 0.35 +
    correctness_score * 0.30 +
    concept_score * 0.20 +
    completeness_score * 0.10 +
    clarity_score * 0.05
  );

  // Never trust the model's final_score. Calculate it from the five dimensions.
  const final_score = applyRelevanceGate(computedRaw, relevance_score);

  const correct_points = sanitizeStringArray(raw.correct_points);
  const incorrect_points = sanitizeStringArray(raw.incorrect_points);
  const irrelevant_points = sanitizeStringArray(raw.irrelevant_points);
  const missing_concepts = sanitizeStringArray(raw.missing_concepts);
  const detected_issues = sanitizeStringArray(raw.detected_issues);

  if (relevance_score < 30 && !detected_issues.includes('Off-topic response')) {
    detected_issues.push('Off-topic response');
  }
  if (irrelevant_points.length && !detected_issues.includes('Contains irrelevant information')) {
    detected_issues.push('Contains irrelevant information');
  }
  if (incorrect_points.length && !detected_issues.includes('Contains incorrect information')) {
    detected_issues.push('Contains incorrect information');
  }

  const feedback = typeof raw.feedback === 'string' && raw.feedback.trim()
    ? raw.feedback.trim()
    : 'Answer evaluated for relevance, correctness, concept understanding, completeness, and clarity.';

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
    score: final_score,
    correct_points,
    incorrect_points,
    irrelevant_points,
    missing_concepts,
    feedback,
    detected_issues,
    evaluationMode: 'ai'
  };
}

export async function handleEvaluationRequest({ role, question, answer } = {}) {
  if (!role || !question) {
    throw new Error('Invalid request payload: role and question are required.');
  }

  const trimmed = typeof answer === 'string' ? answer.trim() : '';

  if (!trimmed) {
    const missingClusters = (question.conceptClusters || []).map(cluster => cluster.name);
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

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on the server.');
  }

  const rawAi = await evaluateWithOpenRouter({
    role,
    question,
    answer: trimmed,
    apiKey,
    model: process.env.OPENROUTER_MODEL
  });

  return validateAndSanitizeAiResponse(rawAi, question);
}
