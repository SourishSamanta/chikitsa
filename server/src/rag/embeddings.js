import { GoogleGenAI } from '@google/genai';
import { config, assertApiKey } from '../config.js';

let aiClient = null;

export function getGeminiClient() {
  assertApiKey();
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return aiClient;
}

/**
 * Embed a single text string with Gemini.
 * @param {string} text
 * @param {'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'} taskType
 * @returns {Promise<number[]>}
 */
export async function embedText(text, taskType = 'RETRIEVAL_QUERY') {
  const ai = getGeminiClient();
  const response = await ai.models.embedContent({
    model: config.embeddingModel,
    contents: text,
    config: {
      taskType,
      outputDimensionality: config.embeddingDimensions,
    },
  });

  const values = response.embeddings?.[0]?.values;
  if (!values || values.length === 0) {
    throw new Error('Gemini returned an empty embedding vector.');
  }
  return values;
}

/**
 * Embed an array of texts in batches to stay fast and within rate limits.
 * @param {string[]} texts
 * @param {'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'} taskType
 * @param {number} batchSize
 * @returns {Promise<number[][]>}
 */
export async function embedBatch(texts, taskType = 'RETRIEVAL_DOCUMENT', batchSize = 20) {
  const ai = getGeminiClient();
  const allVectors = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await ai.models.embedContent({
      model: config.embeddingModel,
      contents: batch,
      config: {
        taskType,
        outputDimensionality: config.embeddingDimensions,
      },
    });

    const vectors = (response.embeddings || []).map((e) => e.values);
    if (vectors.length !== batch.length) {
      throw new Error(
        `Expected ${batch.length} embeddings from Gemini, got ${vectors.length}.`
      );
    }
    allVectors.push(...vectors);
  }

  return allVectors;
}
