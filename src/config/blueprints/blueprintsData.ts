import { Blueprint, BlueprintSection } from '../../types';

// Helper to create slots
function createSlots(
  sectionId: string,
  startQ: number,
  specs: { type: any; marks: number; internalChoice?: boolean; competency?: boolean; hint?: string }[]
) {
  let currentQ = startQ;
  const slots = [];
  for (const s of specs) {
    slots.push({
      q: currentQ++,
      sectionId,
      type: s.type,
      marks: s.marks,
      internalChoice: !!s.internalChoice,
      competencyFlag: s.competency,
      chapterOrUnitHint: s.hint,
    });
  }
  return slots;
}

// 1. MATHEMATICS STANDARD 041
export const BLUEPRINT_041: Blueprint = {
  subject_code: '041',
  subject_name: 'Mathematics (Standard)',
  session: '2026-27',
  max_marks: 80,
  duration_min: 180,
  general_instructions: [
    'This question paper contains 38 questions divided into 5 Sections: A, B, C, D, and E.',
    'All questions are compulsory. However, an internal choice in 2 Qs of 2 marks, 2 Qs of 3 marks, and 2 Qs of 5 marks has been provided. An internal choice has been provided in the 2-mark sub-part of Section E.',
    'Section A comprises 20 Multiple Choice Questions (MCQs) of 1 mark each (Q1 to Q18 are MCQs and Q19 & Q20 are Assertion-Reason questions).',
    'Section B comprises 5 Short Answer Type-I (VSA) questions of 2 marks each (Q21 to Q25).',
    'Section C comprises 6 Short Answer Type-II (SA) questions of 3 marks each (Q26 to Q31).',
    'Section D comprises 4 Long Answer (LA) questions of 5 marks each (Q32 to Q35).',
    'Section E comprises 3 Case-Based integrated units of assessment (Q36 to Q38) of 4 marks each with sub-parts of values 1, 1 and 2 marks respectively.',
    'All Questions must be answered in order. Use of calculators is not permitted. Take π = 22/7 wherever required if not stated.',
  ],
  sections: [
    {
      id: 'A',
      title: 'SECTION A',
      note: 'Section A consists of 20 questions of 1 mark each (Q1 to Q18 MCQs, Q19 & Q20 Assertion-Reason).',
      slots: [
        ...Array.from({ length: 18 }, (_, i) => ({
          q: i + 1,
          sectionId: 'A',
          type: 'MCQ' as const,
          marks: 1,
          internalChoice: false,
          competencyFlag: i >= 8,
        })),
        { q: 19, sectionId: 'A', type: 'ASSERTION_REASON' as const, marks: 1, internalChoice: false, competencyFlag: true },
        { q: 20, sectionId: 'A', type: 'ASSERTION_REASON' as const, marks: 1, internalChoice: false, competencyFlag: true },
      ],
    },
    {
      id: 'B',
      title: 'SECTION B',
      note: 'Section B consists of 5 questions of 2 marks each (Very Short Answer). Internal choice provided in 2 questions.',
      slots: [
        { q: 21, sectionId: 'B', type: 'VERY_SHORT' as const, marks: 2, internalChoice: true, competencyFlag: false },
        { q: 22, sectionId: 'B', type: 'VERY_SHORT' as const, marks: 2, internalChoice: false, competencyFlag: false },
        { q: 23, sectionId: 'B', type: 'VERY_SHORT' as const, marks: 2, internalChoice: true, competencyFlag: true },
        { q: 24, sectionId: 'B', type: 'VERY_SHORT' as const, marks: 2, internalChoice: false, competencyFlag: false },
        { q: 25, sectionId: 'B', type: 'VERY_SHORT' as const, marks: 2, internalChoice: false, competencyFlag: true },
      ],
    },
    {
      id: 'C',
      title: 'SECTION C',
      note: 'Section C consists of 6 questions of 3 marks each (Short Answer). Internal choice provided in 2 questions.',
      slots: [
        { q: 26, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: false, competencyFlag: false },
        { q: 27, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: true, competencyFlag: true },
        { q: 28, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: false, competencyFlag: false },
        { q: 29, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: true, competencyFlag: true },
        { q: 30, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: false, competencyFlag: true },
        { q: 31, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: false, competencyFlag: true },
      ],
    },
    {
      id: 'D',
      title: 'SECTION D',
      note: 'Section D consists of 4 questions of 5 marks each (Long Answer). Internal choice provided in 2 questions.',
      slots: [
        { q: 32, sectionId: 'D', type: 'LONG' as const, marks: 5, internalChoice: true, competencyFlag: true },
        { q: 33, sectionId: 'D', type: 'LONG' as const, marks: 5, internalChoice: false, competencyFlag: false },
        { q: 34, sectionId: 'D', type: 'LONG' as const, marks: 5, internalChoice: true, competencyFlag: true },
        { q: 35, sectionId: 'D', type: 'LONG' as const, marks: 5, internalChoice: false, competencyFlag: true },
      ],
    },
    {
      id: 'E',
      title: 'SECTION E',
      note: 'Section E consists of 3 Case-based questions of 4 marks each with sub-parts of 1, 1 and 2 marks. Internal choice provided in the 2-mark sub-part.',
      slots: [
        { q: 36, sectionId: 'E', type: 'CASE_BASED' as const, marks: 4, internalChoice: true, competencyFlag: true, hint: 'Arithmetic Progressions / Coordinate Geometry' },
        { q: 37, sectionId: 'E', type: 'CASE_BASED' as const, marks: 4, internalChoice: true, competencyFlag: true, hint: 'Applications of Trigonometry / Circles' },
        { q: 38, sectionId: 'E', type: 'CASE_BASED' as const, marks: 4, internalChoice: true, competencyFlag: true, hint: 'Surface Areas & Volumes / Statistics' },
      ],
    },
  ],
  chapter_weightage: {
    'Real Numbers': 6,
    'Polynomials': 4,
    'Pair of Linear Equations in Two Variables': 6,
    'Quadratic Equations': 6,
    'Arithmetic Progressions': 4,
    'Triangles': 9,
    'Coordinate Geometry': 6,
    'Introduction to Trigonometry': 8,
    'Some Applications of Trigonometry': 4,
    'Circles': 6,
    'Areas Related to Circles': 4,
    'Surface Areas and Volumes': 6,
    'Statistics': 7,
    'Probability': 4,
  },
  competency_min_pct: 50,
};

