export type QuestionType =
  | 'MCQ'
  | 'ASSERTION_REASON'
  | 'VERY_SHORT'
  | 'SHORT'
  | 'LONG'
  | 'CASE_BASED'
  | 'MAP'
  | 'DIAGRAM_BASED'
  | 'NUMERICAL';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Moderate' | 'Hard' | 'Very Hard';

export type SubjectGroup = 'core' | 'english' | 'hindi' | 'other_languages' | 'skill_electives';

export interface Chapter {
  id: string;
  name: string;
  unit: string;
  book?: string;
  order: number;
  weightMarks?: number;
  assessmentFlag?: 'board' | 'ia_only' | 'map_only';
  tooltip?: string;
  topics?: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  group: SubjectGroup;
  hasBlueprint: boolean;
  isSpecialTile?: boolean; // For English Grammar & Writing Skills
  parentSubjectCode?: string;
  chapters: Chapter[];
}

export interface QuestionSubPart {
  label: string; // e.g., "(i)", "(ii)", "(iii)"
  text: string;
  marks: number;
  solution?: string;
}

export interface MarkingSchemeItem {
  step: string;
  marks: string; // e.g. "½", "1", "1½", "2"
}

export interface Question {
  id: string;
  subjectId: string;
  subjectCode: string;
  chapterId: string;
  chapterName: string;
  topicIds: string[];
  type: QuestionType;
  marks: number;
  level: DifficultyLevel;
  competencyBased: boolean;
  bloom: 'Remember' | 'Understand' | 'Apply' | 'Analyse' | 'Evaluate' | 'Create';
  stem: string;
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  } | null;
  assertion?: string | null;
  reason?: string | null;
  caseText?: string | null;
  subParts?: QuestionSubPart[] | null;
  orQuestion?: Question | null;
  diagramSvg?: string | null;
  answer: string;
  solutionSteps: string[];
  markingScheme: MarkingSchemeItem[];
  verifyExpr?: string | null;
  distractorRationale?: Record<string, string> | null;
  estTimeSec: number;
  wordLimit?: number | null;
  sourceStyle?: string;
  verified: boolean;
  verifierNotes?: string;
  modelUsed?: string;
  createdAt: string;
  isStarred?: boolean;
  reportsCount?: number;
}

export interface BlueprintSlot {
  q: number;
  sectionId: string;
  type: QuestionType;
  marks: number;
  internalChoice: boolean;
  chapterOrUnitHint?: string;
  hint?: string;
  competencyFlag?: boolean;
}

export interface BlueprintSection {
  id: string;
  title: string;
  note: string;
  slots: BlueprintSlot[];
}

export interface Blueprint {
  subject_code: string;
  subject_name: string;
  session: string;
  max_marks: number;
  duration_min: number;
  general_instructions: string[];
  sections: BlueprintSection[];
  chapter_weightage: Record<string, number>;
  competency_min_pct: number;
}

export interface GeneratedPaper {
  id: string;
  paperCode: string;
  series: string;
  setNumber: string;
  subjectCode: string;
  subjectName: string;
  session: string;
  level: DifficultyLevel;
  maxMarks: number;
  durationMin: number;
  generalInstructions: string[];
  sections: {
    id: string;
    title: string;
    note: string;
    questions: Question[];
  }[];
  totalMarks: number;
  competencyPct: number;
  createdAt: string;
  totalQuestions: number;
}

export interface GenerationHistoryItem {
  id: string;
  mode: 'questions' | 'paper';
  title: string;
  subjectName: string;
  subjectCode: string;
  countOrMarks: string;
  level: DifficultyLevel;
  createdAt: string;
  questions?: Question[];
  paper?: GeneratedPaper;
}

export interface UserQuota {
  papersRemaining: number;
  questionsRemaining: number;
  maxPapers: number;
  maxQuestions: number;
  resetTime: string;
}
