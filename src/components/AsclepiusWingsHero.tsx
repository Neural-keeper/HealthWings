import React, { useState } from 'react';
import { Moon, Sun, Sparkles, SlidersHorizontal, ArrowDown } from 'lucide-react';
import { AstronautBiometrics, WingBarMetric } from '../data/lsahData';
import { DrPiscesMascot } from './DrPiscesMascot';

interface AsclepiusWingsHeroProps {
  biometrics: AstronautBiometrics;
  onUpdateBiometrics: (patch: Partial<AstronautBiometrics>) => void;
  mentalWing: WingBarMetric[];
  physicalWing: WingBarMetric[];
  overallActivityScore: number;
  isNight: boolean;
  onToggleNight: () => void;
  starsEarned: number;
  activePlanets: number;
  onOpenChat: (initialPrompt?: string) => void;
  onSummonCheckIn: () => void;
}

interface BarGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
}

// Left wing (Mental) 5 angled rectangles fanning bottom-inner to top-outer (matching sketch)
const LEFT_WING_GEOM: BarGeometry[] = [
  { x: 204, y: 244, width: 42, height: 22, rotate: 38 },
  { x: 162, y: 204, width: 66, height: 25, rotate: 24 },
  { x: 120, y: 158, width: 92, height: 29, rotate: 12 },
  { x: 86, y: 108, width: 118, height: 32, rotate: -6 },
  { x: 64, y: 54, width: 142, height: 35, rotate: 5 },
];

// Right wing (Physical) 5 angled rectangles mirrored symmetrically across x=290
const RIGHT_WING_GEOM: BarGeometry[] = LEFT_WING_GEOM.map((g) => ({
  x: 580 - g.x - g.width,
  y: g.y,
  width: g.width,
  height: g.height,
  rotate: -g.rotate,
}));

