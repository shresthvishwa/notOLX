import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sendRequestMatchEmail } from './server/emailService.js';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'notolx-api-dev-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Handle /api/notify-request-match
          if (req.url === '/api/notify-request-match' && req.method === 'POST') {
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
});
