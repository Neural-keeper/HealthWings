import React, { useState } from 'react';
import { SunMedium, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { ZeroGTestProtocol } from '../data/lsahData';

interface ZeroGTestCardProps {
  protocol: ZeroGTestProtocol;
  onCompleteTest?: (protocol: ZeroGTestProtocol) => void;
}

export const ZeroGTestCard: React.FC<ZeroGTestCardProps> = ({
  protocol,
  onCompleteTest,
}) => {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'done'>('idle');

  const handleRunOpticalScan = () => {
    setScanStatus('scanning');
    window.setTimeout(() => {
      setScanStatus('done');
      if (onCompleteTest) {
        onCompleteTest(protocol);
      }
    }, 850);
  };

  return (
    <div className="rounded-3xl border-2 border-amber-300 dark:border-amber-500/60 bg-amber-50/98 dark:bg-slate-900 shadow-sm p-3.5 sm:p-4 flex flex-col gap-2">
      {/* Compact Space Test Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-dashed border-amber-300 dark:border-slate-700">
        <div>
          <p className="text-[11px] font-bold text-orange-600 dark:text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            <span>Space Test Card · {protocol.wavelengthNm}</span>
          </p>
          <h4 className="font-display text-base sm:text-lg font-bold text-orange-bordered-sm leading-tight mt-0.5">
            {protocol.name}
          </h4>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-[11px] font-mono-tabular font-semibold text-sky-900 dark:text-sky-200 shrink-0">
          <Clock className="w-3 h-3 text-orange-500" aria-hidden="true" />
          {protocol.durationSec}s
        </span>
      </div>

      <p className="text-[11px] sm:text-xs text-sky-900 dark:text-slate-300 leading-snug">
        {protocol.zeroGPrinciple}
      </p>

      {/* Compact Gear Needed Row */}
      <div className="rounded-xl bg-white dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 px-2.5 py-2">
        <div className="text-[11px] font-bold text-sky-950 dark:text-amber-200 mb-0.5">
          What You Need ({protocol.hardware})
        </div>
        <ul className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-sky-900 dark:text-slate-300">
          {protocol.ingredients.map((item) => (
            <li key={item} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Compact Numbered Steps */}
      <div className="space-y-1">
        {protocol.steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-800/60 border border-amber-200/90 dark:border-slate-700 text-[11px] sm:text-xs text-sky-950 dark:text-slate-200 leading-snug"
          >
            <span className="font-display font-bold text-orange-600 dark:text-amber-300 shrink-0">
              {idx + 1}.
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-amber-200 dark:border-slate-700">
        <div className="space-y-0.5">
          <div className="text-[11px] font-mono-tabular text-sky-800 dark:text-slate-400">
            Healthy Goal: {protocol.normalReadingRange}
          </div>
          <a
            href="https://www.nasa.gov/hrp/"
            target="_blank"
            rel="noreferrer"
            className="block text-[10px] text-sky-700 dark:text-cyan-300 hover:underline"
          >
            Source: NASA HRP — Light-Based Zero-G Countermeasures
          </a>
        </div>
        <button
          type="button"
          onClick={handleRunOpticalScan}
          disabled={scanStatus === 'scanning'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            scanStatus === 'done'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-400'
              : 'bg-amber-300 hover:bg-amber-400 text-orange-950 border-2 border-orange-500'
          }`}
        >
          {scanStatus === 'scanning' ? (
            <>
              <SunMedium className="w-3.5 h-3.5 animate-spin text-orange-700" aria-hidden="true" />
              <span>Running Check...</span>
            </>
          ) : scanStatus === 'done' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              <span>Done! (+1 Star)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-orange-700" aria-hidden="true" />
              <span>Mark Done &amp; Earn +1 Star</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
