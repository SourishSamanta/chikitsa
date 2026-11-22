import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';

let cachedStore = null;

/**
 * Compute cosine similarity between two numeric vectors.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Persist embedded documents to the local JSON vector store.
 */
export async function saveVectorStore(records, storePath = config.vectorStorePath) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  const payload = {
    createdAt: new Date().toISOString(),
    embeddingModel: config.embeddingModel,
    dimensions: records[0]?.embedding?.length || config.embeddingDimensions,
    count: records.length,
    records,
  };
  await fs.writeFile(storePath, JSON.stringify(payload), 'utf8');
  cachedStore = payload;
  return payload;
}

/**
 * Load the vector store into memory (cached after first read).
 */
export async function loadVectorStore({ forceReload = false, storePath = config.vectorStorePath } = {}) {
  if (cachedStore && !forceReload) {
    return cachedStore;
  }

  try {
    const raw = await fs.readFile(storePath, 'utf8');
    cachedStore = JSON.parse(raw);
    return cachedStore;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(
        `Vector store not found at ${storePath}. Run "npm run ingest" inside server/ first.`
      );
    }
    throw err;
  }
}

export function getStoreStats() {
  if (!cachedStore) return null;
  return {
    createdAt: cachedStore.createdAt,
    embeddingModel: cachedStore.embeddingModel,
    dimensions: cachedStore.dimensions,
    count: cachedStore.count,
  };
}
