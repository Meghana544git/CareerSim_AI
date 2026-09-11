/**
 * Vercel Serverless Function: POST /api/evaluate
 * Production entry point for CareerSim AI semantic evaluation.
 */

import { handleEvaluationRequest } from '../server/evaluateHandler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({
      error: 'Method Not Allowed. Use POST /api/evaluate.'
    });
    return;
  }

  try {
    let body = req.body;

    // Vercel normally parses JSON automatically. This also supports
    // an unparsed request body for compatibility.
    if (!body || typeof body !== 'object') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf8');
      body = raw ? JSON.parse(raw) : {};
    }

    const result = await handleEvaluationRequest(body);

    res.status(200).json(result);
  } catch (error) {
    console.error('[CareerSim API] Evaluation request failed:', error);

    res.status(500).json({
      error: error?.message || 'Evaluation request failed.'
    });
  }
}
