import { config, assertApiKey } from '../config.js';
import { loadKnowledgeFiles } from '../rag/fileParser.js';
import { embedBatch } from '../rag/embeddings.js';
import { saveVectorStore } from '../rag/vectorStore.js';

async function runIngest() {
  console.log('--- Chikitsa RAG Ingestion ---');
  assertApiKey();

  console.log(`1. Scanning knowledge folder: ${config.knowledgeDir}`);
  const docs = await loadKnowledgeFiles(config.knowledgeDir);
  console.log(`   Total documents/chunks ready: ${docs.length}`);

  console.log(
    `2. Generating embeddings using ${config.embeddingModel} (${config.embeddingDimensions}d)...`
  );
  const vectors = await embedBatch(
    docs.map((d) => d.text),
    'RETRIEVAL_DOCUMENT'
  );

  const records = docs.map((doc, i) => ({
    ...doc,
    embedding: vectors[i],
  }));

  console.log(`3. Saving vector store to: ${config.vectorStorePath}`);
  const saved = await saveVectorStore(records);

  console.log(
    `Done! Indexed ${saved.count} chunks (${saved.dimensions} dimensions) at ${saved.createdAt}.`
  );
}

runIngest().catch((err) => {
  console.error('Ingestion failed:', err.message);
  process.exit(1);
});
