import React from 'react';
import { GenerationHistoryItem, GeneratedPaper, Question } from '../types';
import { History, X, FileText, Download, Trash2, ArrowRight } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GenerationHistoryItem[];
  onSelectPaper: (paper: GeneratedPaper) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectPaper,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-lg">My Generation History</h3>
            <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 font-bold rounded-full">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 transition"
              >
                Clear History
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

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No past generations found. Generate questions or sample papers to view them here.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase ${
                        item.mode === 'paper'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {item.mode === 'paper' ? 'Sample Paper' : 'Question Set'}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-2">
                    <span>{item.subjectName}</span>
                    <span>·</span>
                    <span className="font-mono">{item.countOrMarks}</span>
                    <span>·</span>
                    <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div>
                  {item.paper && (
                    <button
                      onClick={() => {
                        onSelectPaper(item.paper!);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg transition"
                    >
                      Open Paper <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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
