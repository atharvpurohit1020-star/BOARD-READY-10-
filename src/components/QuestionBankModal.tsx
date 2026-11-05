import React, { useState } from 'react';
import { Question, QuestionType, DifficultyLevel } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { Star, Search, Trash2, X, Download, Filter } from 'lucide-react';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  bank: Question[];
  onRemove: (id: string) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  bank,
  onRemove,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = bank.filter((q) => {
    const matchesSearch =
      q.stem.toLowerCase().includes(search.toLowerCase()) ||
      q.chapterName.toLowerCase().includes(search.toLowerCase()) ||
      q.subjectCode.includes(search);
    const matchesType = filterType === 'ALL' || q.type === filterType;
    const matchesLevel = filterLevel === 'ALL' || q.level === filterLevel;
    return matchesSearch && matchesType && matchesLevel;
  });

  const exportBankJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bank, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `BoardReady10_QuestionBank_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-slate-900 text-lg">Question Bank (Starred Items)</h3>
            <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 font-bold rounded-full">
              {bank.length} Saved
            </span>
          </div>

          <div className="flex items-center gap-2">
            {bank.length > 0 && (
              <button
                onClick={exportBankJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-2.5 bg-white items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search saved questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium"
          >
            <option value="ALL">All Question Types</option>
            <option value="MCQ">MCQ</option>
            <option value="ASSERTION_REASON">Assertion-Reason</option>
            <option value="SHORT">Short Answer</option>
            <option value="LONG">Long Answer</option>
            <option value="CASE_BASED">Case-based</option>
            <option value="NUMERICAL">Numerical</option>
          </select>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
            <option value="Very Hard">Very Hard</option>
          </select>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No questions found. Star questions during practice to save them here.
            </div>
          ) : (
            filtered.map((q) => (
              <div
                key={q.id}
                className="p-4 border border-slate-200 rounded-xl bg-white shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                      {q.subjectCode}
                    </span>
                    <span className="font-semibold text-slate-800">{q.chapterName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-indigo-600 font-medium">{q.type}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-amber-700 font-medium">{q.level}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{q.marks}M</span>
                    <button
                      onClick={() => onRemove(q.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title="Remove from Bank"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-sm font-serif text-slate-800">
                  <KaTeXRenderer content={q.stem} />
                </div>

                {q.options && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-serif bg-slate-50 p-2 rounded-lg">
                    <div><strong>(a)</strong> <KaTeXRenderer content={q.options.a} /></div>
                    <div><strong>(b)</strong> <KaTeXRenderer content={q.options.b} /></div>
                    <div><strong>(c)</strong> <KaTeXRenderer content={q.options.c} /></div>
                    <div><strong>(d)</strong> <KaTeXRenderer content={q.options.d} /></div>
                  </div>
                )}

                <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-100">
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    {revealedIds[q.id] ? 'Hide Answer' : 'Reveal Answer & Solution'}
                  </button>

                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {q.id}
                  </span>
                </div>

                {revealedIds[q.id] && (
                  <div className="p-3 bg-indigo-50/60 rounded-lg text-xs space-y-1.5 border border-indigo-100">
                    <div>
                      <span className="font-bold text-indigo-950">Answer: </span>
                      <KaTeXRenderer content={q.answer} />
                    </div>
                    {q.solutionSteps.length > 0 && (
                      <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                        {q.solutionSteps.map((st, i) => (
                          <li key={i}>
                            <KaTeXRenderer content={st} />
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
