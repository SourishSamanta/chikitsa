import os from 'node:os';
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { loadVectorStore, getStoreStats } from './rag/vectorStore.js';
import chatRouter from './routes/chat.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use((req, _res, next) => {
  console.log(`[req] ${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'chikitsa-rag-server',
    chatModel: config.chatModel,
    embeddingModel: config.embeddingModel,
    apiKeyConfigured: Boolean(
      config.geminiApiKey && config.geminiApiKey !== 'your_gemini_api_key_here'
    ),
    vectorStore: getStoreStats(),
  });
});

app.use('/api', chatRouter);

app.use((err, _req, res, _next) => {
  console.error('[server error]', err?.message || err);
  const status = err?.status || err?.statusCode || 500;
  res.status(status >= 400 && status < 600 ? status : 500).json({
    error: err?.message || 'Internal server error',
  });
});

async function start() {
  try {
    const store = await loadVectorStore();
    console.log(
      `Loaded vector store: ${store.count} chunks (${store.dimensions}d, model: ${store.embeddingModel})`
    );
  } catch (err) {
    console.warn(`[warn] ${err.message}`);
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`Chikitsa RAG server listening on:`);
    console.log(`  Local:   http://localhost:${config.port}`);
    const nets = os.networkInterfaces();
    for (const addrs of Object.values(nets)) {
      for (const addr of addrs || []) {
        if (addr.family === 'IPv4' && !addr.internal) {
          console.log(`  Network: http://${addr.address}:${config.port}`);
        }
      }
    }
  });
}

start();
