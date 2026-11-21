export const CATEGORIES = [
  { id: 'all', name: 'All Remedies', icon: 'leaf-outline', color: '#1B4332' },
  { id: 'respiratory', name: 'Cough & Cold', icon: 'cloud-outline', color: '#0284C7' },
  { id: 'digestive', name: 'Stomach & Acidity', icon: 'restaurant-outline', color: '#D97706' },
  { id: 'throat', name: 'Sore Throat', icon: 'fitness-outline', color: '#7C3AED' },
  { id: 'headache', name: 'Headache & Stress', icon: 'pulse-outline', color: '#DC2626' },
  { id: 'immunity', name: 'Immunity & Energy', icon: 'shield-checkmark-outline', color: '#16A34A' },
  { id: 'skin_hair', name: 'Skin & Hair', icon: 'sparkles-outline', color: '#DB2777' },
  { id: 'sleep', name: 'Sleep & Relaxation', icon: 'moon-outline', color: '#4F46E5' },
];

export const INDIAN_INGREDIENTS = {
  GINGER: { name: 'Ginger (Adrak)', icon: 'flame-outline', color: '#D97706', benefits: 'Reduces inflammation, eases cough, boosts digestion' },
  LEMON: { name: 'Lemon Juice (Nimbu)', icon: 'nutrition-outline', color: '#EAB308', benefits: 'Rich in Vitamin C, detoxicant, balances pH' },
  HONEY: { name: 'Raw Honey (Shahad)', icon: 'color-palette-outline', color: '#B45309', benefits: 'Natural antibacterial, coats & soothes throat' },
  TURMERIC: { name: 'Turmeric (Haldi)', icon: 'sunny-outline', color: '#F59E0B', benefits: 'Powerful curcumin antioxidant, natural antiseptic' },
  TULSI: { name: 'Tulsi Leaves (Holy Basil)', icon: 'leaf-outline', color: '#15803D', benefits: 'Adaptogenic, fights respiratory infections' },
  AJWAIN: { name: 'Carom Seeds (Ajwain)', icon: 'grid-outline', color: '#78350F', benefits: 'Relieves gas, bloating, and stomach cramps' },
  BLACK_PEPPER: { name: 'Black Pepper (Kali Mirch)', icon: 'ellipse-outline', color: '#334155', benefits: 'Enhances nutrient absorption, relieves congestion' },
  JEERA: { name: 'Cumin Seeds (Saunf/Jeera)', icon: 'options-outline', color: '#92400E', benefits: 'Cools stomach, improves digestion' },
  CLOVE: { name: 'Clove (Laung)', icon: 'star-outline', color: '#451A03', benefits: 'Natural analgesic for toothache and sore throat' },
  GHEE: { name: 'Pure Desi Ghee', icon: 'water-outline', color: '#CA8A04', benefits: 'Lubricates joints & intestine, calms Vata dosha' },
  MUSTARD_OIL: { name: 'Mustard Oil (Sarson Oil)', icon: 'beaker-outline', color: '#A16207', benefits: 'Warming oil for chest rub & muscle soreness' },
  GARLIC: { name: 'Garlic (Lahsun)', icon: 'hardware-chip-outline', color: '#475569', benefits: 'Antimicrobial, lowers blood pressure, warm potency' },
  AMLA: { name: 'Indian Gooseberry (Amla)', icon: 'aperture-outline', color: '#16A34A', benefits: 'Highest natural source of Vitamin C & antioxidants' },
};

