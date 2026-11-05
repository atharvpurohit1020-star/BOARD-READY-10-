import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileCheck2,
  Sparkles,
  Star,
  History,
  Settings as SettingsIcon,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
  MapPin,
  Clock,
  Printer,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Question, GeneratedPaper, GenerationHistoryItem, DifficultyLevel } from './types';
import { VERIFIED_QUESTIONS } from './data/questionBank';
import { QuestionWizard } from './components/QuestionWizard';
import { SamplePaperWizard } from './components/SamplePaperWizard';
import { BoardPaperView } from './components/BoardPaperView';
import { QuestionBankModal } from './components/QuestionBankModal';
import { HistoryModal } from './components/HistoryModal';
import { AcceptanceTestsModal } from './components/AcceptanceTestsModal';
import { SettingsModal } from './components/SettingsModal';
import { I18N, Language } from './utils/i18n';

export default function App() {
  // Navigation View: 'home' | 'question_wizard' | 'paper_wizard' | 'paper_view'
  const [currentView, setCurrentView] = useState<'home' | 'question_wizard' | 'paper_wizard' | 'paper_view'>('home');

  // Currently viewed paper (for board view)
  const [activePaper, setActivePaper] = useState<GeneratedPaper | null>(null);

  // Quick launch shortcuts
  const [wizardSubjectCode, setWizardSubjectCode] = useState<string | undefined>(undefined);
  const [wizardChapterName, setWizardChapterName] = useState<string | undefined>(undefined);
  const [wizardLevel, setWizardLevel] = useState<DifficultyLevel | undefined>(undefined);

  // Modals
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTestsOpen, setIsTestsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Preferences & i18n
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  // Question Bank (Starred items)
  const [bank, setBank] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('boardready_bank');
      if (saved) return JSON.parse(saved);
    } catch {}
    return VERIFIED_QUESTIONS.slice(0, 3);
  });

  // Generation History
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('boardready_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Daily quota state
  const [quota, setQuota] = useState<{ papersRemaining: number; questionsRemaining: number }>({
    papersRemaining: 5,
    questionsRemaining: 50,
  });

  useEffect(() => {
    fetch('/api/quota')
      .then((res) => res.json())
      .then((data) => {
        if (data.papersRemaining !== undefined) {
          setQuota({
            papersRemaining: data.papersRemaining,
            questionsRemaining: data.questionsRemaining,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveToBank = (q: Question) => {
    if (bank.some((item) => item.id === q.id)) return;
    const updated = [q, ...bank];
    setBank(updated);
    try {
      localStorage.setItem('boardready_bank', JSON.stringify(updated));
    } catch {}
  };

  const handleRemoveFromBank = (id: string) => {
    const updated = bank.filter((item) => item.id !== id);
    setBank(updated);
    try {
      localStorage.setItem('boardready_bank', JSON.stringify(updated));
    } catch {}
  };

  const handleSaveHistoryItem = (title: string, questions: Question[]) => {
    const item: GenerationHistoryItem = {
      id: `gen-${Date.now()}`,
      mode: 'questions',
      title,
      subjectName: questions[0]?.subjectCode || 'CBSE X',
      subjectCode: questions[0]?.subjectCode || '086',
      countOrMarks: `${questions.length} Questions`,
      level: questions[0]?.level || 'Moderate',
      createdAt: new Date().toISOString(),
      questions,
    };
    const updated = [item, ...history];
    setHistory(updated);
    try {
      localStorage.setItem('boardready_history', JSON.stringify(updated));
    } catch {}
  };

  const handlePaperGenerated = (paper: GeneratedPaper) => {
    setActivePaper(paper);
    setCurrentView('paper_view');

    const historyItem: GenerationHistoryItem = {
      id: `paper-${Date.now()}`,
      mode: 'paper',
      title: `${paper.subjectName} — Official 80-Mark Sample Paper`,
      subjectName: paper.subjectName,
      subjectCode: paper.subjectCode,
      countOrMarks: '80 Marks · 3 Hours',
      level: paper.level,
      createdAt: new Date().toISOString(),
      paper,
    };
    const updated = [historyItem, ...history];
    setHistory(updated);
    try {
      localStorage.setItem('boardready_history', JSON.stringify(updated));
    } catch {}
  };

  const t = I18N[language];

  return (
    <div
      className={`min-h-screen ${
        fontSize === 'large' ? 'text-base' : 'text-sm'
      } ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >
      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden transition">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-bold shadow-xs">
              10
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  BoardReady 10
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-mono">
                  CBSE 2026-27
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official Blueprint Aligned
              </p>
            </div>
          </div>

          {/* Quick Nav Links & Free Quota Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Free Quota Badge */}
            <div
              title="Daily free generation allowance"
              className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>
                <strong>{quota.papersRemaining}</strong> papers / <strong>{quota.questionsRemaining}</strong> Qs left today
              </span>
            </div>

            {/* Acceptance Tests Button */}
            <button
              onClick={() => setIsTestsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg transition"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Phase 4 Tests</span>
            </button>

            {/* Question Bank */}
            <button
              onClick={() => setIsBankOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition"
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">{t.questionBank}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 rounded-full font-mono">
                {bank.length}
              </span>
            </button>

            {/* History */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">{t.myHistory}</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Settings & Diagnostics"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW CONTROLLER */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentView === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Banner */}
            <div className="text-center max-w-2xl mx-auto pt-4 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Master CBSE Class 10 with Board-Calibrated Precision
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zero hallucination, rationalised 2026-27 syllabus fidelity, multi-step verification, and authentic Board exam typography.
              </p>
            </div>

            {/* Two Large Hero Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Card 1: Question Generator */}
              <div
                onClick={() => {
                  setWizardSubjectCode(undefined);
                  setWizardChapterName(undefined);
                  setWizardLevel(undefined);
                  setCurrentView('question_wizard');
                }}
                className="group relative bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Step Wizard · Flow A
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {t.questionGen}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {t.questionGenDesc} Filter by 1–50 count, chapters, question types (MCQ, Assertion-Reason, Case-study, Numericals, Diagrams), and competency twists.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                      Multi-chapter selection
                    </span>
                    <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                      Grammar & Writing Focus Tiles
                    </span>
                    <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                      LaTeX KaTeX Equations
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold text-xs group-hover:translate-x-1 transition">
                  <span>{t.startWizard}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 2: Sample Paper Generator */}
              <div
                onClick={() => {
                  setWizardSubjectCode(undefined);
                  setWizardLevel(undefined);
                  setCurrentView('paper_wizard');
                }}
                className="group relative bg-white dark:bg-slate-900 border-2 border-purple-100 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Official Blueprint · Flow B
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {t.samplePaperGen}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {t.samplePaperGenDesc} Strictly 80 marks in 3 hours with exact section structures, internal choice OR pairs, and authentic board layout.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                      Maths 041 & 241 (38 Qs)
                    </span>
                    <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                      Science 086 (39 Qs)
                    </span>
                    <span className="text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                      SST 087 & English 184
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-purple-600 dark:text-purple-400 font-bold text-xs group-hover:translate-x-1 transition">
                  <span>{t.generatePaper}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Practice Picks (High Yield CBSE Chapters) */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.quickPractice}
                </span>
                <span className="text-xs text-slate-500">High-probability board exam focus areas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Pick 1 */}
                <div
                  onClick={() => {
                    setWizardSubjectCode('086');
                    setWizardChapterName('Electricity');
                    setWizardLevel('Hard');
                    setCurrentView('question_wizard');
                  }}
                  className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-400 transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Science 086</span>
                    <span className="px-1.5 py-0.2 bg-rose-50 text-rose-700 text-[10px] font-bold rounded">
                      Hard
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-xs">
                    Electricity & Circuits
                  </h4>
                  <p className="text-[11px] text-slate-500">Resistor networks & Joule heating</p>
                </div>

                {/* Pick 2 */}
                <div
                  onClick={() => {
                    setWizardSubjectCode('184-G');
                    setWizardChapterName('Reported Speech');
                    setWizardLevel('Medium');
                    setCurrentView('question_wizard');
                  }}
                  className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-400 transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Grammar 184</span>
                    <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">
                      Medium
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-xs">
                    Reported Speech
                  </h4>
                  <p className="text-[11px] text-slate-500">Dialogue format reporting items</p>
                </div>

                {/* Pick 3 */}
                <div
                  onClick={() => {
                    setWizardSubjectCode('184-W');
                    setWizardChapterName('Analytical Paragraph');
                    setWizardLevel('Moderate');
                    setCurrentView('question_wizard');
                  }}
                  className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-400 transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Writing 184</span>
                    <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">
                      Moderate
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-xs">
                    Analytical Paragraph
                  </h4>
                  <p className="text-[11px] text-slate-500">Chart/table cues (100–120 words)</p>
                </div>

                {/* Pick 4 */}
                <div
                  onClick={() => {
                    setWizardSubjectCode('087');
                    setWizardChapterName('Lifelines of National Economy');
                    setWizardLevel('Moderate');
                    setCurrentView('question_wizard');
                  }}
                  className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-400 transition cursor-pointer space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">SST 087</span>
                    <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                      Map Only
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-xs">
                    Lifelines of Economy
                  </h4>
                  <p className="text-[11px] text-slate-500">Major seaports & airports</p>
                </div>
              </div>
            </div>

            {/* Bottom Info Banner */}
            <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  All questions strictly comply with CBSE 2026-27 deleted topic filters and NCERT rationalised textbooks.
                </span>
              </div>
              <div className="text-[11px] font-mono">
                {t.disclaimer}
              </div>
            </div>
          </div>
        )}

        {/* FLOW A: QUESTION WIZARD */}
        {currentView === 'question_wizard' && (
          <QuestionWizard
            onBackToHome={() => setCurrentView('home')}
            onSaveToBank={handleSaveToBank}
            onSaveGeneration={handleSaveHistoryItem}
            initialSubjectCode={wizardSubjectCode}
            initialChapterName={wizardChapterName}
            initialLevel={wizardLevel}
          />
        )}

        {/* FLOW B: SAMPLE PAPER WIZARD */}
        {currentView === 'paper_wizard' && (
          <SamplePaperWizard
            onBackToHome={() => setCurrentView('home')}
            onPaperGenerated={handlePaperGenerated}
            initialSubjectCode={wizardSubjectCode}
            initialLevel={wizardLevel}
          />
        )}

        {/* BOARD-STYLE PAPER VIEW */}
        {currentView === 'paper_view' && activePaper && (
          <BoardPaperView
            paper={activePaper}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* MODALS */}
      <QuestionBankModal
        isOpen={isBankOpen}
        onClose={() => setIsBankOpen(false)}
        bank={bank}
        onRemove={handleRemoveFromBank}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectPaper={(p) => {
          setActivePaper(p);
          setCurrentView('paper_view');
        }}
        onClearHistory={() => {
          setHistory([]);
          try {
            localStorage.removeItem('boardready_history');
          } catch {}
        }}
      />

      <AcceptanceTestsModal
        isOpen={isTestsOpen}
        onClose={() => setIsTestsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </div>
  );
}
