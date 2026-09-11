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

SCORING WEIGHTS ONLY (these are NOT the scores):
- Relevance weight: 35%
- Correctness weight: 30%
- Concepts weight: 20%
- Completeness/depth weight: 10%
- Clarity weight: 5%

CRITICAL SCORING INSTRUCTION:
Each score you return must be an independent NUMBER from 0 to 100.
The percentages above are only the weighting used by the server after you respond.
NEVER return 35, 30, 20, 10, and 5 simply because those are the weights.

Use this rubric:
- 90-100: excellent, accurate, directly answers the question, and covers the important expected ideas.
- 75-89: strong answer with only minor omissions or small imprecision.
- 50-74: partially correct or missing important concepts.
- 25-49: weak answer with substantial errors, omissions, or limited relevance.
- 0-24: incorrect, mostly irrelevant, empty, or keyword-stuffed.

Examples:
- A comprehensive and technically correct answer should normally have relevance/correctness/concepts scores in the 85-100 range.
- A short but fully correct answer can still score 85-100.
- An answer that contains useful technical content plus one unrelated sentence should keep a high relevance score and list that sentence in irrelevant_points.
- A keyword-only or off-topic answer should have relevance below 20.

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

FINAL CHECK BEFORE RETURNING JSON:
- All five *_score fields are 0-100 scores, NOT the weight percentages.
- Never copy the weight sequence 35/30/20/10/5 into the score fields unless the answer independently deserves exactly those scores.
- Base scores on the candidate's actual answer and the question.

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
