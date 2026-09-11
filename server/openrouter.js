/**
 * OpenRouter semantic evaluation client for CareerSim AI.
 * Communicates with OpenRouter API server-side using secure API keys.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';
const TIMEOUT_MS = 14000;

/**
 * Builds the structured evaluation prompt for OpenRouter.
 */
function buildEvaluationPrompt(role, question, answer) {
  const clustersDescription = (question.conceptClusters || [])
    .map(c => `- ${c.name} (Key concepts: ${c.patterns.slice(0, 5).join(', ')})`)
    .join('\n');

  const exemplaryTerms = (question.exemplaryKeywords || []).join(', ');

  const systemInstruction = `You are a senior technical interviewer and assessment engine for CareerSim AI.
Your job is to semantically evaluate a candidate's answer to a technical interview question for the role of ${role.title || role.id}.

EVALUATION CRITERIA:
1. RELEVANCE (35% weight):
   - Did the candidate actually answer the question?
   - Is the information directly related to the exact question?
   - Are some parts relevant and some parts irrelevant?
   - CRITICAL: Technical keywords that are unrelated to the specific question (e.g. naming random programming languages, libraries, or tools like "Python, React, SQL" when asked about something else) MUST be treated as irrelevant.
   - An answer containing many technical buzzwords that does not actually answer the question MUST receive a very low relevance score (< 20).

2. TECHNICAL CORRECTNESS (30% weight):
   - Which specific statements made by the candidate are technically correct?
   - Which specific statements are technically incorrect or inaccurate?
   - IMPORTANT: Do NOT treat the entire answer as correct just because some part is correct.
   - If an answer contains BOTH correct and incorrect statements, you must isolate and list both separately.

3. CONCEPT UNDERSTANDING (20% weight):
   - Did the candidate demonstrate real understanding of the underlying principles?
   - Which expected concepts were covered?
   - Which important concepts were missing?

4. COMPLETENESS & DEPTH (10% weight):
   - Did the answer sufficiently address the question?
   - IMPORTANT: Do NOT penalize concise or short answers just because they are brief! If a short answer covers the core concept accurately, award high marks for correctness, concept understanding, and relevance.

5. CLARITY (5% weight):
   - Is the explanation clear, coherent, and logically organized?

6. MIXED ANSWERS (CRITICAL REQUIREMENT):
   An answer can contain:
   - Correct statements
   - Incorrect statements
   - Relevant information
   - Irrelevant information
   ALL AT THE SAME TIME.
   You must categorize each category separately into:
   - "correct_points": array of concise strings describing what was correct.
   - "incorrect_points": array of concise strings describing what was incorrect and why.
   - "irrelevant_points": array of concise strings describing statements or keywords that are off-topic or unrelated.
   - "missing_concepts": array of concise strings describing critical expected concepts that were not mentioned.

7. SCORING & RELEVANCE GATE:
   Each score must be an integer between 0 and 100:
   - relevance_score (0-100)
   - correctness_score (0-100)
   - concept_score (0-100)
   - completeness_score (0-100)
   - clarity_score (0-100)
   
   Raw Score formula:
   raw_score = (relevance_score * 0.35) + (correctness_score * 0.30) + (concept_score * 0.20) + (completeness_score * 0.10) + (clarity_score * 0.05)
   
   MANDATORY RELEVANCE GATE:
   - If relevance_score < 20: maximum final_score = 10 (hard cap)
   - If relevance_score >= 20 and < 40: maximum final_score = 25 (hard cap)
   - If relevance_score >= 40 and < 60: maximum final_score = 50 (hard cap)
   - If relevance_score >= 60: final_score = round(raw_score)

   "is_relevant" must be true if relevance_score >= 40, otherwise false.

8. OUTPUT FORMAT:
   Return ONLY a valid, single JSON object with no markdown formatting around it (no \`\`\`json code blocks).
   Schema:
   {
     "is_relevant": boolean,
     "relevance_score": number,
     "correctness_score": number,
     "concept_score": number,
     "completeness_score": number,
     "clarity_score": number,
     "final_score": number,
     "correct_points": string[],
     "incorrect_points": string[],
     "irrelevant_points": string[],
     "missing_concepts": string[],
     "feedback": string,
     "detected_issues": string[]
   }`;

  const userContent = `ROLE: ${role.title || role.id}
QUESTION CATEGORY: ${question.category}
QUESTION: ${question.question}
INTERVIEWER GUIDANCE / CRITERIA: ${question.guidanceTip || 'Assess foundational understanding and practical trade-offs.'}

EXPECTED CONCEPT CLUSTERS:
${clustersDescription}

EXEMPLARY ADVANCED CONCEPTS:
${exemplaryTerms || 'Production best practices and trade-offs'}

CANDIDATE SUBMITTED ANSWER:
"""
${answer}
"""

Evaluate this answer according to the criteria and output the JSON object.`;

  return { systemInstruction, userContent };
}

/**
 * Call OpenRouter API to evaluate a single candidate answer.
 * @param {Object} options
 * @param {Object} options.role - Role data
 * @param {Object} options.question - Question data
 * @param {string} options.answer - Candidate answer text
 * @param {string} options.apiKey - OpenRouter API key
 * @param {string} [options.model] - Model name
 * @returns {Promise<Object>} Evaluated JSON response
 */
export async function evaluateWithOpenRouter({ role, question, answer, apiKey, model }) {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

  const trimmedAnswer = (answer || '').trim();
  if (!trimmedAnswer) {
    throw new Error('Cannot evaluate empty answer with AI.');
  }

  const targetModel = model || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const { systemInstruction, userContent } = buildEvaluationPrompt(role, question, trimmedAnswer);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': 'https://careersim-ai.vercel.app',
        'X-Title': 'CareerSim AI - Semantic Evaluation',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userContent }
        ],
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`OpenRouter API error (HTTP ${response.status}): ${errorText.slice(0, 200)}`);
    }

    const responseData = await response.json();
    const rawContent = responseData?.choices?.[0]?.message?.content;

    if (!rawContent || typeof rawContent !== 'string') {
      throw new Error('OpenRouter returned an empty message content.');
    }

    // Strip markdown formatting if present (e.g. ```json ... ```)
    let cleanedJson = rawContent.trim();
    if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    const parsed = JSON.parse(cleanedJson);
    return parsed;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`OpenRouter request timed out after ${TIMEOUT_MS / 1000}s.`);
    }
    throw err;
  }
}
