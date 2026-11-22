import dns from 'node:dns';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: Number(process.env.PORT) || 3001,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  chatModel: process.env.GEMINI_CHAT_MODEL || 'gemini-3.8-flash',
  fallbackChatModel: process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite',
  embeddingModel: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS) || 768,
  topK: Number(process.env.RAG_TOP_K) || 4,
  minScore: Number(process.env.RAG_MIN_SCORE) || 0.52,
  knowledgeDir: path.resolve(__dirname, '../knowledge'),
  vectorStorePath: path.resolve(__dirname, '../data/vectorStore.json'),
};

export function assertApiKey() {
  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'Missing GEMINI_API_KEY. Copy server/.env.example to server/.env and add your Google AI Studio API key.'
    );
  }
}