export const REMEDIES = [
  {
    id: 'rem-1',
    title: 'Ginger, Lemon & Honey Warm Water Elixir',
    subtitle: 'Classic remedy for persistent cough, congestion & low energy',
    category: 'respiratory',
    difficulty: 'Easy',
    prepTime: '5 mins',
    tags: ['Cough', 'Cold', 'Immunity', 'Morning Routine'],
    ingredientsList: [
      { ingredient: INDIAN_INGREDIENTS.GINGER, quantity: '1 inch freshly grated' },
      { ingredient: INDIAN_INGREDIENTS.LEMON, quantity: '1 tbsp fresh juice' },
      { ingredient: INDIAN_INGREDIENTS.HONEY, quantity: '1 tsp raw honey' },
      { ingredient: INDIAN_INGREDIENTS.BLACK_PEPPER, quantity: '1 pinch freshly ground' },
    ],
    preparationSteps: [
      'Boil 1.5 cups of water in a vessel with grated ginger for 3–5 minutes.',
      'Strain the hot ginger decoction into a cup.',
      'Allow it to cool slightly until warm (not boiling hot).',
      'Squeeze 1 tbsp fresh lemon juice and stir in 1 tsp raw honey.',
      'Add a tiny pinch of black pepper and sip slowly while warm.'
    ],
    bestTimeToTake: 'First thing in the morning on an empty stomach or twice daily during active cough.',
    dosage: '1 cup, 2 times a day',
    whyItWorks: 'Ginger contains gingerol which relaxes airway muscles. Lemon provides Vitamin C to fight pathogens, while honey coats the throat lining to suppress cough reflexes.',
    precautions: 'Do not add honey to boiling hot water as high heat alters honey nutrients. Diabetic patients should moderate honey usage.'
  },
  {
    id: 'rem-2',
    title: 'Golden Turmeric Milk (Dadi Maa Haldi Doodh)',
    subtitle: 'Traditional elixir for body aches, throat irritation & deep restful sleep',
    category: 'respiratory',
    difficulty: 'Easy',
    prepTime: '7 mins',
    tags: ['Body Ache', 'Cold', 'Sleep', 'Immunity'],
    ingredientsList: [
      { ingredient: INDIAN_INGREDIENTS.TURMERIC, quantity: '1/2 tsp organic powder' },
      { ingredient: INDIAN_INGREDIENTS.BLACK_PEPPER, quantity: '1 pinch' },
      { ingredient: INDIAN_INGREDIENTS.GHEE, quantity: '1/4 tsp pure ghee' },
      { ingredient: INDIAN_INGREDIENTS.HONEY, quantity: '1 tsp (optional)' },
    ],
    preparationSteps: [
      'Heat 1 cup of milk (or plant-based milk) in a small saucepan.',
      'Add 1/2 tsp turmeric powder and a pinch of black pepper (essential for curcumin activation).',
      'Add 1/4 tsp Desi Ghee for healthy fats.',
      'Simmer on low flame for 3–4 minutes stirring gently.',
      'Pour into your mug and let cool slightly before drinking.'
    ],
    bestTimeToTake: '30 minutes before bedtime.',
    dosage: '1 warm glass at night',
    whyItWorks: 'Curcumin in turmeric has potent anti-inflammatory properties. Black pepper increases curcumin absorption by up to 2000%. Ghee aids absorption.',
    precautions: 'If lactose sensitive, use almond milk or oat milk.'
  },
  {
    id: 'rem-3',
    title: 'Ajwain & Kala Namak Digestive Decoction',
    subtitle: 'Instant relief from stomach bloating, acidity, gas & indigestion',
    category: 'digestive',
    difficulty: 'Super Fast',
    prepTime: '3 mins',
    tags: ['Acidity', 'Bloating', 'Gas', 'Indigestion'],
    ingredientsList: [
      { ingredient: INDIAN_INGREDIENTS.AJWAIN, quantity: '1 tsp carom seeds' },
      { ingredient: INDIAN_INGREDIENTS.JEERA, quantity: '1/2 tsp cumin seeds' },
    ],
    preparationSteps: [
      'Take 1 tsp Ajwain and 1/2 tsp Cumin seeds.',
      'Optionally dry roast them gently on a pan for 1 minute until fragrant.',
      'Boil in 1 glass of water for 3 minutes until water turns light golden.',
      'Add a pinch of Black Salt (Kala Namak) and drink warm after heavy meals.'
    ],
    bestTimeToTake: '15-20 minutes post meal when feeling bloated or acid reflux.',
    dosage: '1/2 to 1 glass',
    whyItWorks: 'Thymol present in Ajwain seeds stimulates gastric juices, speeding up digestion and expelling trapped digestive gases immediately.',
    precautions: 'Avoid excessive consumption if suffering from severe stomach ulcers.'
  },
  {
    id: 'rem-4',
    title: 'Tulsi & Clove Kadha for Sore Throat',
    subtitle: 'Warm herbal tea to soothe hoarseness, tickling throat & tonsil discomfort',
    category: 'throat',
    difficulty: 'Easy',
    prepTime: '8 mins',
    tags: ['Sore Throat', 'Hoarseness', 'Kadha', 'Flu'],
    ingredientsList: [
      { ingredient: INDIAN_INGREDIENTS.TULSI, quantity: '8-10 fresh leaves' },
      { ingredient: INDIAN_INGREDIENTS.CLOVE, quantity: '2 crushed cloves' },
      { ingredient: INDIAN_INGREDIENTS.GINGER, quantity: '1/2 inch crushed' },
      { ingredient: INDIAN_INGREDIENTS.BLACK_PEPPER, quantity: '2 whole crushed peppercorns' },
    ],
    preparationSteps: [
      'Boil 2 cups of water with Tulsi leaves, crushed cloves, ginger, and black pepper.',
      'Reduce water to 1 cup on medium heat.',
      'Strain into a cup, add 1/2 tsp honey when warm.',
      'Sip slowly, allowing the warm liquid to bathe your throat.'
    ],
    bestTimeToTake: 'Morning & evening during sore throat or seasonal changes.',
    dosage: '1 cup twice daily',
    whyItWorks: 'Clove contains eugenol, a natural numbing agent. Tulsi and ginger have antibacterial properties that kill throat pathogens.',
    precautions: 'Consume warm, not piping hot to avoid scalding delicate throat tissue.'
  },
  {
    id: 'rem-5',
    title: 'Ginger & Mint Head Soother',
    subtitle: 'Calms tension headaches, sinus pressure & mental fatigue',
    category: 'headache',
    difficulty: 'Easy',
    prepTime: '5 mins',
    tags: ['Headache', 'Sinus Pressure', 'Stress Relief'],
    ingredientsList: [
      { ingredient: INDIAN_INGREDIENTS.GINGER, quantity: '1/2 inch crushed' },
      { ingredient: INDIAN_INGREDIENTS.LEMON, quantity: '1 tsp juice' },
    ],
    preparationSteps: [
      'Boil crushed ginger and fresh mint leaves in 1.5 cups of water.',
      'Inhale the warm ginger-mint steam deeply for 2 minutes before drinking.',
      'Strain, add lemon juice, and sip slowly in a quiet, dark room.'
    ],
    bestTimeToTake: 'At the onset of headache or sinus heaviness.',
    dosage: '1 cup as needed',
    whyItWorks: 'Ginger inhibits prostaglandin synthesis, relieving vascular muscle spasms that trigger headaches.',
    precautions: 'Stay hydrated with fresh water alongside herbal teas.'
  },
  {
    id: 'rem-6',
    title: 'Warm Clove Pressed Remedy for Toothache',
    subtitle: 'Numbing relief for sharp tooth pain & gum soreness',
    category: 'throat',
    difficulty: 'Instant',
    prepTime: '1 min',
    tags: ['Toothache', 'Gum Relief', 'Instant Pain Killer'],
    ingredientsList: [
      { ingredient: INDIAN_INGREDIENTS.CLOVE, quantity: '1-2 whole cloves or 1 drop oil' },
    ],
    preparationSteps: [
      'Gently crush a whole clove between your fingers to release essential oils.',
      'Place the clove directly on or adjacent to the aching tooth.',
      'Bite down gently to hold it in place for 15-20 minutes.',
      'Allow your saliva to mix with the released clove oil.'
    ],
    bestTimeToTake: 'Whenever tooth pain flares up.',
    dosage: 'Use 2-3 times a day',
    whyItWorks: 'Eugenol in cloves acts as an immediate anesthetic and antiseptic.',
    precautions: 'Temporary relief only. Visit a dentist for persistent cavity or root issues.'
  },
  {
    id: 'rem-7',
    title: 'Fresh Amla & Honey Immunity Booster',
    subtitle: 'Daily tonic for radiant skin, strong hair & robust immunity',
    category: 'immunity',
    difficulty: 'Easy',
    prepTime: '4 mins',
    tags: ['Immunity', 'Vitamin C', 'Skin Glow', 'Amla'],
    ingredientsList: [
      { ingredient: INDIAN_INGREDIENTS.AMLA, quantity: '2 tbsp fresh juice or 1 fresh amla' },
      { ingredient: INDIAN_INGREDIENTS.HONEY, quantity: '1 tsp' },
    ],
    preparationSteps: [
      'Extract 2 tbsp of fresh Amla (Indian Gooseberry) juice.',
      'Mix with 1/2 cup warm water.',
      'Stir in 1 tsp honey and drink fresh.'
    ],
    bestTimeToTake: 'Every morning on an empty stomach.',
    dosage: '1 small glass daily',
    whyItWorks: 'Amla is packed with 20 times more Vitamin C than an orange and boosts white blood cell response.',
    precautions: 'Fresh juice is preferred over packaged processed juices.'
  },
  {
    id: 'rem-8',
    title: 'Warm Nutmeg (Jaiphal) Milk for Deep Rest',
    subtitle: 'Calms an overactive mind and induces soothing natural sleep',
    category: 'sleep',
    difficulty: 'Easy',
    prepTime: '5 mins',
    tags: ['Insomnia', 'Sleep', 'Anxiety', 'Stress'],
    ingredientsList: [
      { ingredient: INDIAN_INGREDIENTS.GHEE, quantity: '1 drop' },
    ],
    preparationSteps: [
      'Warm 1 cup of cow milk or almond milk.',
      'Grate a small pinch (1/8th tsp) of fresh Nutmeg (Jaiphal) into the warm milk.',
      'Stir gently and drink warm 20 minutes before sleeping.'
    ],
    bestTimeToTake: 'Nighttime right before sleep.',
    dosage: '1 small glass',
    whyItWorks: 'Nutmeg contains myristicin and elemicin which act as mild natural sedatives to calm central nervous system activity.',
    precautions: 'Do not exceed a tiny pinch of nutmeg.'
  }
];
