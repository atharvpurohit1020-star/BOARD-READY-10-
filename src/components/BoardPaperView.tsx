import React, { useState } from 'react';
import { GeneratedPaper, Question } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { Printer, Download, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Share2, Sparkles } from 'lucide-react';

interface BoardPaperViewProps {
  paper: GeneratedPaper;
  onBack: () => void;
  onRegenerateSlot?: (slotQ: number) => void;
}

export const BoardPaperView: React.FC<BoardPaperViewProps> = ({
  paper,
  onBack,
  onRegenerateSlot,
}) => {
  const [viewMode, setViewMode] = useState<'paper' | 'marking_scheme'>('paper');
  const [showSolutionMap, setShowSolutionMap] = useState<Record<string, boolean>>({});

  const toggleSolution = (qId: string) => {
    setShowSolutionMap((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const isSST = paper.subjectCode === '087';

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 pb-20 print:m-0 print:p-0 print:max-w-none">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            ← Back
          </button>
          <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-semibold">
            CBSE 2026-27 Pattern
          </span>
          <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-semibold">
            {paper.level} Level
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-medium">
            <button
              onClick={() => setViewMode('paper')}
              className={`px-3 py-1.5 rounded-md transition ${
                viewMode === 'paper' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Question Paper
            </button>
            <button
              onClick={() => setViewMode('marking_scheme')}
              className={`px-3 py-1.5 rounded-md transition ${
                viewMode === 'marking_scheme' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Marking Scheme (80 Marks)
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* QUESTION PAPER VIEW */}
      {viewMode === 'paper' ? (
        <div className="bg-white border border-slate-300 rounded-lg p-8 sm:p-12 shadow-sm font-serif print:border-none print:p-0 print:shadow-none text-black leading-relaxed">
          {/* Header Row: Series & Q.P. Code */}
          <div className="flex justify-between items-start text-xs sm:text-sm font-sans mb-3">
            <div>
              <span className="font-bold">Series: </span>
              <span>{paper.series}</span>
            </div>
            <div className="text-right">
              <div>
                <span className="font-bold">SET </span>
                <span className="font-bold">~{paper.setNumber}</span>
              </div>
              <div className="text-xs font-mono mt-0.5">
                <span className="font-semibold">Q.P. Code: </span>
                <span className="font-bold underline">{paper.paperCode}</span>
              </div>
            </div>
          </div>

          {/* Roll No. 8-Box Grid */}
          <div className="my-4 font-sans text-xs flex flex-wrap items-center justify-between border-y border-slate-300 py-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider">Roll No.</span>
              <div className="flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-6 h-7 border border-black flex items-center justify-center font-mono"></div>
                ))}
              </div>
            </div>
            <div className="text-[11px] italic text-slate-700">
              Candidates must write the Q.P. Code on the title page of the answer-book.
            </div>
          </div>

          {/* Subject Title */}
          <div className="text-center my-6">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide font-sans">
              {paper.subjectName} — {paper.subjectCode}
            </h1>
            <p className="text-sm italic text-slate-700 mt-1 font-serif">
              CBSE Class X · Practice Paper 2026-27 · Difficulty: {paper.level}
            </p>
          </div>

          {/* Time & Max Marks line */}
          <div className="flex justify-between items-center text-sm font-sans font-bold border-b border-black pb-1 mb-6">
            <span>Time Allowed: {Math.floor(paper.durationMin / 60)} hours</span>
            <span>Maximum Marks: {paper.maxMarks}</span>
          </div>

          {/* Real Paper Boxed Note List */}
          <div className="border border-slate-400 p-3 mb-6 text-xs font-sans bg-slate-50/50 print:bg-transparent">
            <ul className="list-disc list-inside space-y-1 text-slate-800">
              <li>Please check that this question paper contains <strong>{paper.sections.length}</strong> sections and <strong>{paper.totalQuestions}</strong> questions.</li>
              <li>Please check that this question paper contains no missing items before starting.</li>
              <li>A reading time of <strong>15 minutes</strong> has been allotted to read this question paper thoroughly. Candidates will read the paper only during this time and must not write any answers on the answer-book.</li>
            </ul>
          </div>

          {/* General Instructions */}
          <div className="mb-8 font-sans text-xs sm:text-[13px] border-b border-slate-300 pb-5">
            <h2 className="font-bold uppercase tracking-wider mb-2 font-serif text-sm">General Instructions:</h2>
            <ol className="list-decimal list-outside ml-5 space-y-1 text-slate-800">
              {paper.generalInstructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ol>
          </div>

          {/* Paper Sections and Questions */}
          <div className="space-y-8">
            {paper.sections.map((section) => (
              <div key={section.id} className="pt-2">
                {/* Section Header */}
                <div className="text-center mb-6">
                  <h3 className="font-sans font-bold text-base uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <p className="text-xs italic text-slate-600 mt-0.5">
                    {section.note}
                  </p>
                </div>

                {/* Section Questions */}
                <div className="space-y-6">
                  {section.questions.map((q, idx) => (
                    <div key={q.id} className="border-b border-slate-200 pb-5 last:border-b-0">
                      {/* Grid: Q.No (left), Content (center), Marks (right) */}
                      <div className="grid grid-cols-[36px_1fr_40px] gap-2 items-start">
                        {/* Question Number */}
                        <div className="font-bold text-sm text-right pr-2 select-none">
                          {q.id.match(/-q(\d+)-/)?.[1] || idx + 1}.
                        </div>

                        {/* Question Content */}
                        <div className="text-sm sm:text-[15px] space-y-2">
                          {/* Case passage if present */}
                          {q.caseText && (
                            <div className="border border-slate-400 p-3 bg-slate-50/70 text-sm font-sans mb-3 rounded-xs print:bg-transparent">
                              <p className="whitespace-pre-line">{q.caseText}</p>
                            </div>
                          )}

                          {/* Question Stem */}
                          <div className="font-serif">
                            <KaTeXRenderer content={q.stem} />
                          </div>

                          {/* Diagram SVG if present */}
                          {q.diagramSvg && (
                            <div className="my-3 py-2 flex flex-col items-center justify-center">
                              <div
                                className="max-w-[85%] mx-auto"
                                dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                              />
                              <span className="text-xs italic font-sans text-slate-600 mt-1">
                                Fig. {q.id.match(/-q(\d+)-/)?.[1] || idx + 1}
                              </span>
                            </div>
                          )}

                          {/* Assertion-Reason Format */}
                          {q.assertion && q.reason && (
                            <div className="my-2 space-y-1 font-serif pl-2 border-l-2 border-slate-300">
                              <p>
                                <strong>Assertion (A): </strong>
                                <KaTeXRenderer content={q.assertion} />
                              </p>
                              <p>
                                <strong>Reason (R): </strong>
                                <KaTeXRenderer content={q.reason} />
                              </p>
                            </div>
                          )}

                          {/* MCQ Options */}
                          {q.options && (
                            <div
                              className={`pt-1 font-serif text-sm ${
                                Object.values(q.options).every((opt) => opt.length <= 30)
                                  ? 'grid grid-cols-2 gap-x-4 gap-y-1'
                                  : 'space-y-1'
                              }`}
                            >
                              <div>
                                <strong>(a) </strong>
                                <KaTeXRenderer content={q.options.a} />
                              </div>
                              <div>
                                <strong>(b) </strong>
                                <KaTeXRenderer content={q.options.b} />
                              </div>
                              <div>
                                <strong>(c) </strong>
                                <KaTeXRenderer content={q.options.c} />
                              </div>
                              <div>
                                <strong>(d) </strong>
                                <KaTeXRenderer content={q.options.d} />
                              </div>
                            </div>
                          )}

                          {/* Sub-parts for Case Studies */}
                          {q.subParts && q.subParts.length > 0 && (
                            <div className="mt-2 space-y-2 pl-2">
                              {q.subParts.map((sp, spIdx) => (
                                <div key={spIdx} className="grid grid-cols-[28px_1fr_30px] items-start text-sm">
                                  <span className="font-bold">{sp.label}</span>
                                  <div>
                                    <KaTeXRenderer content={sp.text} />
                                  </div>
                                  <span className="text-right font-sans text-xs font-bold">
                                    [{sp.marks}]
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Internal Choice OR alternative */}
                          {q.orQuestion && (
                            <div className="mt-4 pt-3 border-t border-dashed border-slate-300">
                              <div className="text-center my-2 font-sans font-bold text-sm tracking-wider text-slate-800">
                                OR
                              </div>
                              <div className="text-sm font-serif">
                                <KaTeXRenderer content={q.orQuestion.stem.replace('[ALTERNATIVE OPTION - OR]\n', '')} />
                              </div>
                            </div>
                          )}

                          {/* Collapsible Answer & Marking in UI (hidden in print) */}
                          <div className="pt-2 print:hidden">
                            <button
                              onClick={() => toggleSolution(q.id)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-sans font-medium flex items-center gap-1 transition"
                            >
                              {showSolutionMap[q.id] ? (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5" /> Hide Solution & Step Marks
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3.5 h-3.5" /> Show Solution & Step Marks
                                </>
                              )}
                            </button>

                            {showSolutionMap[q.id] && (
                              <div className="mt-2 p-3 bg-indigo-50/60 rounded-md border border-indigo-100 text-xs font-sans space-y-2">
                                <div>
                                  <span className="font-bold text-indigo-900">Answer / Value Point: </span>
                                  <KaTeXRenderer content={q.answer} className="text-slate-800" />
                                </div>
                                <div className="space-y-1">
                                  <span className="font-bold text-indigo-900">Step Solution:</span>
                                  <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
                                    {q.solutionSteps.map((st, sIdx) => (
                                      <li key={sIdx}>
                                        <KaTeXRenderer content={st} />
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Marks Column */}
                        <div className="font-sans font-bold text-sm text-right select-none">
                          {q.marks}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Social Science Map Outline Page (if SST) */}
          {isSST && (
            <div className="mt-12 pt-8 border-t-2 border-black page-break-before">
              <div className="text-center mb-4">
                <h3 className="font-sans font-bold text-base uppercase">
                  Outline Political Map of India
                </h3>
                <p className="text-xs italic text-slate-600">
                  (Attach securely with the answer-book for Questions 9 & 19)
                </p>
              </div>

              {/* High Quality Vector Outline Map of India */}
              <div className="border border-slate-400 p-4 bg-slate-50 flex flex-col items-center justify-center my-4 print:bg-transparent">
                <svg viewBox="0 0 450 520" className="w-full max-w-md h-auto">
                  {/* Stylized Political Coastline and Borders */}
                  <path
                    d="M 180 50 Q 210 20 230 45 Q 260 70 240 100 Q 280 110 320 120 Q 360 140 370 170 Q 340 190 310 185 Q 290 200 270 220 Q 290 240 300 280 Q 280 320 270 370 Q 240 430 225 480 Q 215 440 200 400 Q 180 340 170 300 Q 140 280 120 250 Q 110 210 130 180 Q 110 150 140 120 Q 150 80 180 50 Z"
                    fill="#ffffff"
                    stroke="#1e293b"
                    strokeWidth="2"
                  />
                  {/* Arabian Sea, Bay of Bengal labels */}
                  <text x="70" y="360" fontFamily="sans-serif" fontSize="11" fill="#64748b" fontStyle="italic">Arabian Sea</text>
                  <text x="320" y="360" fontFamily="sans-serif" fontSize="11" fill="#64748b" fontStyle="italic">Bay of Bengal</text>
                  <text x="180" y="505" fontFamily="sans-serif" fontSize="11" fill="#64748b" fontStyle="italic">Indian Ocean</text>
                  {/* Sample Coordinate Dots for Kandla, Mumbai, Chennai, Kolkata */}
                  <circle cx="120" cy="240" r="4" fill="#000" />
                  <text x="95" y="235" fontFamily="sans-serif" fontSize="10" fontWeight="bold">A (Port)</text>
                  <circle cx="145" cy="305" r="4" fill="#000" />
                  <text x="100" y="310" fontFamily="sans-serif" fontSize="10" fontWeight="bold">B (Port)</text>
                  <circle cx="230" cy="400" r="4" fill="#000" />
                  <text x="240" y="405" fontFamily="sans-serif" fontSize="10" fontWeight="bold">C (Airport)</text>
                  <circle cx="290" cy="245" r="4" fill="#000" />
                  <text x="300" y="245" fontFamily="sans-serif" fontSize="10" fontWeight="bold">D (Center)</text>
                </svg>
              </div>

              {/* Visually Impaired Alternative */}
              <div className="border border-slate-300 p-3 text-xs font-sans bg-slate-100/50 mt-4 print:bg-transparent">
                <span className="font-bold underline block mb-1">
                  Note for Visually Impaired Candidates only:
                </span>
                <p>In lieu of Question 9 & 19, answer the designated identification questions directly on your answer book.</p>
              </div>
            </div>
          )}

          {/* End Marker */}
          <div className="text-center my-8 text-base tracking-[0.4em] font-bold select-none">
            • • •
          </div>

          {/* Footer on Every Page */}
          <div className="border-t border-slate-300 pt-3 mt-6 flex justify-between items-center text-[11px] font-sans text-slate-500">
            <div>Practice paper generated by BoardReady 10 — not an official CBSE paper.</div>
            <div className="font-bold">Page 1 of 1</div>
            <div>P.T.O.</div>
          </div>
        </div>
      ) : (
        /* MARKING SCHEME / ANSWER KEY VIEW */
        <div className="bg-white border border-slate-300 rounded-lg p-8 sm:p-12 shadow-sm font-sans print:border-none print:p-0 print:shadow-none text-black leading-relaxed">
          <div className="text-center border-b border-black pb-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider font-serif">
              MARKING SCHEME — PRACTICE PAPER
            </h1>
            <p className="text-sm text-slate-700 mt-1">
              Class X · {paper.subjectName} ({paper.subjectCode}) · Total Marks: 80
            </p>
            <p className="text-xs text-slate-500 italic mt-0.5">
              Strict evaluation standards with step-wise mark distribution
            </p>
          </div>

          <div className="space-y-6">
            {paper.sections.map((section) => (
              <div key={section.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-bold text-sm border-b border-slate-200 flex justify-between items-center">
                  <span>{section.title}</span>
                  <span className="text-xs text-slate-600">
                    Section Total:{' '}
                    {section.questions.reduce((sum, q) => sum + q.marks, 0)} Marks
                  </span>
                </div>

                <div className="divide-y divide-slate-200">
                  {section.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 grid grid-cols-[40px_1fr_60px] gap-3 text-sm items-start">
                      <div className="font-bold font-mono">
                        Q{q.id.match(/-q(\d+)-/)?.[1] || idx + 1}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold text-indigo-900">Value Point / Expected Answer:</span>
                          <div className="mt-0.5 font-serif">
                            <KaTeXRenderer content={q.answer} />
                          </div>
                        </div>

                        {q.solutionSteps.length > 0 && (
                          <div className="text-xs text-slate-700">
                            <span className="font-semibold text-slate-900">Key Steps:</span>
                            <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                              {q.solutionSteps.map((step, sIdx) => (
                                <li key={sIdx}>
                                  <KaTeXRenderer content={step} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {q.markingScheme && q.markingScheme.length > 0 && (
                          <div className="mt-2 text-xs bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-semibold text-slate-900 block mb-1">
                              Step-Wise Mark Distribution:
                            </span>
                            <div className="space-y-1">
                              {q.markingScheme.map((ms, mIdx) => (
                                <div key={mIdx} className="flex justify-between items-center text-slate-600">
                                  <span>{ms.step}</span>
                                  <span className="font-mono font-bold text-slate-900">{ms.marks} M</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right font-bold font-mono text-indigo-700">
                        {q.marks} M
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center font-bold text-sm">
            <span>Grand Total:</span>
            <span className="text-base text-indigo-900">{paper.maxMarks} Marks</span>
          </div>

          <div className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-200">
            Practice paper generated by BoardReady 10 — not an official CBSE paper.
          </div>
        </div>
      )}
    </div>
  );
};
