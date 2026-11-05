import React, { useEffect, useState } from 'react';
import { Settings, X, Moon, Sun, Globe, Eye, Server, ShieldCheck } from 'lucide-react';
import { Language } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  fontSize: 'normal' | 'large';
  onFontSizeChange: (size: 'normal' | 'large') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  fontSize,
  onFontSizeChange,
}) => {
  const [quotaInfo, setQuotaInfo] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/quota')
        .then((res) => res.json())
        .then((data) => setQuotaInfo(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-lg">Settings & Provider Diagnostics</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-sm">
          {/* Language Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Interface Language</span>
              <span className="text-xs text-slate-500">English or हिंदी UI strings</span>
            </div>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'en' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'hi' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block">Display Theme</span>
              <span className="text-xs text-slate-500">Light mode recommended for board print view</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 transition"
            >
              {isDarkMode ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" /> Dark
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" /> Light
                </>
              )}
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block">Reading Font Size</span>
              <span className="text-xs text-slate-500">Scale paper typography for low-resolution displays</span>
            </div>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => onFontSizeChange('normal')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  fontSize === 'normal' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Default (12pt)
              </button>
              <button
                onClick={() => onFontSizeChange('large')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  fontSize === 'large' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Large (14pt)
              </button>
            </div>
          </div>

          {/* Provider Quota Diagnostics */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-900">Provider & Quota Telemetry</span>
            </div>

            {quotaInfo ? (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Daily Papers Remaining:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {quotaInfo.papersRemaining} / {quotaInfo.maxPapers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Daily Questions Remaining:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {quotaInfo.questionsRemaining} / {quotaInfo.maxQuestions}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Multi-Tier Router Status:
                  </span>
                  {quotaInfo.providerStats?.map((ps: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>{ps.name}:</span>
                      <span className="text-emerald-700">
                        {ps.calls} calls · {ps.success} ok
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Loading quota diagnostics...</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