// 2. MATHEMATICS BASIC 241 (Structure is identical to 041, direct applications)
export const BLUEPRINT_241: Blueprint = {
  ...BLUEPRINT_041,
  subject_code: '241',
  subject_name: 'Mathematics (Basic)',
  general_instructions: [
    ...BLUEPRINT_041.general_instructions,
  ],
};

// 3. SCIENCE 086 (39 questions, 3 sections: Biology 30m, Chemistry 25m, Physics 25m)
export const BLUEPRINT_086: Blueprint = {
  subject_code: '086',
  subject_name: 'Science',
  session: '2026-27',
  max_marks: 80,
  duration_min: 180,
  general_instructions: [
    'This question paper consists of 39 questions in 3 Sections: Section A (Biology), Section B (Chemistry), and Section C (Physics).',
    'All questions are compulsory. Answer each section in its own designated part of the answer book.',
    'Section A (Biology - 30 marks): Q1 to Q9 (1 mark each), Q10 to Q12 (2 marks each), Q13 & Q14 (3 marks each), Q15 (4 marks Case-based), Q16 (5 marks).',
    'Section B (Chemistry - 25 marks): Q17 to Q24 (1 mark each), Q25 (2 marks), Q26 & Q27 (3 marks each), Q28 (4 marks Case-based), Q29 (5 marks).',
    'Section C (Physics - 25 marks): Q30 to Q32 (1 mark each), Q33 & Q34 (2 marks each), Q35 to Q37 (3 marks each), Q38 (4 marks Case-based), Q39 (5 marks).',
    'Internal choice has been provided in two 2-mark questions, two 3-mark questions, one 4-mark case question, and two 5-mark questions across the paper.',
    'Draw neat, labelled diagrams wherever necessary.',
  ],
  sections: [
    {
      id: 'A',
      title: 'SECTION A — BIOLOGY (30 Marks)',
      note: 'Questions 1 to 16 belong to Biology. Answer in the Biology section of the answer book.',
      slots: [
        // 9 x 1m (MCQ and Assertion-Reason)
        ...Array.from({ length: 7 }, (_, i) => ({
          q: i + 1,
          sectionId: 'A',
          type: 'MCQ' as const,
          marks: 1,
          internalChoice: false,
          competencyFlag: i >= 3,
        })),
        { q: 8, sectionId: 'A', type: 'ASSERTION_REASON' as const, marks: 1, internalChoice: false, competencyFlag: true },
        { q: 9, sectionId: 'A', type: 'ASSERTION_REASON' as const, marks: 1, internalChoice: false, competencyFlag: true },
        // 3 x 2m
        { q: 10, sectionId: 'A', type: 'VERY_SHORT' as const, marks: 2, internalChoice: true, competencyFlag: false },
        { q: 11, sectionId: 'A', type: 'VERY_SHORT' as const, marks: 2, internalChoice: false, competencyFlag: true },
        { q: 12, sectionId: 'A', type: 'VERY_SHORT' as const, marks: 2, internalChoice: false, competencyFlag: true },
        // 2 x 3m
        { q: 13, sectionId: 'A', type: 'SHORT' as const, marks: 3, internalChoice: true, competencyFlag: true },
        { q: 14, sectionId: 'A', type: 'SHORT' as const, marks: 3, internalChoice: false, competencyFlag: true },
        // 1 x 4m case
        { q: 15, sectionId: 'A', type: 'CASE_BASED' as const, marks: 4, internalChoice: true, competencyFlag: true },
        // 1 x 5m
        { q: 16, sectionId: 'A', type: 'LONG' as const, marks: 5, internalChoice: true, competencyFlag: true },
      ],
    },
    {
      id: 'B',
      title: 'SECTION B — CHEMISTRY (25 Marks)',
      note: 'Questions 17 to 29 belong to Chemistry. Answer in the Chemistry section of the answer book.',
      slots: [
        // 8 x 1m
        ...Array.from({ length: 6 }, (_, i) => ({
          q: 17 + i,
          sectionId: 'B',
          type: 'MCQ' as const,
          marks: 1,
          internalChoice: false,
          competencyFlag: i >= 2,
        })),
        { q: 23, sectionId: 'B', type: 'ASSERTION_REASON' as const, marks: 1, internalChoice: false, competencyFlag: true },
        { q: 24, sectionId: 'B', type: 'ASSERTION_REASON' as const, marks: 1, internalChoice: false, competencyFlag: true },
        // 1 x 2m
        { q: 25, sectionId: 'B', type: 'VERY_SHORT' as const, marks: 2, internalChoice: false, competencyFlag: true },
        // 2 x 3m
        { q: 26, sectionId: 'B', type: 'SHORT' as const, marks: 3, internalChoice: true, competencyFlag: false },
        { q: 27, sectionId: 'B', type: 'SHORT' as const, marks: 3, internalChoice: false, competencyFlag: true },
        // 1 x 4m case
        { q: 28, sectionId: 'B', type: 'CASE_BASED' as const, marks: 4, internalChoice: true, competencyFlag: true },
        // 1 x 5m
        { q: 29, sectionId: 'B', type: 'LONG' as const, marks: 5, internalChoice: true, competencyFlag: true },
      ],
    },
    {
      id: 'C',
      title: 'SECTION C — PHYSICS (25 Marks)',
      note: 'Questions 30 to 39 belong to Physics. Answer in the Physics section of the answer book.',
      slots: [
        // 3 x 1m
        { q: 30, sectionId: 'C', type: 'MCQ' as const, marks: 1, internalChoice: false, competencyFlag: false },
        { q: 31, sectionId: 'C', type: 'MCQ' as const, marks: 1, internalChoice: false, competencyFlag: true },
        { q: 32, sectionId: 'C', type: 'ASSERTION_REASON' as const, marks: 1, internalChoice: false, competencyFlag: true },
        // 2 x 2m
        { q: 33, sectionId: 'C', type: 'VERY_SHORT' as const, marks: 2, internalChoice: true, competencyFlag: true },
        { q: 34, sectionId: 'C', type: 'VERY_SHORT' as const, marks: 2, internalChoice: false, competencyFlag: true },
        // 3 x 3m
        { q: 35, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: true, competencyFlag: true },
        { q: 36, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: false, competencyFlag: false },
        { q: 37, sectionId: 'C', type: 'SHORT' as const, marks: 3, internalChoice: false, competencyFlag: true },
        // 1 x 4m case
        { q: 38, sectionId: 'C', type: 'CASE_BASED' as const, marks: 4, internalChoice: true, competencyFlag: true },
        // 1 x 5m
        { q: 39, sectionId: 'C', type: 'LONG' as const, marks: 5, internalChoice: true, competencyFlag: true },
      ],
    },
  ],
  chapter_weightage: {
    'Life Processes': 9,
    'Control and Coordination': 6,
    'How do Organisms Reproduce?': 6,
    'Heredity': 4,
    'Our Environment': 5,
    'Chemical Reactions and Equations': 6,
    'Acids, Bases and Salts': 6,
    'Metals and Non-metals': 7,
    'Carbon and its Compounds': 6,
    'Light – Reflection and Refraction': 9,
    'The Human Eye and the Colourful World': 3,
    'Electricity': 7,
    'Magnetic Effects of Electric Current': 6,
  },
  competency_min_pct: 50,
};

