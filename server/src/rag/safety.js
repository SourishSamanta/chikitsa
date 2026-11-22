const EMERGENCY_PATTERNS = [
  {
    pattern: /\b(chest pain|heart attack|crushing chest|left arm pain)\b/i,
    reason: 'possible cardiac emergency',
  },
  {
    pattern: /\b(can'?t breathe|cannot breathe|difficulty breathing|shortness of breath|gasping for air|choking)\b/i,
    reason: 'breathing emergency',
  },
  {
    pattern: /\b(severe bleeding|vomiting blood|coughing up blood|blood in stool|blood in urine)\b/i,
    reason: 'internal or severe bleeding',
  },
  {
    pattern: /\b(unconscious|fainted|seizure|stroke|slurred speech|face drooping|paralysis)\b/i,
    reason: 'neurological emergency',
  },
  {
    pattern: /\b(poisoning|overdose|swallowed chemical|severe allergic reaction|anaphylaxis|swollen throat)\b/i,
    reason: 'acute poisoning or anaphylaxis',
  },
  {
    pattern: /\b(suicid|kill myself|self[- ]harm|end my life)\b/i,
    reason: 'mental health crisis',
  },
];

/**
 * Checks if a query describes an urgent medical emergency where home remedies are unsafe.
 */
export function checkRedFlags(query) {
  const text = String(query || '').trim();
  for (const item of EMERGENCY_PATTERNS) {
    if (item.pattern.test(text)) {
      return {
        isEmergency: true,
        reason: item.reason,
        message:
          'Beta, what you are describing sounds like it could be a serious medical emergency. Please do NOT rely on home remedies for this — seek immediate medical attention, go to the nearest emergency room, or call your local emergency helpline right away (108 / 112 in India, 911 in the US).',
      };
    }
  }
  return { isEmergency: false, reason: null, message: null };
}