export const AsclepiusWingsHero: React.FC<AsclepiusWingsHeroProps> = ({
  biometrics,
  onUpdateBiometrics,
  mentalWing,
  physicalWing,
  overallActivityScore,
  isNight,
  onToggleNight,
  starsEarned,
  activePlanets,
  onOpenChat,
  onSummonCheckIn,
}) => {
  const [hoveredBar, setHoveredBar] = useState<{
    side: 'Mental' | 'Physical';
    metric: WingBarMetric;
  } | null>(null);

  const mentalAvg = Math.round(
    mentalWing.reduce((sum, b) => sum + b.score, 0) / mentalWing.length
  );
  const physicalAvg = Math.round(
    physicalWing.reduce((sum, b) => sum + b.score, 0) / physicalWing.length
  );

  const barFillColor = (score: number, side: 'mental' | 'physical') => {
    if (score < 45) return '#FB7185'; // soft coral critical
    if (score < 70) return '#FBBF24'; // sunny amber watch
    return side === 'mental' ? '#38BDF8' : '#FACC15';
  };

  return (
    <section
      id="wings-hero"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-12"
    >
      {/* Hero Control & Mission Toolbar (lives below Top Bar per layout contract) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-sky-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-sky-900 dark:text-sky-200">
          <span className="font-mono-tabular font-semibold">
            Flight Day {biometrics.flightDay} / 180
          </span>
          <span aria-hidden="true">·</span>
          <span>NASA LSAH Baseline Cohort</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular font-semibold text-orange-600 dark:text-amber-300">
            {starsEarned} Stars · {activePlanets}/8 Planets
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onSummonCheckIn}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-950 dark:text-sky-100 text-xs font-semibold border border-sky-300 dark:border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
            <span>Critical Check-In</span>
          </button>

          <button
            type="button"
            onClick={onToggleNight}
            aria-pressed={isNight}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-sky-950 dark:text-amber-200 text-xs font-semibold border border-amber-300 dark:border-indigo-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isNight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                <span>Day Cabin Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-800" aria-hidden="true" />
                <span>Bioluminescent Night</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Hero Grid: Left Mascot + Center Winged Asclepius + Right Mood & Biometric Survey */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Title + Dr. Pisces Mascot */}
        <div className="lg:col-span-4 flex flex-col items-start gap-4">
          <p className="text-xs font-semibold tracking-wider uppercase text-sky-700 dark:text-cyan-300">
            Orbital Biometric & Mood Monitor
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-orange-bordered text-balance">
            Healthy Wings in Zero Gravity
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-sky-900/90 dark:text-slate-300 max-w-md">
            Your left wing tracks Mental readiness and your right wing tracks Physical biomarkers against NASA LSAH astronaut baselines. Chat with Dr. Pisces anytime for light-based space tests.
          </p>

          {/* Dr. Pisces interactive card */}
          <div className="w-full mt-2 p-4 rounded-2xl bg-sky-100/80 dark:bg-slate-900/85 border border-sky-300 dark:border-slate-700 flex items-center gap-4">
            <div className="shrink-0">
              <DrPiscesMascot size={102} mood={overallActivityScore < 60 ? 'alert' : 'happy'} />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <p className="font-display text-lg font-bold text-orange-bordered-sm">
                Dr. Pisces
              </p>
              <p className="text-xs leading-relaxed text-sky-900 dark:text-slate-300">
                “Bloop! Tap me to report symptoms or get a quick light-based zero-G check.”
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenChat()}
                  className="px-3 py-1.5 rounded-lg bg-amber-300 hover:bg-amber-400 text-orange-950 font-semibold text-xs border border-orange-500 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Chat with Pisces
                </button>
                <a
                  href="#body-systems"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-sky-800 dark:text-sky-200 hover:underline whitespace-nowrap"
                >
                  <span>Deep Dive</span>
                  <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Winged Rod of Asclepius SVG (5 Mental left bars + Snake Scepter + 5 Physical right bars) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-sky-100/90 to-amber-50/90 dark:from-slate-900/90 dark:to-slate-900/75 border-2 border-sky-300 dark:border-sky-800/70 shadow-sm">
            {/* Wing Score Header */}
            <div className="flex items-center justify-between gap-4 mb-2 px-1">
              <div className="text-left">
                <div className="font-display text-lg font-bold text-orange-bordered-sm">
                  Mental Wing
                </div>
                <div className="font-mono-tabular text-xs font-semibold text-sky-800 dark:text-sky-300">
                  {mentalAvg}% Readiness
                </div>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-700 dark:text-amber-300">
                  Combined Index
                </div>
                <div className="font-mono-tabular text-xl font-bold text-sky-950 dark:text-white">
                  {overallActivityScore}%
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-bold text-orange-bordered-sm">
                  Physical Wing
                </div>
                <div className="font-mono-tabular text-xs font-semibold text-sky-800 dark:text-amber-300">
                  {physicalAvg}% Readiness
                </div>
              </div>
            </div>

            {/* Interactive SVG Emblem matching sketch */}
            <svg
              viewBox="0 0 580 325"
              className="w-full h-auto overflow-visible"
              role="img"
              aria-label="Rod of Asclepius flanked by 5 mental health wing bars on the left and 5 physical health wing bars on the right"
            >
              <defs>
                {/* Clip paths for each Mental Wing bar */}
                {LEFT_WING_GEOM.map((g, idx) => (
                  <clipPath key={`clip-m-${idx}`} id={`clip-mental-${idx}`}>
                    <rect
                      x={g.x}
                      y={g.y}
                      width={g.width}
                      height={g.height}
                      rx={7}
                    />
                  </clipPath>
                ))}
                {/* Clip paths for each Physical Wing bar */}
                {RIGHT_WING_GEOM.map((g, idx) => (
                  <clipPath key={`clip-p-${idx}`} id={`clip-physical-${idx}`}>
                    <rect
                      x={g.x}
                      y={g.y}
                      width={g.width}
                      height={g.height}
                      rx={7}
                    />
                  </clipPath>
                ))}
                <linearGradient id="scepterGold" x1="290" y1="62" x2="290" y2="298" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
                <linearGradient id="snakeAqua" x1="250" y1="55" x2="330" y2="270" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0D9488" />
                </linearGradient>
              </defs>

              {/* Soft pastel halo behind the scepter */}
              <circle
                cx="290"
                cy="168"
                r="76"
                fill={isNight ? 'rgba(56,189,248,0.10)' : 'rgba(254,240,138,0.55)'}
              />

              {/* LEFT WING: 5 Mental Health Bars (bottom small -> top wide, filling right-to-left outward) */}
              {LEFT_WING_GEOM.map((g, idx) => {
                const metric = mentalWing[idx];
                const fillW = (g.width * metric.score) / 100;
                const cx = g.x + g.width / 2;
                const cy = g.y + g.height / 2;
                const isSelected = hoveredBar?.metric.id === metric.id;

                return (
                  <g
                    key={metric.id}
                    transform={`rotate(${g.rotate} ${cx} ${cy})`}
                    onMouseEnter={() => setHoveredBar({ side: 'Mental', metric })}
                    onMouseLeave={() => setHoveredBar(null)}
                    onClick={() =>
                      onOpenChat(
                        `Check my Mental Wing bar "${metric.label}" which is currently at ${metric.score}% (${metric.detail}).`
                      )
                    }
                    className="cursor-pointer"
                  >
                    {/* Empty container track */}
                    <rect
                      x={g.x}
                      y={g.y}
                      width={g.width}
                      height={g.height}
                      rx={7}
                      fill={isNight ? '#0F172A' : '#FFFFFF'}
                      stroke={isSelected ? '#EA580C' : isNight ? '#38BDF8' : '#0284C7'}
                      strokeWidth={isSelected ? 3 : 2.4}
                    />
                    {/* Dynamic fill growing outward from center scepter toward wing tip */}
                    <g clipPath={`url(#clip-mental-${idx})`}>
                      <rect
                        x={g.x + (g.width - fillW)}
                        y={g.y}
                        width={fillW}
                        height={g.height}
                        fill={barFillColor(metric.score, 'mental')}
                        style={{ transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                      />
                    </g>
                    {/* Percentage readout centered cleanly */}
                    <text
                      x={g.x + g.width / 2}
                      y={g.y + g.height / 2 + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="JetBrains Mono, monospace"
                      fill={isNight ? '#F8FAFC' : '#0C4A6E'}
                    >
                      {metric.score}%
                    </text>
                  </g>
                );
              })}

              {/* RIGHT WING: 5 Physical Health Bars (bottom small -> top wide, filling left-to-right outward) */}
              {RIGHT_WING_GEOM.map((g, idx) => {
                const metric = physicalWing[idx];
                const fillW = (g.width * metric.score) / 100;
                const cx = g.x + g.width / 2;
                const cy = g.y + g.height / 2;
                const isSelected = hoveredBar?.metric.id === metric.id;

                return (
                  <g
                    key={metric.id}
                    transform={`rotate(${g.rotate} ${cx} ${cy})`}
                    onMouseEnter={() => setHoveredBar({ side: 'Physical', metric })}
                    onMouseLeave={() => setHoveredBar(null)}
                    onClick={() =>
                      onOpenChat(
                        `Check my Physical Wing bar "${metric.label}" which is currently at ${metric.score}% (${metric.detail}).`
                      )
                    }
                    className="cursor-pointer"
                  >
                    <rect
                      x={g.x}
                      y={g.y}
                      width={g.width}
                      height={g.height}
                      rx={7}
                      fill={isNight ? '#0F172A' : '#FFFFFF'}
                      stroke={isSelected ? '#EA580C' : isNight ? '#FBBF24' : '#0284C7'}
                      strokeWidth={isSelected ? 3 : 2.4}
                    />
                    <g clipPath={`url(#clip-physical-${idx})`}>
                      <rect
                        x={g.x}
                        y={g.y}
                        width={fillW}
                        height={g.height}
                        fill={barFillColor(metric.score, 'physical')}
                        style={{ transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                      />
                    </g>
                    <text
                      x={g.x + g.width / 2}
                      y={g.y + g.height / 2 + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="JetBrains Mono, monospace"
                      fill={isNight ? '#F8FAFC' : '#0C4A6E'}
                    >
                      {metric.score}%
                    </text>
                  </g>
                );
              })}

              {/* CENTER ROD OF ASCLEPIUS: Scepter + Coiled Snake */}
              <g>
                {/* Vertical Staff / Scepter */}
                <line
                  x1="290"
                  y1="82"
                  x2="290"
                  y2="296"
                  stroke="url(#scepterGold)"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <line
                  x1="290"
                  y1="82"
                  x2="290"
                  y2="296"
                  stroke="#9A3412"
                  strokeWidth="1.5"
                  strokeDasharray="2 10"
                  opacity="0.45"
                />
                {/* Scepter Top Finial Orb */}
                <circle
                  cx="290"
                  cy="74"
                  r="11"
                  fill="#FDE047"
                  stroke="#EA580C"
                  strokeWidth="3"
                />
                <circle cx="286" cy="70" r="3" fill="#FFFFFF" opacity="0.85" />

                {/* Coiled Snake body wrapping around the scepter (matching sketch S-loops) */}
                <path
                  d="M294 276 C318 264, 318 238, 290 228 C258 216, 256 184, 290 172 C324 160, 326 126, 290 112 C256 98, 254 58, 286 52 C302 49, 315 57, 316 68"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M294 276 C318 264, 318 238, 290 228 C258 216, 256 184, 290 172 C324 160, 326 126, 290 112 C256 98, 254 58, 286 52 C302 49, 315 57, 316 68"
                  fill="none"
                  stroke="url(#snakeAqua)"
                  strokeWidth="9.5"
                  strokeLinecap="round"
                />
                {/* Friendly Snake Head peeking over scepter top */}
                <ellipse
                  cx="317"
                  cy="68"
                  rx="10"
                  ry="7.5"
                  transform="rotate(14 317 68)"
                  fill="#38BDF8"
                  stroke="#0F172A"
                  strokeWidth="2.5"
                />
                <circle cx="319" cy="66" r="2" fill="#0F172A" />
                {/* Cute forked tongue */}
                <path
                  d="M327 71 L334 73 M334 73 L338 70 M334 73 L337 77"
                  stroke="#FB7185"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            </svg>

            {/* Live Wing Bar Inspector Strip */}
            <div className="mt-2 pt-3 border-t border-sky-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs min-h-[38px]">
              {hoveredBar ? (
                <>
                  <span className="font-semibold text-sky-950 dark:text-white">
                    {hoveredBar.side} · {hoveredBar.metric.label}
                  </span>
                  <span className="font-mono-tabular text-sky-800 dark:text-sky-200">
                    {hoveredBar.metric.score}% · {hoveredBar.metric.detail} · {hoveredBar.metric.status}
                  </span>
                </>
              ) : (
                <span className="text-sky-800/80 dark:text-slate-400">
                  Hover or tap any of the 10 wing bars to inspect or ask Dr. Pisces about that metric.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Biometric & Mood Survey Panel */}
        <div className="lg:col-span-3 p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-orange-bordered-sm">
              Live Survey & Vitals
            </h2>
            <SlidersHorizontal className="w-4 h-4 text-sky-700 dark:text-sky-300" aria-hidden="true" />
          </div>
          <p className="text-xs text-sky-800/85 dark:text-slate-400 leading-relaxed">
            Adjust your daily mood check-in and biometric readings to dynamically update both Health Wings.
          </p>

          <div className="space-y-3.5">
            <label className="block">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Mood Survey (Mental)</span>
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

            <label className="block">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Sleep Cycle (Mental)</span>
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

            <label className="block">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Stress Strain (Mental)</span>
                <span className="font-mono-tabular text-sky-700 dark:text-sky-300">
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

            <label className="block">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>ARED Exercise (Physical)</span>
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

            <label className="block">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>HRV RMSSD (Physical)</span>
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
    </section>
  );
};
