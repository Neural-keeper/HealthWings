import React from 'react';
import { Moon, Sun, Sparkles, SlidersHorizontal, ArrowDown, Star } from 'lucide-react';
import { AstronautBiometrics, WingSpeedometerSummary } from '../data/lsahData';
import { DrPiscesMascot } from './DrPiscesMascot';

interface AsclepiusWingsHeroProps {
  biometrics: AstronautBiometrics;
  onUpdateBiometrics: (patch: Partial<AstronautBiometrics>) => void;
  wingSummary: WingSpeedometerSummary;
  isNight: boolean;
  onToggleNight: () => void;
  starsEarned: number;
  activePlanets: number;
  onGoToPlanets: () => void;
  onOpenChat: (initialPrompt?: string) => void;
  onSummonCheckIn: () => void;
  onOpenQuickRecipe: () => void;
}

interface AlignedBar {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  pivotX: number;
  pivotY: number;
  tierLabel: string;
}

const CENTER_X = 300;

// Mathematically symmetric feathered wing arc: even inner & outer spacing, zero overlap, top bar angled +10°
const WING_SPECS = [
  { width: 58, height: 22, pivotY: 274, innerOffset: 36, angle: 36, tierLabel: '20%' },
  { width: 84, height: 24, pivotY: 234, innerOffset: 42, angle: 29, tierLabel: '40%' },
  { width: 112, height: 26, pivotY: 190, innerOffset: 48, angle: 22, tierLabel: '60%' },
  { width: 140, height: 28, pivotY: 144, innerOffset: 54, angle: 15, tierLabel: '80%' },
  { width: 168, height: 30, pivotY: 92, innerOffset: 60, angle: 10, tierLabel: '100%' },
];

const LEFT_BARS: AlignedBar[] = WING_SPECS.map((s) => {
  const pivotX = CENTER_X - s.innerOffset;
  return {
    x: pivotX - s.width,
    y: s.pivotY - s.height / 2,
    width: s.width,
    height: s.height,
    rotate: s.angle,
    pivotX,
    pivotY: s.pivotY,
    tierLabel: s.tierLabel,
  };
});

const RIGHT_BARS: AlignedBar[] = WING_SPECS.map((s) => {
  const pivotX = CENTER_X + s.innerOffset;
  return {
    x: pivotX,
    y: s.pivotY - s.height / 2,
    width: s.width,
    height: s.height,
    rotate: -s.angle,
    pivotX,
    pivotY: s.pivotY,
    tierLabel: s.tierLabel,
  };
});

