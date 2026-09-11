/**
 * Client-side evaluation service for CareerSim AI.
 * Calls the secure server-side endpoint (/api/evaluate) to evaluate candidate answers.
 * Automatically falls back to local deterministic evaluation if server or network is unavailable.
 */

import { evaluateSingleAnswer } from '../utils/evaluation.js';

/**
 * Evaluates a single answer by calling the secure server endpoint.
 * @param {Object} params
 * @param {Object} params.role - Active role object
 * @param {Object} params.question - Question object
 * @param {string} params.answer - Candidate answer
 * @returns {Promise<Object>} Evaluated answer result
 */
export async function evaluateAnswerAsync({ role, question, answer }) {
  const trimmed = (answer || '').trim();

  // 1. Immediate local zero-score handling for empty submissions (avoids network call)
  if (!trimmed) {
    return evaluateSingleAnswer(question, '');
  }

  // 2. Call server-side evaluation endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: {
          id: role.id,
          title: role.title
        },
        question: {
          id: question.id,
          questionNumber: question.questionNumber,
          category: question.category,
          question: question.question,
          guidanceTip: question.guidanceTip,
          conceptClusters: question.conceptClusters,
          exemplaryKeywords: question.exemplaryKeywords
        },
        answer: trimmed
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[CareerSim] /api/evaluate returned HTTP ${response.status}, using local fallback.`);
      return evaluateSingleAnswer(question, trimmed);
    }

    const data = await response.json();

    // Ensure evaluation result has valid scores
    if (data && typeof data === 'object' && typeof data.score === 'number') {
      return data;
    }

    console.warn('[CareerSim] Invalid response from /api/evaluate, using local fallback.');
    return evaluateSingleAnswer(question, trimmed);
  } catch (err) {
    console.warn(`[CareerSim] Evaluation service network exception: ${err.message}. Using local fallback.`);
    return evaluateSingleAnswer(question, trimmed);
  }
}
