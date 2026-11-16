import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { MLAnalysisResult } from '../lib/mlClassifier';
import { DrPiscesMascot } from './DrPiscesMascot';

interface DrPiscesAlertToastProps {
  visible: boolean;
  analysis: MLAnalysisResult;
  onDismiss: () => void;
  onCompleteTask: (note: string, task: MLAnalysisResult['suggestedTask']) => void;
}

export const DrPiscesAlertToast: React.FC<DrPiscesAlertToastProps> = ({
  visible,
  analysis,
  onDismiss,
  onCompleteTask,
}) => {
  const [completionNote, setCompletionNote] = useState('');

  if (!visible) return null;

  const { criticalMetric, suggestedTask } = analysis;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-md rounded-3xl bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-orange-500 shadow-xl p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <DrPiscesMascot size={74} mood="alert" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange-700 dark:text-amber-300">
                Dr. Pisces Quick Task · {criticalMetric.severity}
              </p>
              <h3 className="font-display text-lg font-bold text-sky-950 dark:text-white leading-snug">
                {criticalMetric.metricName}: {criticalMetric.currentReading}
              </h3>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss Dr. Pisces alert"
              className="p-1 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-800 text-sky-800 dark:text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-sky-900 dark:text-slate-300 mt-1 leading-relaxed">
            Healthy Goal: <span className="font-mono-tabular font-semibold">{criticalMetric.targetReading}</span>.{' '}
            {suggestedTask.instructions}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onCompleteTask(completionNote.trim() || 'Completed protocol in cabin', suggestedTask);
              setCompletionNote('');
            }}
            className="mt-3 space-y-2"
          >
            <input
              type="text"
              value={completionNote}
              onChange={(e) => setCompletionNote(e.target.value)}
              placeholder="Log quick note (e.g. OCT done, +500mL water)..."
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-sky-300 dark:border-slate-700 text-xs text-sky-950 dark:text-white placeholder:text-sky-700/60 focus:outline-2 focus:outline-orange-500"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 dark:text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-orange-600" aria-hidden="true" />
                +{suggestedTask.starReward} Star Reward
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-orange-950 font-semibold text-xs border border-orange-500 transition-colors cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-700" aria-hidden="true" />
                <span>Log Task Complete</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </aside>
  );
};
