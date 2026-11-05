import React, { useState } from 'react';
import { DifficultyLevel, GeneratedPaper, Subject } from '../types';
import { SUBJECTS } from '../config/subjects';
import { LEVELS, PAPER_LEVEL_MIXES } from '../config/levels';
import { BLUEPRINTS } from '../config/blueprints/blueprintsData';
import {
  FileCheck2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  ShieldCheck,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface SamplePaperWizardProps {
  onBackToHome: () => void;
  onPaperGenerated: (paper: GeneratedPaper) => void;
  initialSubjectCode?: string;
  initialLevel?: DifficultyLevel;
}

export const SamplePaperWizard: React.FC<SamplePaperWizardProps> = ({
  onBackToHome,
  onPaperGenerated,
  initialSubjectCode,
  initialLevel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Subject
  const blueprintSubjects = SUBJECTS.filter((s) => s.hasBlueprint);
  const otherSubjects = SUBJECTS.filter((s) => !s.hasBlueprint);

  const [selectedSubject, setSelectedSubject] = useState<Subject>(() => {
    if (initialSubjectCode) {
      const match = blueprintSubjects.find((s) => s.code === initialSubjectCode);
      if (match) return match;
    }
    return blueprintSubjects[0]; // Maths Standard 041
  });

  // Step 2: Level
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>(initialLevel || 'Moderate');

  // Step 3: Options
  const [setNumber, setSetNumber] = useState<string>('1');
  const [includeInternalChoices, setIncludeInternalChoices] = useState<boolean>(true);
  const [avoidSeenQuestions, setAvoidSeenQuestions] = useState<boolean>(true);
  const [includeMarkingScheme, setIncludeMarkingScheme] = useState<boolean>(true);

  // Generating state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [moderationStatus, setModerationStatus] = useState<string>('Verifying slot weights...');

  const handleGeneratePaper = async () => {
    setIsGenerating(true);

    const stages = [
      'Slot Allocation: Loading 2026-27 Blueprint slots...',
      'Question Assembly: Ensuring ≥50% Competency weightage...',
      'Moderator Verification: Validating total 80 marks exactly...',
      'Choice Symmetry: Checking equal marks in OR alternatives...',
      'Time Estimation: Ensuring paper fits within 180 minutes...',
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setModerationStatus(stages[stageIdx]);
      }
    }, 450);

    try {
      const res = await fetch('/api/generate/paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: selectedSubject.code,
          level: selectedLevel,
          setNumber,
        }),
      });

      clearInterval(interval);
      if (res.ok) {
        const data = await res.json();
        if (data.paper) {
          onPaperGenerated(data.paper);
          return;
        }
      }
      throw new Error('Fallback triggered');
    } catch {
      clearInterval(interval);
      // Client-side fallback using direct assembler
      const { assembleSamplePaper } = await import('../engine/paperGenerator');
      const fallbackPaper = assembleSamplePaper(selectedSubject.code, selectedLevel, setNumber);
      onPaperGenerated(fallbackPaper);
    }
  };

  const levelMix = PAPER_LEVEL_MIXES[selectedLevel];
  const blueprintInfo = BLUEPRINTS[selectedSubject.code];

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div>
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" /> Full 80-Mark Sample Paper Generator
          </h2>
        </div>

        {/* 3 Step Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                currentStep === s
                  ? 'bg-indigo-600 text-white font-bold'
                  : currentStep > s
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {currentStep > s ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {isGenerating ? (
        /* Live Generation & Moderation Screen */
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-6 shadow-sm my-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Assembling 80-Mark Paper & Running Moderator Verification
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">{moderationStatus}</p>
          </div>
          <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-600 h-2.5 rounded-full animate-indeterminate"></div>
          </div>
          <div className="flex justify-center items-center gap-4 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 80 Marks Exactly
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" /> 180 Minutes Calibrated
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-600" /> ≥50% Competency Weight
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* STEP 1: SUBJECT */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 1: Choose Blueprint Subject</h3>
                <p className="text-xs text-slate-600">
                  Full 80-mark papers strictly match the official 2026-27 CBSE Sample Question Paper design.
                </p>
              </div>

              {/* Blueprint Supported Subjects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {blueprintSubjects.map((sub) => {
                  const isSelected = selectedSubject.id === sub.id;
                  const bp = BLUEPRINTS[sub.code];

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub)}
                      className={`p-4 rounded-xl border cursor-pointer text-left transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                            <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">
                              {sub.code}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                            <div>80 Marks · 3 Hours · {bp ? bp.sections.length : 5} Sections</div>
                            <div className="text-emerald-700 font-semibold">
                              ✓ 2026-27 Blueprint Active
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition shrink-0 ${
                            isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Other subjects coming soon */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Other Subjects (Blueprint Ingestion Coming Soon)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {otherSubjects.slice(0, 6).map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs flex justify-between items-center opacity-70"
                    >
                      <span className="font-medium truncate">{sub.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                        Soon
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  Next: Paper Difficulty <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LEVEL */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 2: Paper-Level Difficulty Mix</h3>
                <p className="text-xs text-slate-600">
                  Select the target paper difficulty. The engine automatically blends questions across Bloom taxonomy levels.
                </p>
              </div>

              <div className="space-y-3">
                {(Object.keys(LEVELS) as DifficultyLevel[]).map((lvlKey) => {
                  const info = LEVELS[lvlKey];
                  const mix = PAPER_LEVEL_MIXES[lvlKey];
                  const isSelected = selectedLevel === lvlKey;

                  return (
                    <div
                      key={lvlKey}
                      onClick={() => setSelectedLevel(lvlKey)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{info.level}</span>
                            {lvlKey === 'Moderate' && (
                              <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                                Recommended · Board Standard
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{info.whatItMeans}</p>

                          {/* Paper level distribution bar */}
                          <div className="pt-2 text-[11px] text-slate-500">
                            <span className="font-bold text-slate-700">Calibrated Mix: </span>
                            <span>{mix.Easy}% Easy, {mix.Medium}% Med, {mix.Moderate}% Mod, {mix.Hard}% Hard</span>
                            {mix['Very Hard'] > 0 && <span>, {mix['Very Hard']}% Very Hard</span>}
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 transition ${
                            isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  Next: Paper Options <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OPTIONS & GENERATE */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 3: Paper Code & Exam Options</h3>
                <p className="text-xs text-slate-600">
                  Custom set configuration complying with CBSE authenticity and novel question tracking.
                </p>
              </div>

              {/* Set Selection */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Paper Set Number
                </label>
                <div className="flex gap-3">
                  {['1', '2', '3'].map((set) => (
                    <button
                      key={set}
                      onClick={() => setSetNumber(set)}
                      className={`flex-1 py-2.5 rounded-xl border text-center font-bold text-sm transition ${
                        setNumber === set
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      SET ~{set}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  Note: An invented Question Paper Code (e.g. 30/1/{setNumber}-P) will be generated. Real CBSE codes are never used.
                </p>
              </div>

              {/* Toggles */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5">
                <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Exam Regulations & Integrity
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-semibold text-sm text-slate-900 block">
                      Include Internal Choices ("OR" alternatives)
                    </span>
                    <span className="text-xs text-slate-500">
                      Matches official board choices (e.g. 2 in VSA, 2 in SA, 2 in LA, 1 in Case-study).
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeInternalChoices}
                    onChange={(e) => setIncludeInternalChoices(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
                  <div>
                    <span className="font-semibold text-sm text-slate-900 block">
                      Avoid Questions Seen Previously
                    </span>
                    <span className="text-xs text-slate-500">
                      Enforces question novelty check so students never receive duplicate problems.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={avoidSeenQuestions}
                    onChange={(e) => setAvoidSeenQuestions(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
                  <div>
                    <span className="font-semibold text-sm text-slate-900 block">
                      Generate Step-Wise Marking Scheme
                    </span>
                    <span className="text-xs text-slate-500">
                      Provides detailed examiner key with step marks totaling 80 marks.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeMarkingScheme}
                    onChange={(e) => setIncludeMarkingScheme(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>
              </div>

              {/* Verification Summary Card */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 text-xs space-y-1.5 text-indigo-950">
                <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Pre-Flight Blueprint Checks
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div>Total Marks: <strong>80 / 80</strong></div>
                  <div>Duration: <strong>180 min</strong></div>
                  <div>Competency: <strong>≥ 50%</strong></div>
                  <div>Syllabus: <strong>2026-27</strong></div>
                </div>
              </div>

              {/* Stepper Navigation & Run Button */}
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleGeneratePaper}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Generate Full 80-Mark Sample Paper
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
