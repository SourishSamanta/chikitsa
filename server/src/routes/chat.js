import { Router } from 'express';
import { config } from '../config.js';
import { checkRedFlags } from '../rag/safety.js';
import { retrieveRelevantDocs } from '../rag/retriever.js';
import { generateRagAnswer } from '../rag/generator.js';
import { loadKnowledgeFiles } from '../rag/fileParser.js';
import { embedBatch } from '../rag/embeddings.js';
import { saveVectorStore } from '../rag/vectorStore.js';

const router = Router();

/**
 * Enrich short follow-up queries with the previous user question so vector retrieval stays accurate.
 */
function buildRetrievalQuery(query, history = []) {
  const trimmed = query.trim();
  const wordCount = trimmed.split(/\s+/).length;

  if (wordCount <= 6 && Array.isArray(history) && history.length > 0) {
    const lastUserTurn = [...history]
      .reverse()
      .find((m) => (m.sender === 'user' || m.role === 'user') && m.text);
    if (lastUserTurn) {
      return `${lastUserTurn.text.trim()} — Follow-up: ${trimmed}`;
    }
  }
  return trimmed;
}

router.post('/chat', async (req, res, next) => {
  try {
    const { query, history = [] } = req.body || {};

    if (typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Field "query" must be a non-empty string.' });
    }
    if (query.length > 1000) {
      return res.status(400).json({ error: 'Query is too long (max 1000 characters).' });
    }

    // 1. Emergency medical safety check
    const redFlag = checkRedFlags(query);
    if (redFlag.isEmergency) {
      return res.json({
        text: redFlag.message,
        remedyId: null,
        isRemedyResponse: false,
        safetyAlert: true,
        sources: [],
      });
    }

    // 2. Retrieve relevant chunks from Chikitsa knowledge base
    const t0 = Date.now();
    const retrievalQuery = buildRetrievalQuery(query, history);
    const retrievedDocs = await retrieveRelevantDocs(retrievalQuery);
    const tRetrieve = Date.now() - t0;

    // 3. Generate grounded Dadi Maa response with Gemini
    const t1 = Date.now();
    const answer = await generateRagAnswer({
      query: query.trim(),
      retrievedDocs,
      history,
    });
    const tGenerate = Date.now() - t1;
    console.log(
      `[chat] model=${answer.modelUsed} | retrieved=${retrievedDocs.length} (${tRetrieve}ms) | generated (${tGenerate}ms) | remedyId=${answer.remedyId}`
    );

    return res.json({
      text: answer.text,
      remedyId: answer.remedyId,
      isRemedyResponse: Boolean(answer.remedyId),
      safetyAlert: false,
      modelUsed: answer.modelUsed,
      sources: retrievedDocs.map((d) => ({
        id: d.id,
        title: d.metadata?.title || d.id,
        source: d.metadata?.source || null,
        remedyId: d.metadata?.remedyId || null,
        score: d.score,
      })),
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * Re-scan server/knowledge/ and rebuild embeddings without restarting the server.
 */
router.post('/reindex', async (_req, res, next) => {
  try {
    const docs = await loadKnowledgeFiles(config.knowledgeDir);
    const vectors = await embedBatch(
      docs.map((d) => d.text),
      'RETRIEVAL_DOCUMENT'
    );
    const records = docs.map((doc, i) => ({
      ...doc,
      embedding: vectors[i],
    }));
    const saved = await saveVectorStore(records);

    return res.json({
      status: 'ok',
      indexedCount: saved.count,
      dimensions: saved.dimensions,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
