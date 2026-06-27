/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import stylistHandler from './api/stylist';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// AI Stylist Endpoint (ALT-BOT) - Routed to Vercel Serverless handler
app.post('/api/stylist', stylistHandler);

// Configure Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ALT-CLOSET server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
