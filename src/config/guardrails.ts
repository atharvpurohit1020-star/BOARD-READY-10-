export interface GuardrailRule {
  subjectCode: string;
  prohibitedTopics: string[];
  prohibitedKeywords: string[];
  mandatoryRules: string[];
}

export const GUARDRAILS: Record<string, GuardrailRule> = {
  '041': {
    subjectCode: '041',
    prohibitedTopics: [
      "Euclid's Division Lemma",
      'Area of a Triangle using coordinate formula (1/2 [x1(y2-y3)...])',
      'Frustum of a Right Circular Cone',
      'Cross-Multiplication Method for pair of linear equations',
      'Geometric Constructions (Entire chapter deleted from Class X)',
      'Decimal representation of rational numbers (terminating/non-terminating)',
    ],
    prohibitedKeywords: ['euclid', 'frustum', 'cross-multiplication', 'construction of tangent using compass', 'area of triangle formula'],
    mandatoryRules: [
      'Take π = 22/7 unless explicitly stated as 3.14.',
      'No trigonometric ratios for angles beyond 0°, 30°, 45°, 60°, 90°.',
      'All numerical solutions must be verified with exact algebra.',
      'Provide step marks breakdown in integer or half-marks (½, 1).',
    ],
  },
  '241': {
    subjectCode: '241',
    prohibitedTopics: [
      "Euclid's Division Lemma",
      'Area of a Triangle using coordinate formula',
      'Frustum of a Right Circular Cone',
      'Cross-Multiplication Method',
      'Constructions',
    ],
    prohibitedKeywords: ['euclid', 'frustum', 'cross-multiplication', 'construction'],
    mandatoryRules: [
      'Questions must be direct NCERT level; avoid overly intricate multi-step proofs.',
    ],
  },
  '086': {
    subjectCode: '086',
    prohibitedTopics: [
      'Periodic Classification of Elements (Entire chapter deleted)',
      'Sources of Energy (Entire chapter deleted)',
      'Sustainable Management of Natural Resources (Internal Assessment only)',
      'Evolution (Origin of life, Darwinism, speciation - deleted from Heredity)',
      'Electric Motor and Electromagnetic Induction (Fleming Left/Right Hand rule details modified/rationalised)',
    ],
    prohibitedKeywords: ['periodic classification', 'mendeleev', 'dobereiner', 'newlands octaves', 'sources of energy', 'biogas plant', 'fossil fuel types', 'speciation', 'homologous organs', 'analogous organs'],
    mandatoryRules: [
      'Chemistry questions must feature properly balanced chemical equations with state symbols when requested.',
      'Physics circuit diagrams must have clean labels and clear polarity.',
      'Biology diagrams must be simplified line diagrams as per NCERT.',
      'Must follow Section A (Bio), Section B (Chem), Section C (Phy) separation.',
    ],
  },
  '087': {
    subjectCode: '087',
    prohibitedTopics: [
      'Consumer Rights (Project work only - not in theory exam)',
      'Forest and Wildlife Resources (Periodic tests / IA only for theory questions)',
      'Lifelines of National Economy (MAP ONLY in Board Exam - no theoretical questions)',
    ],
    prohibitedKeywords: ['consumer protection act', 'copra', 'consumer rights', 'isi mark', 'consumer courts'],
    mandatoryRules: [
      'Lifelines of National Economy must strictly generate Map-based questions (Airports, Major Sea Ports).',
      'Map questions must include outline India map plus visually impaired alternative.',
      'Strict word limits: VSA ≤ 40 words, SA ≤ 60 words, LA ≤ 120 words.',
    ],
  },
  '184': {
    subjectCode: '184',
    prohibitedTopics: [
      'The Hack Driver (Deleted from Footprints without Feet)',
      'Animals (Poem deleted)',
      'Direct-Indirect transformation without context (Grammar must be in dialogue/passage format)',
    ],
    prohibitedKeywords: ['hack driver', 'lutkins', 'animals poem by walt whitman'],
    mandatoryRules: [
      'Grammar must be cloze or conversational dialogue format matching CBSE 2026-27 format.',
      'Analytical paragraph must specify word limit of 100-120 words and be grounded in data cue/chart.',
    ],
  },
};