// 4. SOCIAL SCIENCE 087 (38 questions, 4 sections x 20 marks: History, Geography, Political Science, Economics)
export const BLUEPRINT_087: Blueprint = {
  subject_code: '087',
  subject_name: 'Social Science',
  session: '2026-27',
  max_marks: 80,
  duration_min: 180,
  general_instructions: [
    'The question paper comprises 38 questions divided into four Sections: Section A (History), Section B (Geography), Section C (Political Science), and Section D (Economics). Each section carries 20 marks.',
    'All questions are compulsory. Internal choice has been provided in certain questions.',
    'Answers should be brief and to the point: Very Short Answer (VSA) up to 40 words, Short Answer (SA) up to 60 words, Long Answer (LA) up to 120 words.',
    'Case-based questions have 3 sub-questions with answers within 100 words in total.',
    'Question 9 is a Map question from History (2 marks) and Question 19 is a Map question from Geography (3 marks). Attach the given Outline Political Map of India securely with your answer sheet.',
    'Alternative questions are provided for visually impaired candidates in lieu of map questions.',
  ],
  sections: [
    {
      id: 'A',
      title: 'SECTION A — HISTORY (20 Marks)',
      note: 'Questions 1 to 9 (4 MCQs, 1 VSA, 1 SA, 1 LA, 1 Case, 1 Map).',
      slots: [
        { q: 1, sectionId: 'A', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 2, sectionId: 'A', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 3, sectionId: 'A', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 4, sectionId: 'A', type: 'ASSERTION_REASON', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 5, sectionId: 'A', type: 'VERY_SHORT', marks: 2, internalChoice: true, competencyFlag: false },
        { q: 6, sectionId: 'A', type: 'SHORT', marks: 3, internalChoice: false, competencyFlag: true },
        { q: 7, sectionId: 'A', type: 'LONG', marks: 5, internalChoice: true, competencyFlag: true },
        { q: 8, sectionId: 'A', type: 'CASE_BASED', marks: 4, internalChoice: false, competencyFlag: true },
        { q: 9, sectionId: 'A', type: 'MAP', marks: 2, internalChoice: false, competencyFlag: true, hint: 'History Map (Nationalism in India: Congress sessions, Satyagraha centres)' },
      ],
    },
    {
      id: 'B',
      title: 'SECTION B — GEOGRAPHY (20 Marks)',
      note: 'Questions 10 to 19 (6 MCQs, 1 VSA, 0 SA, 1 LA, 1 Case, 1 Map).',
      slots: [
        { q: 10, sectionId: 'B', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 11, sectionId: 'B', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 12, sectionId: 'B', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 13, sectionId: 'B', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 14, sectionId: 'B', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 15, sectionId: 'B', type: 'ASSERTION_REASON', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 16, sectionId: 'B', type: 'VERY_SHORT', marks: 2, internalChoice: true, competencyFlag: true },
        { q: 17, sectionId: 'B', type: 'LONG', marks: 5, internalChoice: true, competencyFlag: true },
        { q: 18, sectionId: 'B', type: 'CASE_BASED', marks: 4, internalChoice: false, competencyFlag: true },
        { q: 19, sectionId: 'B', type: 'MAP', marks: 3, internalChoice: false, competencyFlag: true, hint: 'Geography Map (Dams, Major crops, Minerals, Power plants, Software Tech Parks, Seaports/Airports)' },
      ],
    },
    {
      id: 'C',
      title: 'SECTION C — POLITICAL SCIENCE (20 Marks)',
      note: 'Questions 20 to 28 (4 MCQs, 2 VSA, 1 SA, 1 LA, 1 Case).',
      slots: [
        { q: 20, sectionId: 'C', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 21, sectionId: 'C', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 22, sectionId: 'C', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 23, sectionId: 'C', type: 'ASSERTION_REASON', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 24, sectionId: 'C', type: 'VERY_SHORT', marks: 2, internalChoice: true, competencyFlag: true },
        { q: 25, sectionId: 'C', type: 'VERY_SHORT', marks: 2, internalChoice: false, competencyFlag: false },
        { q: 26, sectionId: 'C', type: 'SHORT', marks: 3, internalChoice: false, competencyFlag: true },
        { q: 27, sectionId: 'C', type: 'LONG', marks: 5, internalChoice: true, competencyFlag: true },
        { q: 28, sectionId: 'C', type: 'CASE_BASED', marks: 4, internalChoice: false, competencyFlag: true },
      ],
    },
    {
      id: 'D',
      title: 'SECTION D — ECONOMICS (20 Marks)',
      note: 'Questions 29 to 38 (6 MCQs, 0 VSA, 3 SA, 1 LA, 0 Case).',
      slots: [
        { q: 29, sectionId: 'D', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 30, sectionId: 'D', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 31, sectionId: 'D', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 32, sectionId: 'D', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 33, sectionId: 'D', type: 'MCQ', marks: 1, internalChoice: false, competencyFlag: false },
        { q: 34, sectionId: 'D', type: 'ASSERTION_REASON', marks: 1, internalChoice: false, competencyFlag: true },
        { q: 35, sectionId: 'D', type: 'SHORT', marks: 3, internalChoice: true, competencyFlag: true },
        { q: 36, sectionId: 'D', type: 'SHORT', marks: 3, internalChoice: false, competencyFlag: true },
        { q: 37, sectionId: 'D', type: 'SHORT', marks: 3, internalChoice: false, competencyFlag: false },
        { q: 38, sectionId: 'D', type: 'LONG', marks: 5, internalChoice: true, competencyFlag: true },
      ],
    },
  ],
  chapter_weightage: {
    'The Rise of Nationalism in Europe': 6,
    'Nationalism in India': 7,
    'The Making of a Global World': 3,
    'The Age of Industrialisation': 2,
    'Print Culture and the Modern World': 2,
    'Resources and Development': 4,
    'Water Resources': 3,
    'Agriculture': 5,
    'Minerals and Energy Resources': 4,
    'Manufacturing Industries': 4,
    'Power-sharing': 4,
    'Federalism': 4,
    'Gender, Religion and Caste': 4,
    'Political Parties': 5,
    'Outcomes of Democracy': 3,
    'Development': 4,
    'Sectors of the Indian Economy': 5,
    'Money and Credit': 6,
    'Globalisation and the Indian Economy': 5,
  },
  competency_min_pct: 50,
};

