import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import mammoth from 'mammoth';

const SUPPORTED_EXTENSIONS = new Set(['.csv', '.txt', '.md', '.docx', '.doc']);

/**
 * Split long plain text into overlapping chunks along paragraph/sentence boundaries.
 */
function chunkText(text, { chunkSize = 900, overlap = 150 } = {}) {
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (!cleaned) return [];
  if (cleaned.length <= chunkSize) return [cleaned];

  const chunks = [];
  let start = 0;

  while (start < cleaned.length) {
    let end = Math.min(start + chunkSize, cleaned.length);

    if (end < cleaned.length) {
      // Try to split cleanly at a paragraph, newline, or sentence end
      const slice = cleaned.slice(start, end);
      const breakIdx = Math.max(
        slice.lastIndexOf('\n\n'),
        slice.lastIndexOf('. '),
        slice.lastIndexOf('\n')
      );
      if (breakIdx > chunkSize * 0.4) {
        end = start + breakIdx + 1;
      }
    }

    const piece = cleaned.slice(start, end).trim();
    if (piece) chunks.push(piece);

    if (end >= cleaned.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

/**
 * Parse any CSV file: each row becomes one document with all non-empty columns formatted cleanly.
 */
async function parseCsvFile(filePath, fileName) {
  const raw = await fs.readFile(filePath, 'utf8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  });

  const docs = [];
  records.forEach((row, index) => {
    const entries = Object.entries(row).filter(
      ([key, val]) => key && val !== undefined && String(val).trim() !== ''
    );
    if (entries.length === 0) return;

    const text = entries
      .map(([key, val]) => `${key.replace(/_/g, ' ').toUpperCase()}: ${String(val).trim()}`)
      .join('\n');

    const rowId = row.id || row.remedy_id || `${path.basename(fileName, '.csv')}-row-${index + 1}`;
    const isRemedy =
      fileName.toLowerCase().includes('remed') ||
      String(row.type || '').toLowerCase() === 'remedy' ||
      String(rowId).startsWith('rem-');

    docs.push({
      id: `${fileName}::${rowId}`,
      text,
      metadata: {
        source: fileName,
        sourceType: 'csv',
        docType: isRemedy ? 'remedy' : row.type || 'knowledge',
        remedyId: isRemedy && row.id ? String(row.id).trim() : null,
        title: row.title || row.name || rowId,
        category: row.category || null,
        tags: row.tags
          ? String(row.tags)
              .split(/[;,]/)
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      },
    });
  });

  return docs;
}

/**
 * Parse .txt or .md files into overlapping chunks.
 */
async function parseTextFile(filePath, fileName) {
  const raw = await fs.readFile(filePath, 'utf8');
  const chunks = chunkText(raw);
  const title = path.basename(fileName, path.extname(fileName));

  return chunks.map((chunk, idx) => ({
    id: `${fileName}::chunk-${idx + 1}`,
    text: `SOURCE: ${fileName}\n${chunk}`,
    metadata: {
      source: fileName,
      sourceType: path.extname(fileName).slice(1).toLowerCase(),
      docType: 'document',
      remedyId: null,
      title: chunks.length > 1 ? `${title} (Part ${idx + 1})` : title,
      category: null,
      tags: [],
    },
  }));
}

/**
 * Parse .docx files via mammoth, or best-effort printable text extraction for legacy .doc files.
 */
async function parseDocFile(filePath, fileName) {
  const ext = path.extname(fileName).toLowerCase();
  let rawText = '';

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    rawText = result.value || '';
  } else {
    // Legacy binary .doc fallback: extract readable text runs (recommend saving as .docx for best accuracy)
    const buffer = await fs.readFile(filePath);
    rawText = buffer
      .toString('utf8')
      .replace(/[^\x20-\x7E\n\r\t\u0900-\u097F]+/g, ' ')
      .replace(/\s{3,}/g, '\n')
      .trim();
    console.warn(
      `[warn] "${fileName}" is a legacy binary .doc file. Extracted best-effort text; convert to .docx for highest accuracy.`
    );
  }

  const chunks = chunkText(rawText);
  const title = path.basename(fileName, ext);

  return chunks.map((chunk, idx) => ({
    id: `${fileName}::chunk-${idx + 1}`,
    text: `SOURCE: ${fileName}\n${chunk}`,
    metadata: {
      source: fileName,
      sourceType: ext.slice(1),
      docType: 'document',
      remedyId: null,
      title: chunks.length > 1 ? `${title} (Part ${idx + 1})` : title,
      category: null,
      tags: [],
    },
  }));
}

/**
 * Recursively scan a directory for supported knowledge files (.csv, .txt, .md, .docx, .doc).
 */
async function collectFiles(dirPath, rootDir = dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.startsWith('~$')) continue;

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, rootDir)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        files.push({
          fullPath,
          relativeName: path.relative(rootDir, fullPath).replace(/\\/g, '/'),
          ext,
        });
      }
    }
  }

  return files;
}

export async function loadKnowledgeFiles(knowledgeDir) {
  const files = await collectFiles(knowledgeDir);
  if (files.length === 0) {
    throw new Error(
      `No supported files (.csv, .txt, .md, .docx, .doc) found in ${knowledgeDir}`
    );
  }

  const allDocs = [];
  for (const file of files) {
    let parsed = [];
    if (file.ext === '.csv') {
      parsed = await parseCsvFile(file.fullPath, file.relativeName);
    } else if (file.ext === '.txt' || file.ext === '.md') {
      parsed = await parseTextFile(file.fullPath, file.relativeName);
    } else if (file.ext === '.docx' || file.ext === '.doc') {
      parsed = await parseDocFile(file.fullPath, file.relativeName);
    }
    console.log(`  Parsed ${file.relativeName} -> ${parsed.length} chunk(s)`);
    allDocs.push(...parsed);
  }

  return allDocs;
}