export const AsclepiusWingsHero: React.FC<AsclepiusWingsHeroProps> = ({
  biometrics,
  onUpdateBiometrics,
  wingSummary,
  isNight,
  onToggleNight,
  starsEarned,
  activePlanets,
  onGoToPlanets,
  onOpenChat,
  onSummonCheckIn,
  onOpenQuickRecipe,
}) => {
  const speedometerFillColor = (overallScore: number, side: 'mental' | 'physical') => {
    if (overallScore < 42) return '#FB7185';
    if (overallScore < 65) return '#FBBF24';
    return side === 'mental' ? '#38BDF8' : '#FACC15';
  };

  const healthWord = (score: number) =>
    score >= 75 ? 'Great' : score >= 50 ? 'Steady' : 'Needs Care';

  return (
    <section
      id="wings-hero"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-12"
    >
      {/* Clean Rounded Toolbar Card */}
      <div className="p-3.5 sm:px-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 mb-7">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-sky-900 dark:text-sky-200">
          <span className="font-mono-tabular font-semibold">
            Day {biometrics.flightDay} in Space
          </span>
          <span aria-hidden="true">·</span>
          <a
            href="https://nlsp.nasa.gov/resources/lsah"
            target="_blank"
            rel="noreferrer"
            className="hover:underline text-sky-800 dark:text-cyan-300"
          >
            NASA LSAH — Astronaut Health Baseline
          </a>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={onGoToPlanets}
            className="inline-flex items-center gap-1.5 font-mono-tabular font-bold text-orange-600 dark:text-amber-300 hover:underline cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-orange-500" aria-hidden="true" />
            <span>{starsEarned} Stars · {activePlanets}/8 Planets</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenQuickRecipe}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/70 text-orange-950 dark:text-amber-200 text-xs font-semibold border border-amber-300 dark:border-amber-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-amber-300" aria-hidden="true" />
            <span>Space Test Cards</span>
          </button>

          <button
            type="button"
            onClick={onSummonCheckIn}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-950 dark:text-sky-100 text-xs font-semibold border border-sky-300 dark:border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
            <span>Quick Task</span>
          </button>

          <button
            type="button"
            onClick={onToggleNight}
            aria-pressed={isNight}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-sky-950 dark:text-amber-200 text-xs font-semibold border border-sky-300 dark:border-indigo-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isNight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                <span>Day Sky</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-800" aria-hidden="true" />
                <span>Night Stars</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 3-Column Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Intro + Dr. Pisces Card */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-5 p-6 rounded-3xl bg-white/92 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-cyan-300">
              HealthWings · At-a-Glance Check
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-orange-bordered text-balance">
              Check Your Wings in Seconds
            </h1>
            <p className="text-sm leading-relaxed text-sky-900/90 dark:text-slate-300">
              Think of the two wings like a friendly speedometer: the fuller the bars light up from bottom to top, the healthier you are overall!
            </p>
          </div>

          {/* Rounded-rectangle Dr. Pisces card */}
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 flex items-center gap-3.5">
            <div className="shrink-0">
              <DrPiscesMascot size={104} mood={wingSummary.overallActivityScore < 55 ? 'alert' : 'happy'} />
            </div>
            <div className="flex flex-col gap-1.5 min-w-0">
              <p className="font-display text-lg font-bold text-orange-bordered-sm">
                Dr. Pisces
              </p>
              <p className="text-xs leading-relaxed text-sky-900 dark:text-slate-300">
                “Bloop! Tap me to talk about how you feel or pop up an easy light test recipe!”
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenChat()}
                  className="px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-orange-950 font-semibold text-xs border border-orange-500 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Talk to Pisces
                </button>
                <a
                  href="#body-systems"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-sky-800 dark:text-sky-200 hover:underline whitespace-nowrap"
                >
                  <span>Details</span>
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Symmetrically Aligned Winged Rod of Asclepius Speedometer */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-2 border-sky-300 dark:border-sky-800/80 shadow-sm flex flex-col justify-between">
          {/* At-a-Glance Speedometer Rounded Cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-2">
            <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-center">
              <div className="font-display text-sm sm:text-base font-bold text-orange-bordered-sm">
                Mental
              </div>
              <div className="font-mono-tabular text-lg font-bold text-sky-950 dark:text-sky-200">
                {wingSummary.mentalScore}%
              </div>
              <div className="text-[11px] font-semibold text-sky-700 dark:text-slate-400">
                {healthWord(wingSummary.mentalScore)}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-700 dark:text-amber-300">
                Overall
              </div>
              <div className="font-mono-tabular text-xl font-bold text-sky-950 dark:text-white">
                {wingSummary.overallActivityScore}%
              </div>
              <div className="text-[11px] font-semibold text-sky-800 dark:text-slate-300">
                Wing Gauge
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50/70 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-center">
              <div className="font-display text-sm sm:text-base font-bold text-orange-bordered-sm">
                Physical
              </div>
              <div className="font-mono-tabular text-lg font-bold text-sky-950 dark:text-amber-300">
                {wingSummary.physicalScore}%
              </div>
              <div className="text-[11px] font-semibold text-sky-700 dark:text-slate-400">
                {healthWord(wingSummary.physicalScore)}
              </div>
            </div>
          </div>

          {/* Perfectly Symmetrical Speedometer Wing SVG */}
          <svg
            viewBox="0 0 600 320"
            className="w-full h-auto overflow-visible my-1"
            role="img"
            aria-label={`HealthWings speedometer showing ${wingSummary.mentalScore}% Mental Health on the left wing and ${wingSummary.physicalScore}% Physical Health on the right wing`}
          >
            <defs>
              {LEFT_BARS.map((b, idx) => (
                <clipPath key={`cm-${idx}`} id={`hw-clip-m-${idx}`}>
                  <rect x={b.x} y={b.y} width={b.width} height={b.height} rx={8} />
                </clipPath>
              ))}
              {RIGHT_BARS.map((b, idx) => (
                <clipPath key={`cp-${idx}`} id={`hw-clip-p-${idx}`}>
                  <rect x={b.x} y={b.y} width={b.width} height={b.height} rx={8} />
                </clipPath>
              ))}
              <linearGradient id="hwScepter" x1="300" y1="54" x2="300" y2="294" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <linearGradient id="hwSnake" x1="270" y1="50" x2="330" y2="275" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>
            </defs>

            {/* Soft sunlit circle behind scepter */}
            <circle
              cx="300"
              cy="170"
              r="82"
              fill={isNight ? 'rgba(56,189,248,0.1)' : 'rgba(254, 240, 138, 0.5)'}
            />

            {/* LEFT SPEEDOMETER WING: Mental Health (5 aligned bars, bottom=20% to top=100%) */}
            {LEFT_BARS.map((b, idx) => {
              const segFill = wingSummary.mentalBars[idx];
              const fillW = (b.width * segFill) / 100;
              const fillColor = speedometerFillColor(wingSummary.mentalScore, 'mental');

              return (
                <g
                  key={`left-bar-${idx}`}
                  transform={`rotate(${b.rotate} ${b.pivotX} ${b.pivotY})`}
                  onClick={() =>
                    onOpenChat(
                      `My Mental Wing speedometer is at ${wingSummary.mentalScore}%. How can I boost it today?`
                    )
                  }
                  className="cursor-pointer"
                >
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.width}
                    height={b.height}
                    rx={8}
                    fill={isNight ? '#0F172A' : '#F8FAFC'}
                    stroke={isNight ? '#38BDF8' : '#0284C7'}
                    strokeWidth={2.5}
                  />
                  <g clipPath={`url(#hw-clip-m-${idx})`}>
                    <rect
                      x={b.x + (b.width - fillW)}
                      y={b.y}
                      width={fillW}
                      height={b.height}
                      fill={fillColor}
                      style={{ transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </g>
                  <text
                    x={b.x + b.width / 2}
                    y={b.y + b.height / 2 + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                    fill={isNight ? '#F8FAFC' : '#0C4A6E'}
                    opacity={segFill > 0 ? 0.95 : 0.45}
                  >
                    {b.tierLabel}
                  </text>
                </g>
              );
            })}

            {/* RIGHT SPEEDOMETER WING: Physical Health (5 aligned bars, mirror symmetric) */}
            {RIGHT_BARS.map((b, idx) => {
              const segFill = wingSummary.physicalBars[idx];
              const fillW = (b.width * segFill) / 100;
              const fillColor = speedometerFillColor(wingSummary.physicalScore, 'physical');

              return (
                <g
                  key={`right-bar-${idx}`}
                  transform={`rotate(${b.rotate} ${b.pivotX} ${b.pivotY})`}
                  onClick={() =>
                    onOpenChat(
                      `My Physical Wing speedometer is at ${wingSummary.physicalScore}%. What quick check should I do?`
                    )
                  }
                  className="cursor-pointer"
                >
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.width}
                    height={b.height}
                    rx={8}
                    fill={isNight ? '#0F172A' : '#F8FAFC'}
                    stroke={isNight ? '#FBBF24' : '#0284C7'}
                    strokeWidth={2.5}
                  />
                  <g clipPath={`url(#hw-clip-p-${idx})`}>
                    <rect
                      x={b.x}
                      y={b.y}
                      width={fillW}
                      height={b.height}
                      fill={fillColor}
                      style={{ transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </g>
                  <text
                    x={b.x + b.width / 2}
                    y={b.y + b.height / 2 + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                    fill={isNight ? '#F8FAFC' : '#0C4A6E'}
                    opacity={segFill > 0 ? 0.95 : 0.45}
                  >
                    {b.tierLabel}
                  </text>
                </g>
              );
            })}

            {/* CENTER ROD OF ASCLEPIUS */}
            <g>
              <line
                x1="300"
                y1="72"
                x2="300"
                y2="294"
                stroke="url(#hwScepter)"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <circle
                cx="300"
                cy="62"
                r="11"
                fill="#FDE047"
                stroke="#EA580C"
                strokeWidth="3"
              />
              <circle cx="296" cy="58" r="3" fill="#FFFFFF" opacity="0.85" />

              {/* Balanced symmetric snake coils around x=300 */}
              <path
                d="M302 276 C324 264, 324 238, 300 226 C272 212, 272 184, 300 172 C328 160, 328 130, 300 116 C274 102, 272 68, 294 52 C308 43, 322 50, 324 62"
                fill="none"
                stroke="#0F172A"
                strokeWidth="13.5"
                strokeLinecap="round"
              />
              <path
                d="M302 276 C324 264, 324 238, 300 226 C272 212, 272 184, 300 172 C328 160, 328 130, 300 116 C274 102, 272 68, 294 52 C308 43, 322 50, 324 62"
                fill="none"
                stroke="url(#hwSnake)"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <ellipse
                cx="326"
                cy="62"
                rx="9.5"
                ry="7"
                transform="rotate(14 326 62)"
                fill="#38BDF8"
                stroke="#0F172A"
                strokeWidth="2.4"
              />
              <circle cx="328" cy="60" r="1.9" fill="#0F172A" />
              <path
                d="M336 65 L343 67 M343 67 L347 64 M343 67 L346 71"
                stroke="#FB7185"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          </svg>

          <p className="text-center text-xs text-sky-800 dark:text-slate-400 mt-1">
            Each wing fills bottom-to-top from 20% to 100% like a speedometer. Tap a wing to ask Dr. Pisces!
          </p>
        </div>

        {/* Right: Rounded-Rectangle Live Check-In Card */}
        <div className="lg:col-span-3 p-5 rounded-3xl bg-white/92 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h2 className="font-display text-xl font-bold text-orange-bordered-sm">
                Daily Check-In
              </h2>
              <SlidersHorizontal className="w-4 h-4 text-sky-700 dark:text-sky-300" aria-hidden="true" />
            </div>
            <p className="text-xs text-sky-800 dark:text-slate-400 leading-relaxed">
              Slide your numbers below to watch both HealthWings gauges fill or dip live.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-sky-50/90 dark:bg-slate-800/70 border border-sky-200/80 dark:border-slate-700">
              <label className="block">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Mood Rating</span>
                  <span className="font-mono-tabular text-sky-700 dark:text-sky-300">
                    {biometrics.moodScore}/10
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={biometrics.moodScore}
                  onChange={(e) => onUpdateBiometrics({ moodScore: Number(e.target.value) })}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/90 dark:bg-slate-800/70 border border-sky-200/80 dark:border-slate-700">
              <label className="block">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Sleep Hours</span>
                  <span className="font-mono-tabular text-sky-700 dark:text-sky-300">
                    {biometrics.sleepHours.toFixed(1)} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min={3.5}
                  max={9.5}
                  step={0.1}
                  value={biometrics.sleepHours}
                  onChange={(e) => onUpdateBiometrics({ sleepHours: Number(e.target.value) })}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50/90 dark:bg-slate-800/70 border border-sky-200/80 dark:border-slate-700">
              <label className="block">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Daily Stress</span>
                  <span className="font-mono-tabular text-orange-600 dark:text-amber-300">
                    {biometrics.stressLevel}/10
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={biometrics.stressLevel}
                  onChange={(e) => onUpdateBiometrics({ stressLevel: Number(e.target.value) })}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-slate-800/70 border border-amber-200/90 dark:border-slate-700">
              <label className="block">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Space Workout</span>
                  <span className="font-mono-tabular text-amber-700 dark:text-amber-300">
                    {biometrics.exerciseMinutes} min
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={140}
                  step={5}
                  value={biometrics.exerciseMinutes}
                  onChange={(e) => onUpdateBiometrics({ exerciseMinutes: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-slate-800/70 border border-amber-200/90 dark:border-slate-700">
              <label className="block">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Heart Recovery (HRV)</span>
                  <span className="font-mono-tabular text-amber-700 dark:text-amber-300">
                    {biometrics.hrvRmssd} ms
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={90}
                  step={1}
                  value={biometrics.hrvRmssd}
                  onChange={(e) => onUpdateBiometrics({ hrvRmssd: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
