import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleEvaluationRequest } from './server/evaluateHandler.js';

function apiEvaluatorPlugin() {
  const middleware = async (req, res, next) => {
    const parsedUrl = new URL(req.url, 'http://localhost');
    if (parsedUrl.pathname === '/api/evaluate' && req.method === 'POST') {
      try {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const rawText = Buffer.concat(buffers).toString();
        const body = rawText ? JSON.parse(rawText) : {};
        const result = await handleEvaluationRequest(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error('[CareerSim Vite Server] Error in /api/evaluate:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Evaluation error' }));
      }
      return;
    }
    next();
  };

  return {
    name: 'api-evaluator-middleware',
    config(_, { mode }) {
      const env = loadEnv(mode, process.cwd(), '');
      Object.assign(process.env, env);
    },
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    apiEvaluatorPlugin()
  ],
});

