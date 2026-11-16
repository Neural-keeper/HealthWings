import React, { useState } from 'react';
import { SunMedium, CheckCircle2, Timer, Sparkles } from 'lucide-react';
import { ZeroGTestProtocol } from '../data/lsahData';

interface ZeroGTestCardProps {
  protocol: ZeroGTestProtocol;
  onCompleteTest?: (protocol: ZeroGTestProtocol) => void;
  compact?: boolean;
}

export const ZeroGTestCard: React.FC<ZeroGTestCardProps> = ({
  protocol,
  onCompleteTest,
  compact = false,
}) => {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'done'>('idle');

  const handleRunOpticalScan = () => {
    setScanStatus('scanning');
    window.setTimeout(() => {
      setScanStatus('done');
      if (onCompleteTest) {
        onCompleteTest(protocol);
      }
    }, 900);
  };

  return (
    <div
      className={`rounded-2xl border-2 border-sky-300 dark:border-cyan-700/80 bg-gradient-to-br from-sky-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-semibold text-sky-700 dark:text-cyan-300">
            Zero-Gravity Optical Protocol · {protocol.wavelengthNm}
          </p>
          <h4 className="font-display text-lg font-bold text-orange-bordered-sm mt-0.5">
            {protocol.name}
          </h4>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono-tabular font-semibold text-sky-900 dark:text-sky-200">
          <Timer className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
          {protocol.durationSec}s scan
        </span>
      </div>

      <p className="text-xs sm:text-sm text-sky-900/90 dark:text-slate-300 leading-relaxed mb-3">
        <strong className="font-semibold text-sky-950 dark:text-white">Why it works in 0-G: </strong>
        {protocol.zeroGPrinciple}
      </p>

      <div className="text-xs text-sky-800 dark:text-slate-400 mb-3">
        <span className="font-semibold text-sky-950 dark:text-slate-200">Hardware: </span>
        {protocol.hardware}
        <span className="mx-2" aria-hidden="true">·</span>
        <span className="font-semibold text-sky-950 dark:text-slate-200">Nominal: </span>
        <span className="font-mono-tabular">{protocol.normalReadingRange}</span>
      </div>

      <ol className="space-y-2 mb-4">
        {protocol.steps.map((step, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-xs sm:text-sm text-sky-950 dark:text-slate-200 leading-snug"
          >
            <span className="font-mono-tabular font-bold text-orange-600 dark:text-amber-300 shrink-0 mt-0.5">
              0{idx + 1}.
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sky-200 dark:border-slate-700">
        <span className="text-xs text-sky-700 dark:text-slate-400">
          Light-based non-invasive telemetry
        </span>
        <button
          type="button"
          onClick={handleRunOpticalScan}
          disabled={scanStatus === 'scanning'}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            scanStatus === 'done'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-400'
              : 'bg-amber-300 hover:bg-amber-400 text-orange-950 border border-orange-500'
          }`}
        >
          {scanStatus === 'scanning' ? (
            <>
              <SunMedium className="w-4 h-4 animate-spin text-orange-700" aria-hidden="true" />
              <span>Calibrating Optical Sensor...</span>
            </>
          ) : scanStatus === 'done' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              <span>Scan Logged (+Star Earned)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-orange-700" aria-hidden="true" />
              <span>Run Light Scan &amp; Log</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
