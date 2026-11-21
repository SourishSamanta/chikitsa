import { REMEDIES } from './remedies';

export const QUICK_PROMPTS = [
  { id: 'qp-1', title: 'Cough & Cold', query: 'Cough with ginger and lemon juice in warm water', icon: 'cloud-outline' },
  { id: 'qp-2', title: 'Acidity & Gas', query: 'Relief for stomach acidity and bloating post meal', icon: 'flame-outline' },
  { id: 'qp-3', title: 'Sore Throat', query: 'Sore throat and hoarse voice remedy', icon: 'fitness-outline' },
  { id: 'qp-4', title: 'Golden Milk', query: 'How to make Dadi Maa Turmeric Golden Milk?', icon: 'sunny-outline' },
  { id: 'qp-5', title: 'Toothache Pain', query: 'Instant remedy for sharp toothache pain', icon: 'star-outline' },
  { id: 'qp-6', title: 'Sleep & Stress', query: 'Natural home remedy for good sleep at night', icon: 'moon-outline' },
];

export const INTENTS = [
  {
    keywords: ['cough', 'cold', 'phlegm', 'chest', 'mucus', 'flu', 'sneezing', 'runny nose'],
    remedyId: 'rem-1',
    greeting: 'Namaste beta! For cough and cold, nothing works better than warm Ginger, Lemon, and Honey water.',
  },
  {
    keywords: ['body ache', 'feverish', 'fatigue', 'turmeric milk', 'golden milk', 'haldi doodh'],
    remedyId: 'rem-2',
    greeting: 'Pranam! When your body feels tired or cold is setting in, Dadi Maa’s Golden Turmeric Milk is pure magic.',
  },
  {
    keywords: ['acidity', 'gas', 'bloating', 'indigestion', 'stomach ache', 'heartburn', 'sour belch'],
    remedyId: 'rem-3',
    greeting: 'Aha! Stomach discomfort after meals? Ajwain (carom seeds) and Kala Namak will give instant relief.',
  },
  {
    keywords: ['sore throat', 'throat pain', 'hoarseness', 'tonsil', 'swallowing pain', 'kadha'],
    remedyId: 'rem-4',
    greeting: 'Beta, a sore throat needs the natural soothing power of Tulsi leaves and Cloves cooked in warm water.',
  },
  {
    keywords: ['headache', 'head ache', 'sinus', 'migraine', 'temple pain', 'stress headache'],
    remedyId: 'rem-5',
    greeting: 'Headaches are often caused by stress or sinus pressure. Let’s calm it with fresh Ginger tea and steam.',
  },
  {
    keywords: ['toothache', 'tooth pain', 'gum pain', 'tooth', 'dentist pain'],
    remedyId: 'rem-6',
    greeting: 'Oh dear, toothache can be very sharp! Place a crushed Clove (Laung) right next to the tooth.',
  },
  {
    keywords: ['immunity', 'amla', 'vitality', 'vitamin c', 'weakness', 'glow'],
    remedyId: 'rem-7',
    greeting: 'To keep illnesses away, take 1 glass of fresh Amla juice with honey every morning on an empty stomach.',
  },
  {
    keywords: ['sleep', 'insomnia', 'restless', 'anxiety', 'mind racing', 'cannot sleep'],
    remedyId: 'rem-8',
    greeting: 'Having trouble sleeping? A warm cup of milk with a tiny pinch of Nutmeg (Jaiphal) calms your nerve system.',
  }
];

export function findBotResponse(userQuery) {
  const queryLower = userQuery.toLowerCase();

  // Check direct matches in remedies title or tags
  const matchedRemedy = REMEDIES.find(r => 
    r.title.toLowerCase().includes(queryLower) ||
    r.tags.some(t => queryLower.includes(t.toLowerCase())) ||
    r.ingredientsList.some(i => i.ingredient.name.toLowerCase().includes(queryLower))
  );

  // Check intent list
  const intentMatch = INTENTS.find(intent => 
    intent.keywords.some(k => queryLower.includes(k))
  );

  if (intentMatch) {
    const remedy = REMEDIES.find(r => r.id === intentMatch.remedyId);
    return {
      text: `${intentMatch.greeting}\n\nHere is Dadi Maa’s exact step-by-step remedy prepared with authentic Indian ingredients:`,
      remedy: remedy || matchedRemedy || REMEDIES[0],
      isRemedyResponse: true
    };
  }

  if (matchedRemedy) {
    return {
      text: `Beta, here is the traditional Indian remedy you requested for "${matchedRemedy.title}":`,
      remedy: matchedRemedy,
      isRemedyResponse: true
    };
  }

  // Fallback response with suggested queries
  return {
    text: `Namaste! I am your Dadi Maa AI assistant in Chikitsa 🌿.\n\nI can recommend authentic Indian home remedies for minor low-level ailments like Cough, Cold, Acidity, Sore Throat, Headaches, Toothaches, and Sleep tips using ingredients like Ginger, Lemon, Turmeric, Honey, Ajwain, and Tulsi.\n\nCould you specify your symptom or tap one of the suggested prompts below?`,
    remedy: null,
    isRemedyResponse: false
  };
}