// 5. ENGLISH LANGUAGE & LITERATURE 184 (11 questions, 80 marks)
export const BLUEPRINT_184: Blueprint = {
  subject_code: '184',
  subject_name: 'English Language and Literature',
  session: '2026-27',
  max_marks: 80,
  duration_min: 180,
  general_instructions: [
    'The question paper comprises three sections: Section A (Reading Skills - 20 marks), Section B (Writing Skills with Grammar - 20 marks), Section C (Language through Literature - 40 marks).',
    'Attempt questions based on specific instructions for each part.',
    'Do not exceed the prescribed word limit while answering the questions.',
  ],
  sections: [
    {
      id: 'A',
      title: 'SECTION A — READING SKILLS (20 Marks)',
      note: '2 Unseen Passages of 10 marks each.',
      slots: [
        { q: 1, sectionId: 'A', type: 'CASE_BASED', marks: 10, internalChoice: false, competencyFlag: true, hint: 'Discursive passage with 10 sub-questions' },
        { q: 2, sectionId: 'A', type: 'CASE_BASED', marks: 10, internalChoice: false, competencyFlag: true, hint: 'Case-based factual passage with data chart and 10 sub-questions' },
      ],
    },
    {
      id: 'B',
      title: 'SECTION B — WRITING SKILLS & GRAMMAR (20 Marks)',
      note: 'Grammar (10 marks) and Writing Skills (10 marks).',
      slots: [
        { q: 3, sectionId: 'B', type: 'SHORT', marks: 10, internalChoice: true, competencyFlag: true, hint: 'Grammar: Attempt any 10 of 12 items' },
        { q: 4, sectionId: 'B', type: 'LONG', marks: 5, internalChoice: true, competencyFlag: true, hint: 'Formal Letter (Complaint/Enquiry/Order/Letter to Editor) in 100-120 words' },
        { q: 5, sectionId: 'B', type: 'LONG', marks: 5, internalChoice: true, competencyFlag: true, hint: 'Analytical Paragraph based on chart/graph/map/cues in 100-120 words' },
      ],
    },
    {
      id: 'C',
      title: 'SECTION C — LITERATURE (40 Marks)',
      note: 'Textbook extracts, short answers and long answer questions.',
      slots: [
        { q: 6, sectionId: 'C', type: 'CASE_BASED', marks: 5, internalChoice: true, competencyFlag: true, hint: 'Extract from First Flight (Prose/Play) with 5 sub-questions' },
        { q: 7, sectionId: 'C', type: 'CASE_BASED', marks: 5, internalChoice: true, competencyFlag: true, hint: 'Extract from First Flight (Poem) with 5 sub-questions' },
        { q: 8, sectionId: 'C', type: 'LONG', marks: 12, internalChoice: false, competencyFlag: true, hint: 'Four Short Answer questions from First Flight (4 x 3 marks = 12 marks, 40-50 words each)' },
        { q: 9, sectionId: 'C', type: 'SHORT', marks: 6, internalChoice: false, competencyFlag: true, hint: 'Two Short Answer questions from Footprints without Feet (2 x 3 marks = 6 marks, 40-50 words each)' },
        { q: 10, sectionId: 'C', type: 'LONG', marks: 6, internalChoice: true, competencyFlag: true, hint: 'One Long Answer question from First Flight (100-120 words)' },
        { q: 11, sectionId: 'C', type: 'LONG', marks: 6, internalChoice: true, competencyFlag: true, hint: 'One Long Answer question from Footprints without Feet (100-120 words)' },
      ],
    },
  ],
  chapter_weightage: {
    'Discursive passage': 10,
    'Case-based factual passage': 10,
    'Grammar': 10,
    'Writing Skills': 10,
    'First Flight': 26,
    'Footprints without Feet': 14,
  },
  competency_min_pct: 55,
};

