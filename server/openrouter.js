/**
 * Server-side OpenRouter client for CareerSim AI.
 * IMPORTANT: OPENROUTER_API_KEY is read only from server environment variables.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';
const TIMEOUT_MS = 14000;

function buildEvaluationPrompt(role, question, answer) {
  const clusters = (question.conceptClusters || [])
    .map(cluster => {
      const patterns = Array.isArray(cluster.patterns) ? cluster.patterns.slice(0, 8).join(', ') : '';
      return `- ${cluster.name}${patterns ? ` (related concepts: ${patterns})` : ''}`;
    })
    .join('\n');

  const exemplary = Array.isArray(question.exemplaryKeywords)
    ? question.exemplaryKeywords.join(', ')
    : '';

  const systemInstruction = `You are a strict semantic technical interviewer for CareerSim AI.
Evaluate the candidate's actual meaning, not keyword overlap.

ROLE: ${role.title || role.id}
QUESTION: ${question.question}

SCORING: relevance 35%, correctness 30%, concepts 20%, completeness/depth 10%, clarity 5%.

IMPORTANT RULES:
1. A technical keyword by itself gives NO credit. Random lists such as Python, React, SQL, Docker, TensorFlow, etc. are irrelevant unless they directly answer this exact question.
2. Judge statements semantically. Separate correct, incorrect, relevant, and irrelevant content.
3. Mixed answers are allowed: an answer may contain correct + incorrect + irrelevant statements. Identify each separately.
4. A short answer can receive a high score when it accurately covers the core concept. Do not punish brevity by itself.
5. If most of an answer is relevant but one sentence is unrelated, keep relevance high and list only that unrelated part in irrelevant_points. Do not destroy the score merely because of a small irrelevant aside.
6. If an answer contains incorrect technical claims, explicitly identify them in incorrect_points and reduce correctness accordingly.
7. Missing concepts should contain important expected ideas that were not addressed.
8. For a completely off-topic or keyword-stuffed answer, relevance must be below 20.

EXPECTED CONCEPT CLUSTERS:
${clusters || 'Use the exact question and interviewer guidance to determine expected concepts.'}

ADVANCED CONCEPTS (use only when relevant):
${exemplary || 'None provided.'}

Return ONLY one valid JSON object. No markdown and no code fences.
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

  const userContent = `QUESTION CATEGORY: ${question.category || 'Technical'}
INTERVIEWER GUIDANCE: ${question.guidanceTip || 'Assess foundational understanding and practical trade-offs.'}

CANDIDATE ANSWER:
"""
${answer}
"""

Semantically evaluate this exact answer.`;

  return { systemInstruction, userContent };
}

export async function evaluateWithOpenRouter({ role, question, answer, apiKey, model }) {
  if (!apiKey?.trim()) throw new Error('OPENROUTER_API_KEY is not configured.');

  const trimmedAnswer = (answer || '').trim();
  if (!trimmedAnswer) throw new Error('Cannot evaluate an empty answer with AI.');

  const targetModel = model?.trim() || process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;
  const { systemInstruction, userContent } = buildEvaluationPrompt(role, question, trimmedAnswer);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://careersim-ai-theta.vercel.app',
        'X-Title': 'CareerSim AI - Semantic Evaluation'
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userContent }
        ],
        temperature: 0.1,
        max_tokens: 1200,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`OpenRouter API error (HTTP ${response.status}): ${responseText.slice(0, 500)}`);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      throw new Error('OpenRouter returned invalid JSON response.');
    }

    const content = responseData?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('OpenRouter returned empty evaluation content.');
    }

    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error('OpenRouter evaluation was not valid JSON.');
    }
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`OpenRouter request timed out after ${TIMEOUT_MS / 1000}s.`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
