import { Type } from '@google/genai';
import { config } from '../config.js';
import { getGeminiClient } from './embeddings.js';

const SYSTEM_INSTRUCTION = `You are "Dadi Maa AI", the warm, caring, knowledgeable traditional Indian home-remedy assistant inside the Chikitsa app.

STRICT GROUNDING RULES:
1. Answer ONLY using the provided "CHIKITSA KNOWLEDGE BASE CONTEXT". Do NOT invent remedies, ingredients, dosages, or medical claims that are not in the provided context.
2. If the retrieved context does not contain a relevant answer to the user's symptom or question, warmly say that you don't have a specific Dadi Maa remedy for that in Chikitsa yet, and mention the kinds of everyday ailments/topics you can help with (like cough, cold, acidity, sore throat, headache, toothache, immunity, sleep, and daily Ayurvedic habits).
3. Match the user's language style naturally (if they ask in English, reply in warm English; if they write in Hinglish, you can reply in friendly Hinglish or clear English with familiar Hindi ingredient names like Adrak, Haldi, Tulsi, Ajwain).
4. Whenever you recommend a remedy from the context, concisely include key preparation highlights, best time/dosage, AND any precautions mentioned in the context.
5. SAFETY: You are NOT a doctor. Never diagnose diseases or prescribe pharmaceutical medicines. For persistent, worsening, or severe symptoms, pregnancy, or very young children, always remind the user to consult a qualified doctor.
6. STRUCTURED OUTPUT:
   - Return valid JSON with "reply" (string) and "remedyId" (string or null).
   - Set "remedyId" to the exact REMEDY_ID from the context (e.g., "rem-1") ONLY when recommending that specific remedy so the app can display its full Remedy Card. Otherwise set "remedyId" to null.
   - Keep "reply" concise, warm, and well-formatted (no excessive markdown walls, because when remedyId is provided the app already displays the detailed Remedy Card below your message).`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: 'Warm, grounded Dadi Maa AI response to the user.',
    },
    remedyId: {
      type: Type.STRING,
      nullable: true,
      description:
        'Exact remedy ID from the retrieved context (e.g. "rem-1") if a specific remedy card should be shown, otherwise null.',
    },
  },
  required: ['reply'],
};

function formatContextBlock(docs) {
  if (!docs || docs.length === 0) {
    return 'NO RELEVANT CHIKITSA KNOWLEDGE FOUND FOR THIS QUERY.';
  }

  return docs
    .map((doc, idx) => {
      const meta = doc.metadata || {};
      const header = [
        `[Chunk ${idx + 1}]`,
        `SOURCE: ${meta.source || 'unknown'}`,
        `TYPE: ${meta.docType || 'knowledge'}`,
        meta.remedyId ? `REMEDY_ID: ${meta.remedyId}` : null,
        `RELEVANCE: ${doc.score}`,
      ]
        .filter(Boolean)
        .join(' | ');

      return `${header}\n${doc.text}`;
    })
    .join('\n\n---\n\n');
}

function normalizeHistory(history = []) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-6)
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({
      role: m.sender === 'user' || m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text.trim() }],
    }));
}

function isTransientOverload(err) {
  const status = err?.status || err?.statusCode;
  const msg = String(err?.message || '');
  return (
    status === 503 ||
    status === 504 ||
    status === 429 ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('DEADLINE_EXCEEDED') ||
    msg.includes('high demand') ||
    msg.includes('RESOURCE_EXHAUSTED')
  );
}

/**
 * Generate a grounded Dadi Maa AI response using Gemini and retrieved Chikitsa context.
 */
export async function generateRagAnswer({ query, retrievedDocs, history = [] }) {
  const ai = getGeminiClient();
  const contextBlock = formatContextBlock(retrievedDocs);
  const validRemedyIds = new Set(
    retrievedDocs.map((d) => d.metadata?.remedyId).filter(Boolean)
  );

  const priorTurns = normalizeHistory(history);

  const userPrompt = `CHIKITSA KNOWLEDGE BASE CONTEXT:
${contextBlock}

USER QUESTION:
${query}

Respond as Dadi Maa AI in JSON format.`;

  const contents = [
    ...priorTurns,
    { role: 'user', parts: [{ text: userPrompt }] },
  ];

  const modelsToTry = [
    ...new Set(
      [config.chatModel, config.fallbackChatModel, 'gemini-3.1-flash-lite'].filter(Boolean)
    ),
  ];

  let response = null;
  let modelUsed = config.chatModel;
  let lastError = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    const hasFallback = i < modelsToTry.length - 1;
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          ...(hasFallback ? { httpOptions: { timeout: 10000 } } : {}),
        },
      });
      modelUsed = modelName;
      break;
    } catch (err) {
      lastError = err;
      const isTimeout = err?.name === 'AbortError' || err?.name === 'TimeoutError' || String(err?.message || '').toLowerCase().includes('timeout');
      if ((isTransientOverload(err) || isTimeout) && hasFallback) {
        console.warn(
          `[warn] Model "${modelName}" failed (${isTimeout ? 'timeout' : '503/429 high demand'}). Falling back to "${modelsToTry[i + 1]}"...`
        );
        continue;
      }
      throw err;
    }
  }

  if (!response) {
    throw lastError || new Error('Failed to get response from Gemini.');
  }

  const rawText = (response.text || '').trim();
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    // Fallback if model wrapped JSON or returned plain text
    parsed = { reply: rawText || 'Namaste beta! Could you please rephrase your question?', remedyId: null };
  }

  const candidateId =
    typeof parsed.remedyId === 'string' && validRemedyIds.has(parsed.remedyId.trim())
      ? parsed.remedyId.trim()
      : null;

  return {
    text: String(parsed.reply || '').trim(),
    remedyId: candidateId,
    modelUsed,
  };
}
