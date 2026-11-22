import { config } from '../config.js';
import { embedText } from './embeddings.js';
import { cosineSimilarity, loadVectorStore } from './vectorStore.js';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'it', 'its', 'this', 'that',
  'have', 'has', 'had', 'do', 'does', 'did', 'for', 'of', 'to', 'in', 'on',
  'at', 'with', 'from', 'by', 'about', 'and', 'or', 'but', 'if', 'can',
  'could', 'should', 'would', 'what', 'how', 'when', 'why', 'please', 'tell',
  'give', 'want', 'need', 'some', 'any', 'very', 'too', 'also', 'just',
  'hai', 'hain', 'ka', 'ki', 'ke', 'ko', 'se', 'me', 'mein', 'kya', 'kaise',
]);

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function computeKeywordScore(queryTokens, docText, tags = []) {
  if (queryTokens.length === 0) return 0;
  const haystack = `${docText} ${tags.join(' ')}`.toLowerCase();

  let hits = 0;
  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      hits += 1;
    }
  }
  return hits / queryTokens.length;
}

/**
 * Retrieve top-K relevant Chikitsa chunks using hybrid semantic + keyword scoring.
 */
export async function retrieveRelevantDocs(query, { topK = config.topK, minScore = config.minScore } = {}) {
  const store = await loadVectorStore();
  const queryEmbedding = await embedText(query, 'RETRIEVAL_QUERY');
  const queryTokens = tokenize(query);

  const scored = store.records.map((record) => {
    const semanticScore = cosineSimilarity(queryEmbedding, record.embedding);
    const keywordScore = computeKeywordScore(
      queryTokens,
      record.text,
      record.metadata?.tags || []
    );
    const score = semanticScore * 0.85 + keywordScore * 0.15;

    return {
      id: record.id,
      text: record.text,
      metadata: record.metadata,
      score: Number(score.toFixed(4)),
      semanticScore: Number(semanticScore.toFixed(4)),
      keywordScore: Number(keywordScore.toFixed(4)),
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.filter((item) => item.score >= minScore).slice(0, topK);
}
