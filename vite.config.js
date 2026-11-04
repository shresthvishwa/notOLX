import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { sendRequestMatchEmail, sendRequestConfirmationEmail, verifyEmailService } from './server/emailService.js';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'notolx-api-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const pathname = (req.url || '').split('?')[0];

            // Handle /api/notify-request-created
            if (pathname === '/api/notify-request-created' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const result = await sendRequestConfirmationEmail({
                    ...parsed,
                    originUrl: req.headers.origin || 'http://localhost:5173'
                  });
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(result));
                } catch (err) {
                  console.error('Vite Dev API request confirmation error:', err);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }

            // Handle /api/notify-request-match
            if (pathname === '/api/notify-request-match' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const parsed = JSON.parse(body || '{}');
                  const result = await sendRequestMatchEmail({
                    ...parsed,
                    originUrl: req.headers.origin || 'http://localhost:5173'
                  });
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(result));
                } catch (err) {
                  console.error('Vite Dev API notification error:', err);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }

            // Handle /api/test-email (checks connection & sends test delivery)
            if (pathname === '/api/test-email' && (req.method === 'GET' || req.method === 'POST')) {
              try {
                const verification = await verifyEmailService();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(verification));
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
              return;
            }

            // Handle /api/item-requests
            if (req.url === '/api/item-requests' && req.method === 'GET') {
              try {
                const dbPath = path.resolve(process.cwd(), 'server', 'db.json');
                if (fs.existsSync(dbPath)) {
                  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ count: (data.item_requests || []).length, requests: data.item_requests || [] }));
                  return;
                }
              } catch (e) {
                console.warn('Vite Dev API read db warning:', e);
              }
            }

            next();
          });
        }
      }
    ]
  };
});
