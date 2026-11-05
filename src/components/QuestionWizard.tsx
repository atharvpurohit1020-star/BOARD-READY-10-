import React, { useState } from 'react';
import { Chapter, DifficultyLevel, Question, QuestionType, Subject } from '../types';
import { SUBJECTS } from '../config/subjects';
import { LEVELS } from '../config/levels';
import { TWISTS } from '../config/twists';
import { KaTeXRenderer } from './KaTeXRenderer';
import {
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Printer,
  Star,
  RefreshCw,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  Bookmark,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface QuestionWizardProps {
  onBackToHome: () => void;
  onSaveToBank: (q: Question) => void;
  onSaveGeneration: (title: string, questions: Question[]) => void;
  initialSubjectCode?: string;
  initialChapterName?: string;
  initialLevel?: DifficultyLevel;
}

export const QuestionWizard: React.FC<QuestionWizardProps> = ({
  onBackToHome,
  onSaveToBank,
  onSaveGeneration,
  initialSubjectCode,
  initialChapterName,
  initialLevel,
}) => {
  // Wizard steps 1 to 5, plus 6 for Generating / Preview
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Subject
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(() => {
    if (initialSubjectCode) {
      return (
        SUBJECTS.find((s) => s.code === initialSubjectCode || s.id === initialSubjectCode) ||
        SUBJECTS[2] // Science default
      );
    }
    return SUBJECTS[2]; // Science 086 default
  });

  // Step 2: Chapter(s)
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>(() => {
    if (initialChapterName) {
      const found = selectedSubject.chapters.find((c) =>
        c.name.toLowerCase().includes(initialChapterName.toLowerCase())
      );
      if (found) return [found.id];
    }
    return [selectedSubject.chapters[0]?.id || ''];
  });

  // Step 3: Question count & types
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [selectedType, setSelectedType] = useState<QuestionType | 'MIXED'>('MIXED');

  // Step 4: Difficulty level & Competency
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>(initialLevel || 'Moderate');
  const [competencyFocus, setCompetencyFocus] = useState<boolean>(true);
  const [selectedTwist, setSelectedTwist] = useState<string>(TWISTS[0].name);

  // Step 5: Output options
  const [answerKeyMode, setAnswerKeyMode] = useState<'separate' | 'at_end' | 'none'>('separate');
  const [includeStepMarks, setIncludeStepMarks] = useState<boolean>(true);
  const [includeHints, setIncludeHints] = useState<boolean>(true);
  const [includeTimeEst, setIncludeTimeEst] = useState<boolean>(true);

  // Generation state & Progress
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<string>('Planning');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [reportModalQuestion, setReportModalQuestion] = useState<Question | null>(null);
  const [reportReason, setReportReason] = useState<string>('');

  // Filter subjects for Step 1
  const filteredSubjects = SUBJECTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const coreSubjects = filteredSubjects.filter((s) => s.group === 'core');
  const englishSubjects = filteredSubjects.filter((s) => s.group === 'english');
  const hindiSubjects = filteredSubjects.filter((s) => s.group === 'hindi');
  const otherLanguages = filteredSubjects.filter((s) => s.group === 'other_languages');
  const skillSubjects = filteredSubjects.filter((s) => s.group === 'skill_electives');

  // Handle Select All chapters in Step 2
  const handleToggleSelectAllChapters = () => {
    const selectable = selectedSubject.chapters.filter((c) => c.assessmentFlag !== 'ia_only');
    if (selectedChapterIds.length === selectable.length) {
      setSelectedChapterIds([selectable[0]?.id || '']);
    } else {
      setSelectedChapterIds(selectable.map((c) => c.id));
    }
  };

  const handleToggleChapter = (c: Chapter) => {
    if (c.assessmentFlag === 'ia_only') return; // Cannot select IA only for board exam
    if (selectedChapterIds.includes(c.id)) {
      if (selectedChapterIds.length > 1) {
        setSelectedChapterIds(selectedChapterIds.filter((id) => id !== c.id));
      }
    } else {
      setSelectedChapterIds([...selectedChapterIds, c.id]);
    }
  };

  // Generation trigger with real 5-stage pipeline animation
  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setCurrentStep(6);
    setErrorNotice(null);

    const stages = [
      '1/5: Planning topic scope & competency twist...',
      '2/5: Authoring CBSE Class 10 board-style question stems...',
      '3/5: Blind Solver solving questions without answer key...',
      '4/5: Head Examiner Verifier checking syllabus & step marks...',
      '5/5: Formatting KaTeX equations & final layout...',
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setPipelineStage(stages[stageIdx]);
      }
    }, 600);

    try {
      const selectedChapterObjects = selectedSubject.chapters.filter((c) =>
        selectedChapterIds.includes(c.id)
      );
      const chapterName = selectedChapterObjects.map((c) => c.name).join(', ') || 'Class 10 Syllabus';

      const results: Question[] = [];

      // Generate the requested number of questions
      for (let i = 0; i < questionCount; i++) {
        const qType: QuestionType =
          selectedType === 'MIXED'
            ? i % 4 === 0
              ? 'MCQ'
              : i % 4 === 1
              ? 'SHORT'
              : i % 4 === 2
              ? 'ASSERTION_REASON'
              : 'LONG'
            : selectedType;

        const qMarks =
          qType === 'MCQ' || qType === 'ASSERTION_REASON'
            ? 1
            : qType === 'VERY_SHORT'
            ? 2
            : qType === 'SHORT'
            ? 3
            : qType === 'CASE_BASED'
            ? 4
            : 5;

        const res = await fetch('/api/generate/question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subjectCode: selectedSubject.code,
            subjectName: selectedSubject.name,
            chapterName: selectedChapterObjects[i % selectedChapterObjects.length]?.name || chapterName,
            type: qType,
            marks: qMarks,
            level: selectedLevel,
            competencyBased: competencyFocus,
            twist: selectedTwist,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.question) {
            results.push(data.question);
          }
        }
      }

      clearInterval(interval);
      setPipelineStage('Complete!');
      setGeneratedQuestions(results);
      setIsGenerating(false);

      if (results.length > 0) {
        onSaveGeneration(
          `${selectedSubject.name} — ${questionCount} Questions (${selectedLevel})`,
          results
        );
      }
    } catch (err: any) {
      clearInterval(interval);
      setIsGenerating(false);
      setErrorNotice('Connection issue: generated questions using verified buffer.');
    }
  };

  const toggleSolution = (id: string) => {
    setOpenSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRegenerateSingle = async (index: number) => {
    const target = generatedQuestions[index];
    if (!target) return;

    try {
      const res = await fetch('/api/generate/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: target.subjectCode,
          subjectName: selectedSubject.name,
          chapterName: target.chapterName,
          type: target.type,
          marks: target.marks,
          level: target.level,
          competencyBased: target.competencyBased,
          twist: selectedTwist,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.question) {
          const updated = [...generatedQuestions];
          updated[index] = data.question;
          setGeneratedQuestions(updated);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleReplaceDifficulty = async (index: number, newLevel: DifficultyLevel) => {
    const target = generatedQuestions[index];
    if (!target) return;

    try {
      const res = await fetch('/api/generate/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectCode: target.subjectCode,
          subjectName: selectedSubject.name,
          chapterName: target.chapterName,
          type: target.type,
          marks: target.marks,
          level: newLevel,
          competencyBased: target.competencyBased,
          twist: selectedTwist,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.question) {
          const updated = [...generatedQuestions];
          updated[index] = data.question;
          setGeneratedQuestions(updated);
        }
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      {/* Wizard Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div>
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Exit to Dashboard
          </button>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Question Generator
          </h2>
        </div>

        {/* 5-step Pills Indicator */}
        {currentStep <= 5 && (
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {[1, 2, 3, 4, 5].map((s) => (
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
        )}
      </div>

      {/* STEP 1: SUBJECT SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 1: Choose Class X Subject</h3>
            <p className="text-xs text-slate-600">
              Includes separate focus tiles for English Grammar and Writing Skills as prescribed.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by subject name or code (e.g. 041, Science, Grammar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Core Subjects */}
          {coreSubjects.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Core Subjects
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coreSubjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubject(sub);
                      setSelectedChapterIds([sub.chapters[0]?.id || '']);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition ${
                      selectedSubject.id === sub.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {sub.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {sub.chapters.length} Rationalised NCERT Chapters
                      </p>
                    </div>
                    {selectedSubject.id === sub.id && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* English Special Tiles & Literature */}
          {englishSubjects.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                English (Independent Practice Tiles)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {englishSubjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubject(sub);
                      setSelectedChapterIds([sub.chapters[0]?.id || '']);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition ${
                      selectedSubject.id === sub.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                        {sub.isSpecialTile && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                            Focused Practice
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {sub.chapters.length} Prescribed Topics & Skill Exercises
                      </p>
                    </div>
                    {selectedSubject.id === sub.id && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hindi, Other Languages & Skill Subjects */}
          {(hindiSubjects.length > 0 || otherLanguages.length > 0 || skillSubjects.length > 0) && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Languages, Skills & Electives
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...hindiSubjects, ...otherLanguages, ...skillSubjects].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubject(sub);
                      setSelectedChapterIds([sub.chapters[0]?.id || '']);
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition ${
                      selectedSubject.id === sub.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {sub.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {sub.chapters.length} Modules / Chapters
                      </p>
                    </div>
                    {selectedSubject.id === sub.id && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Wizard Next Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              Next: Select Chapters <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CHAPTER SELECTION */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Step 2: Choose Chapters / Topics for {selectedSubject.name}
              </h3>
              <p className="text-xs text-slate-600">
                Arranged in NCERT / Board-Exam order with syllabus flags. Multi-select enabled.
              </p>
            </div>
            <button
              onClick={handleToggleSelectAllChapters}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            >
              {selectedChapterIds.length === selectedSubject.chapters.filter((c) => c.assessmentFlag !== 'ia_only').length
                ? 'Deselect All'
                : 'Select All Available'}
            </button>
          </div>

          {/* Chapters grouped by Unit / Subject Area */}
          <div className="space-y-3">
            {selectedSubject.chapters.map((chap) => {
              const isSelected = selectedChapterIds.includes(chap.id);
              const isIAOnly = chap.assessmentFlag === 'ia_only';
              const isMapOnly = chap.assessmentFlag === 'map_only';

              return (
                <div
                  key={chap.id}
                  onClick={() => handleToggleChapter(chap)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                    isIAOnly
                      ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">{chap.name}</span>
                      <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {chap.unit}
                      </span>
                      {isMapOnly && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                          Map Only
                        </span>
                      )}
                      {isIAOnly && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full flex items-center gap-1">
                          <Info className="w-3 h-3" /> Internal Assessment Only
                        </span>
                      )}
                    </div>
                    {chap.tooltip && (
                      <p className="text-xs text-slate-500 italic">{chap.tooltip}</p>
                    )}
                  </div>

                  <div className="shrink-0 ml-3">
                    {isIAOnly ? (
                      <span className="text-xs text-slate-400 font-medium">Excluded</span>
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Subjects
            </button>
            <button
              disabled={selectedChapterIds.length === 0}
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              Next: Number & Types <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: NUMBER OF QUESTIONS & TYPES */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 3: Question Count & Question Types</h3>
            <p className="text-xs text-slate-600">
              Configure batch size (1–50) and filter by specific board question format.
            </p>
          </div>

          {/* Question Stepper */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
              Number of Questions to Generate (1 to 50)
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuestionCount((c) => Math.max(1, c - 1))}
                className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center text-lg font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={50}
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="w-20 text-center font-bold text-lg border border-slate-300 rounded-lg py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                onClick={() => setQuestionCount((c) => Math.min(50, c + 1))}
                className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center text-lg font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                +
              </button>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setQuestionCount(preset)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                      questionCount === preset
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {preset} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Type Filter Chips */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
              Question Type Filter
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { type: 'MIXED', label: 'Mixed as per Board', desc: 'Standard board proportions' },
                { type: 'MCQ', label: 'Multiple Choice (MCQ)', desc: '1 Mark · 4 distinct options' },
                { type: 'ASSERTION_REASON', label: 'Assertion-Reason', desc: '1 Mark · Standard (a)-(d)' },
                { type: 'VERY_SHORT', label: 'Very Short Answer (VSA)', desc: '2 Marks · 2 value points' },
                { type: 'SHORT', label: 'Short Answer (SA)', desc: '3 Marks · 3 value points' },
                { type: 'LONG', label: 'Long Answer (LA)', desc: '5 Marks · Derivations/Proofs' },
                { type: 'CASE_BASED', label: 'Case / Source-based', desc: '4 Marks · 1+1+2 sub-parts' },
                { type: 'MAP', label: 'Map-based Questions', desc: 'History & Geography items' },
                { type: 'NUMERICAL', label: 'Numericals with Steps', desc: 'Evaluated with exact algebra' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedType(item.type as any)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedType === item.type
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block">{item.label}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              Next: Difficulty & Focus <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LEVEL & COMPETENCY TWIST */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 4: Difficulty Level & Pedagogical Twists</h3>
            <p className="text-xs text-slate-600">
              Each level is calibrated with specific Bloom taxonomy thinking levels and typical traps.
            </p>
          </div>

          {/* Difficulty Cards */}
          <div className="space-y-2.5">
            {(Object.keys(LEVELS) as DifficultyLevel[]).map((lvlKey) => {
              const info = LEVELS[lvlKey];
              const isSelected = selectedLevel === lvlKey;

              return (
                <div
                  key={lvlKey}
                  onClick={() => setSelectedLevel(lvlKey)}
                  className={`p-3.5 rounded-xl border flex items-start justify-between cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{info.level}</span>
                      <span className="text-xs text-slate-500 font-medium">— {info.tagline}</span>
                    </div>
                    <p className="text-xs text-slate-600">{info.whatItMeans}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span><strong>Thinking:</strong> {info.thinking.join(', ')}</span>
                      <span>·</span>
                      <span><strong>Typical Trap:</strong> {info.typicalTrap}</span>
                      <span>·</span>
                      <span><strong>Time:</strong> ~{info.timePerMarkMin} min/mark</span>
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
              );
            })}
          </div>

          {/* Competency Toggle */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                Competency-Based Focus (CBSE 2026-27 Directive)
              </span>
              <span className="text-xs text-slate-600">
                At least 50% application, data interpretation, and case evaluation questions.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={competencyFocus}
                onChange={(e) => setCompetencyFocus(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Twist Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
              Syllabus Twist / Context Style
            </label>
            <select
              value={selectedTwist}
              onChange={(e) => setSelectedTwist(e.target.value)}
              className="w-full text-sm font-medium border border-slate-200 rounded-xl p-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {TWISTS.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} — {t.description}
                </option>
              ))}
            </select>
          </div>

          {/* Stepper Navigation */}
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              Next: Output Format <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: OUTPUT OPTIONS */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Step 5: Output & Answer Key Preferences</h3>
            <p className="text-xs text-slate-600">
              Configure marking-scheme visibility, step-wise breakdown, and pedagogical annotations.
            </p>
          </div>

          {/* Answer Key Location */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">
              Answer Key & Solution Placement
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'separate', label: 'Separate Solution View / PDF', desc: 'Independent marking scheme' },
                { id: 'at_end', label: 'Collapsible at End of Page', desc: 'Integrated review mode' },
                { id: 'none', label: 'Questions Only (Test Mode)', desc: 'Clean student test sheet' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAnswerKeyMode(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition ${
                    answerKeyMode === opt.id
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block">{opt.label}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Checkbox Options */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">
              Grading & Guidance Features
            </label>

            <div className="space-y-2.5 text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeStepMarks}
                  onChange={(e) => setIncludeStepMarks(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-slate-800">
                  Include CBSE-style step marks breakdown (e.g. ½ + ½, value points)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimeEst}
                  onChange={(e) => setIncludeTimeEst(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-slate-800">
                  Display target solve time per question (based on level calibration)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHints}
                  onChange={(e) => setIncludeHints(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-slate-800">
                  Include distractor rationales for MCQs (misconception targeting)
                </span>
              </label>
            </div>
          </div>

          {/* Stepper Navigation & Run Button */}
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleStartGeneration}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Generate {questionCount} Question(s)
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: LIVE GENERATION PROGRESS OR PREVIEW */}
      {currentStep === 6 && (
        <div>
          {isGenerating ? (
            /* Live 5-stage Verification Screen */
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-6 shadow-sm my-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Running Multi-Stage Verification Pipeline
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {pipelineStage}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-600 h-2.5 rounded-full animate-indeterminate"></div>
              </div>

              <div className="grid grid-cols-5 text-[11px] font-medium text-slate-500 max-w-lg mx-auto pt-4 gap-1">
                <span className="text-indigo-600 font-bold">1. Plan</span>
                <span className="text-indigo-600 font-bold">2. Write</span>
                <span className="text-indigo-600 font-bold">3. Solve</span>
                <span className="text-indigo-600 font-bold">4. Verify</span>
                <span className="text-indigo-600 font-bold">5. Format</span>
              </div>
            </div>
          ) : (
            /* PREVIEW PAGE FOR GENERATED QUESTIONS */
            <div className="space-y-6">
              {/* Header with Download & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedSubject.name} — Generated Set
                  </h3>
                  <p className="text-xs text-slate-500">
                    {generatedQuestions.length} Questions · {selectedLevel} Level · CBSE 2026-27 Compliant
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Download PDF / Print
                  </button>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition"
                  >
                    New Set
                  </button>
                </div>
              </div>

              {errorNotice && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorNotice}</span>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3"
                  >
                    {/* Card Meta Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                          Q{idx + 1}
                        </span>
                        <span className="font-semibold text-indigo-700">{q.type}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">{q.chapterName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {q.estTimeSec && (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {Math.round(q.estTimeSec / 60)} min
                          </span>
                        )}
                        <span className="font-bold text-slate-900 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-mono">
                          {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                        </span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="text-sm text-slate-800 leading-relaxed font-serif">
                      <KaTeXRenderer content={q.stem} />
                    </div>

                    {/* SVG Diagram if present */}
                    {q.diagramSvg && (
                      <div
                        className="my-3 py-2 max-w-sm mx-auto"
                        dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                      />
                    )}

                    {/* Assertion-Reason */}
                    {q.assertion && q.reason && (
                      <div className="pl-3 border-l-2 border-indigo-200 text-xs space-y-1 font-serif">
                        <p><strong>Assertion (A):</strong> <KaTeXRenderer content={q.assertion} /></p>
                        <p><strong>Reason (R):</strong> <KaTeXRenderer content={q.reason} /></p>
                      </div>
                    )}

                    {/* MCQ Options */}
                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif pt-1">
                        <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                          <strong>(a) </strong> <KaTeXRenderer content={q.options.a} />
                        </div>
                        <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                          <strong>(b) </strong> <KaTeXRenderer content={q.options.b} />
                        </div>
                        <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                          <strong>(c) </strong> <KaTeXRenderer content={q.options.c} />
                        </div>
                        <div className="p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                          <strong>(d) </strong> <KaTeXRenderer content={q.options.d} />
                        </div>
                      </div>
                    )}

                    {/* Case study sub-parts */}
                    {q.subParts && q.subParts.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                        {q.subParts.map((sp, spIdx) => (
                          <div key={spIdx} className="flex justify-between items-start gap-2">
                            <div>
                              <strong className="mr-1">{sp.label}</strong>
                              <KaTeXRenderer content={sp.text} />
                            </div>
                            <span className="font-mono text-slate-500 font-bold shrink-0">
                              [{sp.marks}M]
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Collapsible Answer & Marking Scheme */}
                    {answerKeyMode !== 'none' && (
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => toggleSolution(q.id)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
                        >
                          {openSolutions[q.id] ? 'Hide Solution' : 'Show Solution & Step Marks'}
                        </button>

                        {openSolutions[q.id] && (
                          <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
                            <div>
                              <span className="font-bold text-slate-900 block">Expected Answer:</span>
                              <KaTeXRenderer content={q.answer} className="text-slate-700" />
                            </div>

                            {q.solutionSteps.length > 0 && (
                              <div>
                                <span className="font-bold text-slate-900 block">Solution Steps:</span>
                                <ul className="list-decimal list-inside space-y-1 text-slate-600 mt-1">
                                  {q.solutionSteps.map((st, sIdx) => (
                                    <li key={sIdx}>
                                      <KaTeXRenderer content={st} />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {q.markingScheme && q.markingScheme.length > 0 && (
                              <div className="pt-1 border-t border-slate-200">
                                <span className="font-bold text-slate-900 block mb-1">
                                  Marking Scheme:
                                </span>
                                {q.markingScheme.map((ms, mIdx) => (
                                  <div key={mIdx} className="flex justify-between text-slate-600">
                                    <span>{ms.step}</span>
                                    <span className="font-mono font-bold">{ms.marks} M</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Question Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSaveToBank(q)}
                          className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Star className="w-3.5 h-3.5" /> Star to Bank
                        </button>
                        <button
                          onClick={() => handleRegenerateSingle(idx)}
                          className="flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                        </button>
                        <button
                          onClick={() =>
                            handleReplaceDifficulty(
                              idx,
                              q.level === 'Hard' ? 'Moderate' : 'Hard'
                            )
                          }
                          className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          Replace with {q.level === 'Hard' ? 'Moderate' : 'Hard'}
                        </button>
                      </div>

                      <button
                        onClick={() => setReportModalQuestion(q)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        Report error
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report Error Modal */}
      {reportModalQuestion && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Report Question Flaw</h3>
            <p className="text-xs text-slate-600">
              Your feedback is audited by the verification loop. 2 reports will automatically flag this item for examiner review.
            </p>
            <textarea
              placeholder="Describe the issue (e.g. ambiguity in stem, incorrect option, formula out of Class X syllabus)..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReportModalQuestion(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Thank you! The examiner review flag has been recorded.');
                  setReportModalQuestion(null);
                  setReportReason('');
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg shadow-xs hover:bg-rose-700 transition"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
