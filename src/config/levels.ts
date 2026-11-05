import { DifficultyLevel } from '../types';

export interface LevelInfo {
  level: DifficultyLevel;
  tagline: string;
  whatItMeans: string;
  thinking: string[];
  typicalTrap: string;
  timePerMarkMin: number;
}

export interface PaperMix {
  level: DifficultyLevel;
  distribution: {
    Easy: number;
    Medium: number;
    Moderate: number;
    Hard: number;
    'Very Hard': number;
  };
}

export const LEVELS: Record<DifficultyLevel, LevelInfo> = {
  Easy: {
    level: 'Easy',
    tagline: 'Direct NCERT Recall & 1-Step Application',
    whatItMeans: 'Direct NCERT recall or one-step use of a standard formula or definition.',
    thinking: ['Remember', 'Understand'],
    typicalTrap: 'None / Straightforward direct questions',
    timePerMarkMin: 1.0,
  },
  Medium: {
    level: 'Medium',
    tagline: 'NCERT In-text & Exercise Standard',
    whatItMeans: 'NCERT in-text / exercise level, 2–3 computational steps, familiar context.',
    thinking: ['Understand', 'Apply'],
    typicalTrap: 'One common slip (units, negative signs, decimal points)',
    timePerMarkMin: 1.5,
  },
  Moderate: {
    level: 'Moderate',
    tagline: 'CBSE Sample Paper & NCERT Exemplar standard',
    whatItMeans: 'NCERT Exemplar / CBSE SQP benchmark; unfamiliar context combining two core concepts.',
    thinking: ['Apply', 'Analyse'],
    typicalTrap: 'Distractors built from genuine student misconceptions',
    timePerMarkMin: 2.0,
  },
  Hard: {
    level: 'Hard',
    tagline: 'Board Toughest 10% — Multi-concept & Data Interpretation',
    whatItMeans: 'Board top 10% difficulty; multi-concept synthesis, case/data interpretation, careful reading required.',
    thinking: ['Analyse', 'Evaluate'],
    typicalTrap: 'Hidden boundary condition, extraneous data, near-miss options',
    timePerMarkMin: 2.5,
  },
  'Very Hard': {
    level: 'Very Hard',
    tagline: 'Olympiad-lite Strictly within CBSE Syllabus',
    whatItMeans: 'Olympiad-lite but strictly in syllabus; non-routine proofs, multi-layer logical chains, exhaustive case checking.',
    thinking: ['Evaluate', 'Create'],
    typicalTrap: 'Two-layer trap; answer only valid after testing all possible boundary conditions',
    timePerMarkMin: 3.2,
  },
};

export const PAPER_LEVEL_MIXES: Record<DifficultyLevel, PaperMix['distribution']> = {
  Easy: {
    Easy: 40,
    Medium: 35,
    Moderate: 20,
    Hard: 5,
    'Very Hard': 0,
  },
  Medium: {
    Easy: 25,
    Medium: 35,
    Moderate: 25,
    Hard: 15,
    'Very Hard': 0,
  },
  Moderate: {
    Easy: 20,
    Medium: 30,
    Moderate: 30,
    Hard: 15,
    'Very Hard': 5,
  },
  Hard: {
    Easy: 10,
    Medium: 20,
    Moderate: 30,
    Hard: 30,
    'Very Hard': 10,
  },
  'Very Hard': {
    Easy: 5,
    Medium: 10,
    Moderate: 25,
    Hard: 35,
    'Very Hard': 25,
  },
};