// 6. ENGLISH COMMUNICATIVE 101 (12 questions, 80 marks)
export const BLUEPRINT_101: Blueprint = {
  subject_code: '101',
  subject_name: 'English Communicative',
  session: '2026-27',
  max_marks: 80,
  duration_min: 180,
  general_instructions: [
    'The question paper comprises four sections: Section A (Reading - 22 marks), Section B (Writing - 22 marks), Section C (Grammar - 10 marks), Section D (Literature - 26 marks).',
    'All questions are compulsory with internal choices provided.',
  ],
  sections: [
    {
      id: 'A',
      title: 'SECTION A — READING (22 Marks)',
      note: '2 Unseen reading passages.',
      slots: [
        { q: 1, sectionId: 'A', type: 'CASE_BASED', marks: 12, internalChoice: false, competencyFlag: true },
        { q: 2, sectionId: 'A', type: 'CASE_BASED', marks: 10, internalChoice: false, competencyFlag: true },
      ],
    },
    {
      id: 'B',
      title: 'SECTION B — WRITING (22 Marks)',
      note: 'Application, Factual description, Letter to editor, Article.',
      slots: [
        { q: 3, sectionId: 'B', type: 'SHORT', marks: 3, internalChoice: true, competencyFlag: true },
        { q: 4, sectionId: 'B', type: 'SHORT', marks: 4, internalChoice: true, competencyFlag: true },
        { q: 5, sectionId: 'B', type: 'LONG', marks: 7, internalChoice: true, competencyFlag: true },
        { q: 6, sectionId: 'B', type: 'LONG', marks: 8, internalChoice: true, competencyFlag: true },
      ],
    },
    {
      id: 'C',
      title: 'SECTION C — GRAMMAR (10 Marks)',
      note: 'Gap filling, Omission, Do as directed.',
      slots: [
        { q: 7, sectionId: 'C', type: 'SHORT', marks: 3, internalChoice: false, competencyFlag: true },
        { q: 8, sectionId: 'C', type: 'SHORT', marks: 4, internalChoice: false, competencyFlag: true },
        { q: 9, sectionId: 'C', type: 'SHORT', marks: 3, internalChoice: false, competencyFlag: true },
      ],
    },
    {
      id: 'D',
      title: 'SECTION D — LITERATURE (26 Marks)',
      note: 'Extracts, Short Answers, Long Answer.',
      slots: [
        { q: 10, sectionId: 'D', type: 'CASE_BASED', marks: 8, internalChoice: true, competencyFlag: true },
        { q: 11, sectionId: 'D', type: 'SHORT', marks: 10, internalChoice: false, competencyFlag: true },
        { q: 12, sectionId: 'D', type: 'LONG', marks: 8, internalChoice: true, competencyFlag: true },
      ],
    },
  ],
  chapter_weightage: {
    Reading: 22,
    Writing: 22,
    Grammar: 10,
    Literature: 26,
  },
  competency_min_pct: 50,
};

export const BLUEPRINTS: Record<string, Blueprint> = {
  '041': BLUEPRINT_041,
  '241': BLUEPRINT_241,
  '086': BLUEPRINT_086,
  '087': BLUEPRINT_087,
  '184': BLUEPRINT_184,
  '101': BLUEPRINT_101,
};
