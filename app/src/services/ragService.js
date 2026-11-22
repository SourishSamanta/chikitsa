import { Platform } from 'react-native';
import { REMEDIES } from '../data/remedies';

const REQUEST_TIMEOUT_MS = 35000;

function getDefaultBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // Android emulator maps host machine's localhost to 10.0.2.2
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
}

export const API_BASE_URL = getDefaultBaseUrl();

/**
 * Send a user query + recent chat history to the Chikitsa RAG backend.
 * Returns a response object compatible with ChatScreen and ChatBubble.
 */
export async function askDadiMaa(query, history = []) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const cleanHistory = history
      .filter((m) => m && m.id !== 'msg-welcome' && typeof m.text === 'string' && m.text.trim())
      .slice(-6)
      .map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        history: cleanHistory,
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }

    const matchedRemedy = data.remedyId
      ? REMEDIES.find((r) => r.id === data.remedyId) || null
      : null;

    return {
      text: data.text || 'Namaste beta! Could you please ask that again?',
      remedy: matchedRemedy,
      isRemedyResponse: Boolean(matchedRemedy),
      safetyAlert: Boolean(data.safetyAlert),
      sources: data.sources || [],
      isOfflineFallback: false,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
