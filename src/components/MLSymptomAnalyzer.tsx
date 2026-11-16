import React, { useEffect, useState } from 'react';
import { BrainCircuit, Stethoscope, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
  AstronautBiometrics,
  NASA_SYMPTOMS,
  ZeroGTestProtocol,
} from '../data/lsahData';
import { MLAnalysisResult, runLsahMlClassifier } from '../lib/mlClassifier';
import { ZeroGTestCard } from './ZeroGTestCard';

interface MLSymptomAnalyzerProps {
  biometrics: AstronautBiometrics;
  selectedSymptoms: string[];
  onToggleSymptom: (symptomId: string) => void;
  onCompleteTest: (protocol: ZeroGTestProtocol) => void;
  onAskPiscesAboutRisk: (summary: string) => void;
}

export const MLSymptomAnalyzer: React.FC<MLSymptomAnalyzerProps> = ({
  biometrics,
  selectedSymptoms,
  onToggleSymptom,
  onCompleteTest,
  onAskPiscesAboutRisk,
}) => {
  const [analysis, setAnalysis] = useState<MLAnalysisResult>(() =>
    runLsahMlClassifier(biometrics, selectedSymptoms)
  );
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let active = true;
    // Instant local computation first so UI never flickers
    setAnalysis(runLsahMlClassifier(biometrics, selectedSymptoms));

    const timer = window.setTimeout(async () => {
      try {
        setIsSyncing(true);
        const res = await fetch('/api/ml/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ biometrics, symptoms: selectedSymptoms }),
        });
        if (res.ok && active) {
          const data = (await res.json()) as MLAnalysisResult;
          setAnalysis(data);
        }
      } catch {
        // Local classifier already keeps UI accurate
      } finally {
        if (active) setIsSyncing(false);
      }
    }, 180);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [biometrics, selectedSymptoms]);

  const topRisk = analysis.predictions[0];

  return (
    <section
      id="ml-triage"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-cyan-300 mb-1">
            NASA LSAH Machine Learning Triage · Logistic Biomarker Classifier
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-orange-bordered text-balance">
            Symptom Predictor &amp; Zero-G Light Tests
          </h2>
        </div>
        <div className="text-xs text-sky-800 dark:text-slate-300 font-mono-tabular">
          {isSyncing ? 'Updating ML weights...' : `${selectedSymptoms.length} symptoms active · 5 LSAH models`}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Symptom Selector + Explainable ML Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Symptom Buttons */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-display text-xl font-bold text-sky-950 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-orange-500" aria-hidden="true" />
                <span>Report Current Symptoms</span>
              </h3>
              <span className="text-xs text-sky-700 dark:text-slate-400">
                Select any sensations felt in cabin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {NASA_SYMPTOMS.map((sym) => {
                const active = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => onToggleSymptom(sym.id)}
                    aria-pressed={active}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-orange-500 text-sky-950 dark:text-amber-100'
                        : 'bg-sky-50/70 dark:bg-slate-800/70 border-sky-200 dark:border-slate-700 text-sky-900 dark:text-slate-200 hover:border-sky-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-semibold">{sym.label}</span>
                      {active && (
                        <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-amber-300 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    <div className="text-[11px] text-sky-700 dark:text-slate-400 mt-0.5">
                      {sym.category === 'mental' ? 'Mental Wing' : 'Physical Wing'} · {sym.lsahCorrelate}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ML Condition Probabilities & Feature Weights */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="font-display text-xl font-bold text-sky-950 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-sky-600 dark:text-cyan-400" aria-hidden="true" />
                <span>LSAH Trained Risk Probabilities</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  onAskPiscesAboutRisk(
                    `My ML triage shows ${topRisk.probability}% risk for ${topRisk.conditionName}. What should I check?`
                  )
                }
                className="text-xs font-semibold text-orange-600 dark:text-amber-300 hover:underline cursor-pointer"
              >
                Discuss with Dr. Pisces
              </button>
            </div>

            <div className="space-y-4">
              {analysis.predictions.map((pred, idx) => {
                const barTone =
                  pred.severity === 'Elevated'
                    ? 'bg-rose-400 dark:bg-rose-500'
                    : pred.severity === 'Moderate'
                    ? 'bg-amber-400 dark:bg-amber-400'
                    : 'bg-sky-400 dark:bg-cyan-400';

                return (
                  <div key={pred.conditionId} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                      <span className="font-semibold text-sky-950 dark:text-slate-100">
                        {idx === 0 ? 'Primary Focus · ' : ''}
                        {pred.conditionName}
                      </span>
                      <span className="font-mono-tabular font-bold text-sky-900 dark:text-sky-200 shrink-0">
                        {pred.probability}% · {pred.severity}
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-sky-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barTone}`}
                        style={{ width: `${pred.probability}%` }}
                      />
                    </div>
                    {idx === 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-sky-800 dark:text-slate-400">
                        <span className="font-semibold text-sky-950 dark:text-slate-200">
                          Top ML feature weights:
                        </span>
                        {pred.topContributors.map((c) => (
                          <span key={c.feature} className="font-mono-tabular">
                            {c.feature} (+{c.weightImpact}%)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Most Critical Metric Callout + Recommended Zero-G Light Test Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-3xl bg-amber-100/85 dark:bg-amber-950/35 border border-amber-300 dark:border-amber-700/70">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="w-5 h-5 text-orange-600 dark:text-amber-300 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs font-semibold text-orange-800 dark:text-amber-300">
                  Priority Biomarker · {analysis.criticalMetric.severity}
                </div>
                <h3 className="font-display text-lg font-bold text-sky-950 dark:text-white mt-0.5">
                  {analysis.criticalMetric.metricName}
                </h3>
                <div className="mt-2 flex flex-wrap items-baseline gap-3 font-mono-tabular">
                  <span className="text-2xl font-bold text-orange-700 dark:text-amber-300">
                    {analysis.criticalMetric.currentReading}
                  </span>
                  <span className="text-xs text-sky-900 dark:text-slate-300">
                    Healthy Adult Target: {analysis.criticalMetric.targetReading}
                  </span>
                </div>
                <p className="text-xs text-sky-900/90 dark:text-slate-300 mt-2 leading-relaxed">
                  {analysis.criticalMetric.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Light-Based Space Protocol Card */}
          <ZeroGTestCard
            protocol={analysis.recommendedTest}
            onCompleteTest={onCompleteTest}
          />
        </div>
      </div>
    </section>
  );
};
