import React, { useEffect, useState } from 'react';
import { BrainCircuit, Stethoscope, AlertTriangle, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import {
  AstronautBiometrics,
  NASA_SYMPTOMS,
  ZeroGTestProtocol,
} from '../data/lsahData';
import { MLAnalysisResult, runLsahMlClassifier } from '../lib/mlClassifier';

interface MLSymptomAnalyzerProps {
  biometrics: AstronautBiometrics;
  selectedSymptoms: string[];
  onToggleSymptom: (symptomId: string) => void;
  onAskPiscesAboutRisk: (summary: string) => void;
  onPopSpaceTestModal: (protocol: ZeroGTestProtocol) => void;
}

export const MLSymptomAnalyzer: React.FC<MLSymptomAnalyzerProps> = ({
  biometrics,
  selectedSymptoms,
  onToggleSymptom,
  onAskPiscesAboutRisk,
  onPopSpaceTestModal,
}) => {
  const [analysis, setAnalysis] = useState<MLAnalysisResult>(() =>
    runLsahMlClassifier(biometrics, selectedSymptoms)
  );
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let active = true;
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
        // Local classifier keeps UI responsive
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
  const recTest = analysis.recommendedTest;

  return (
    <section
      id="ml-triage"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10"
    >
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-cyan-300 mb-1">
            Smart Symptom Helper · Trained on NASA Astronaut Data
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-orange-bordered text-balance">
            How Are You Feeling &amp; Which Space Test Helps?
          </h2>
        </div>
        <div className="text-xs text-sky-800 dark:text-slate-300 font-mono-tabular">
          {isSyncing ? 'Checking patterns...' : `${selectedSymptoms.length} symptoms picked`}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Symptom Buttons + Simple Risk Bars */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white/92 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="font-display text-xl font-bold text-sky-950 dark:text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-orange-500" aria-hidden="true" />
                <span>Tap Any Symptoms You Feel</span>
              </h3>
              <span className="text-xs text-sky-700 dark:text-slate-400">
                Updates your wings &amp; Space Test match
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
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-100 dark:bg-amber-950/60 border-orange-500 text-sky-950 dark:text-amber-100'
                        : 'bg-sky-50/80 dark:bg-slate-800/70 border-sky-200 dark:border-slate-700 text-sky-900 dark:text-slate-200 hover:border-sky-400'
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

          {/* Rounded-Rectangle ML Match Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/92 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="font-display text-xl font-bold text-sky-950 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-sky-600 dark:text-cyan-400" aria-hidden="true" />
                <span>What Needs Attention Most</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  onAskPiscesAboutRisk(
                    `My check-in flagged ${topRisk.conditionName} (${topRisk.probability}%). What should I do?`
                  )
                }
                className="text-xs font-semibold text-orange-600 dark:text-amber-300 hover:underline cursor-pointer"
              >
                Ask Dr. Pisces
              </button>
            </div>

            <div className="space-y-3">
              {analysis.predictions.map((pred, idx) => {
                const barTone =
                  pred.severity === 'Needs Care'
                    ? 'bg-rose-400 dark:bg-rose-500'
                    : pred.severity === 'Watch'
                    ? 'bg-amber-400 dark:bg-amber-400'
                    : 'bg-sky-400 dark:bg-cyan-400';

                return (
                  <div
                    key={pred.conditionId}
                    className="p-3.5 rounded-2xl bg-sky-50/75 dark:bg-slate-800/60 border border-sky-200/80 dark:border-slate-700/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                      <span className="font-semibold text-sky-950 dark:text-slate-100">
                        {idx === 0 ? 'Top Focus · ' : ''}
                        {pred.conditionName}
                      </span>
                      <span className="font-mono-tabular font-bold text-sky-900 dark:text-sky-200 shrink-0">
                        {pred.probability}% · {pred.severity}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barTone}`}
                        style={{ width: `${pred.probability}%` }}
                      />
                    </div>
                    {idx === 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-sky-800 dark:text-slate-400">
                        <span className="font-semibold text-sky-950 dark:text-slate-200">
                          Main clues:
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

            <p className="mt-4 pt-3 border-t border-sky-100 dark:border-slate-800 text-[11px] text-sky-800 dark:text-slate-400">
              <strong className="text-sky-950 dark:text-slate-200">Model &amp; Data Citation:</strong>{' '}
              Logistic risk classifier (<code className="font-mono-tabular">src/lib/mlClassifier.ts</code>) parameterized on{' '}
              <a
                href="https://nlsp.nasa.gov/resources/lsah"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-orange-600 dark:text-amber-300 hover:underline"
              >
                NASA LSAH Crew Cohort Ranges
              </a>{' '}
              &amp;{' '}
              <a
                href="https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=resources"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sky-700 dark:text-cyan-300 hover:underline"
              >
                NASA Space Apps 2026 Health Monitoring Resources
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right: Priority Metric Card + Pop-Up Space Test Trigger Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-amber-100/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/70">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="w-5 h-5 text-orange-600 dark:text-amber-300 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs font-bold text-orange-800 dark:text-amber-300">
                  Top Metric to Watch · {analysis.criticalMetric.severity}
                </div>
                <h3 className="font-display text-xl font-bold text-sky-950 dark:text-white mt-0.5">
                  {analysis.criticalMetric.metricName}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-3 font-mono-tabular">
                  <span className="text-2xl font-bold text-orange-700 dark:text-amber-300">
                    {analysis.criticalMetric.currentReading}
                  </span>
                  <span className="text-xs text-sky-900 dark:text-slate-300">
                    Healthy Goal: {analysis.criticalMetric.targetReading}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-sky-900/90 dark:text-slate-300 mt-2 leading-relaxed">
                  {analysis.criticalMetric.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Compact Recommended Space Test Card -> Opens as Pop-Up */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-2 border-sky-300 dark:border-cyan-700/70 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-700 dark:text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                <span>Recommended Space Test</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono-tabular text-sky-800 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                {recTest.durationSec}s
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-orange-bordered-sm">
              {recTest.name}
            </h3>
            <p className="text-xs sm:text-sm text-sky-900/90 dark:text-slate-300 leading-relaxed">
              {recTest.zeroGPrinciple}
            </p>
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700 text-xs text-sky-900 dark:text-slate-300">
              <strong className="text-sky-950 dark:text-white">Gear:</strong> {recTest.hardware} ·{' '}
              <strong className="text-sky-950 dark:text-white">Light:</strong> {recTest.wavelengthNm}
            </div>

            <button
              type="button"
              onClick={() => onPopSpaceTestModal(recTest)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-orange-950 font-display font-semibold text-sm border-2 border-orange-500 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-700" aria-hidden="true" />
              <span>Open Space Test Card</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
