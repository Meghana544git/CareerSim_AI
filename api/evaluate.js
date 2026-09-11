/**
 * Standalone / Vercel Serverless Function entry point for POST /api/evaluate.
 */

import { handleEvaluationRequest } from '../server/evaluateHandler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
    return;
  }

  try {
    let body = req.body;

    // Handle stream if body is not pre-parsed
    if (!body || typeof body !== 'object') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawText = Buffer.concat(buffers).toString();
      body = rawText ? JSON.parse(rawText) : {};
    }

    const result = await handleEvaluationRequest(body);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error('[CareerSim API] Request failed:', err);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Evaluation request failed.' }));
  }
}
