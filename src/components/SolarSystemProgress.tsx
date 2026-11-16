import React, { useState } from 'react';
import { Star, RotateCcw, TrendingDown, Sparkles, ArrowLeft } from 'lucide-react';
import { PlanetMilestone, SOLAR_SYSTEM_PLANETS } from '../data/lsahData';

interface SolarSystemProgressProps {
  starsEarned: number;
  activePlanets: number;
  planetPenalty: number;
  overallActivityScore: number;
  onSimulateActivityDrop: () => void;
  onRecoverMetrics: () => void;
  onLaunchTaskForStar: () => void;
  onBackHome: () => void;
}

export const SolarSystemProgress: React.FC<SolarSystemProgressProps> = ({
  starsEarned,
  activePlanets,
  planetPenalty,
  overallActivityScore,
  onSimulateActivityDrop,
  onRecoverMetrics,
  onLaunchTaskForStar,
  onBackHome,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetMilestone>(
    SOLAR_SYSTEM_PLANETS[Math.max(0, Math.min(7, activePlanets - 1))]
  );

  return (
    <section
      id="solar-system"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-20"
    >
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 text-xs font-semibold text-sky-900 dark:text-sky-200 hover:border-sky-400 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to HealthWings</span>
        </button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-cyan-300 mb-1">
            Star &amp; Planet Progression · Unlock All 8 Planets
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-orange-bordered text-balance">
            Your Healthy Solar System
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onLaunchTaskForStar}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-300 hover:bg-amber-400 text-orange-950 font-display font-semibold text-xs border-2 border-orange-500 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Star className="w-4 h-4 text-orange-700 fill-orange-500" aria-hidden="true" />
            <span>Complete Task for +1 Star</span>
          </button>

          <button
            type="button"
            onClick={onSimulateActivityDrop}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-950 dark:text-slate-200 text-xs font-semibold border border-sky-300 dark:border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
            <span>Test Activity Drop</span>
          </button>

          {planetPenalty > 0 && (
            <button
              type="button"
              onClick={onRecoverMetrics}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-semibold border border-emerald-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Restore Healthy Wings</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 7 cols: Interactive Orbital Solar System */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-slate-950 text-white border-2 border-sky-400/50 dark:border-cyan-500/40 shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="flex flex-wrap items-center justify-between gap-3 z-10 mb-3">
            <div className="flex items-center gap-3 font-mono-tabular text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-300">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" aria-hidden="true" />
                {starsEarned} Stars Collected
              </span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-cyan-300 font-semibold">
                {activePlanets} / 8 Planets in Orbit
              </span>
            </div>
            <div className="text-xs font-mono-tabular text-slate-300">
              Wing Gauge: {overallActivityScore}%
              {planetPenalty > 0 && (
                <span className="text-rose-300 ml-2">
                  (-{planetPenalty} drifted away)
                </span>
              )}
            </div>
          </div>

          <div className="w-full flex items-center justify-center py-2">
            <svg
              viewBox="0 0 600 580"
              className="w-full max-w-[540px] h-auto"
              role="img"
              aria-label={`Solar system showing ${activePlanets} of 8 planets orbiting the Sun`}
            >
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="55%" stopColor="#FACC15" />
                  <stop offset="100%" stopColor="#EA580C" />
                </radialGradient>
              </defs>

              {[
                [42, 60], [115, 42], [490, 52], [548, 128], [66, 480], [520, 510], [220, 35], [390, 540],
              ].map(([sx, sy], i) => (
                <circle key={i} cx={sx} cy={sy} r={1.6} fill="#A5F3FC" opacity={0.6} />
              ))}

              <circle cx="300" cy="290" r="36" fill="rgba(251, 191, 36, 0.2)" />
              <circle cx="300" cy="290" r="24" fill="url(#sunGlow)" />

              {SOLAR_SYSTEM_PLANETS.map((planet) => {
                const isUnlocked = planet.index <= activePlanets;
                const angleRad = ((planet.index * 52 + starsEarned * 19) * Math.PI) / 180;
                const px = 300 + Math.cos(angleRad) * planet.orbitRadiusPx;
                const py = 290 + Math.sin(angleRad) * planet.orbitRadiusPx;
                const isSelected = selectedPlanet.index === planet.index;

                return (
                  <g
                    key={planet.name}
                    onClick={() => setSelectedPlanet(planet)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx="300"
                      cy="290"
                      r={planet.orbitRadiusPx}
                      fill="none"
                      stroke={isUnlocked ? 'rgba(125, 211, 252, 0.34)' : 'rgba(148, 163, 184, 0.14)'}
                      strokeWidth={isSelected ? 1.8 : 1}
                      strokeDasharray={isUnlocked ? undefined : '4 5'}
                    />

                    {isUnlocked ? (
                      <g>
                        {isSelected && (
                          <circle
                            cx={px}
                            cy={py}
                            r={planet.radiusPx + 7}
                            fill="none"
                            stroke="#FDE047"
                            strokeWidth="2"
                          />
                        )}
                        {planet.ring && (
                          <ellipse
                            cx={px}
                            cy={py}
                            rx={planet.radiusPx * 1.85}
                            ry={planet.radiusPx * 0.52}
                            transform={`rotate(-20 ${px} ${py})`}
                            fill="none"
                            stroke="#FDE68A"
                            strokeWidth="3"
                            opacity="0.85"
                          />
                        )}
                        <circle
                          cx={px}
                          cy={py}
                          r={planet.radiusPx}
                          fill={planet.color}
                          stroke="#0F172A"
                          strokeWidth="1.5"
                        />
                        <text
                          x={px}
                          y={py + planet.radiusPx + 13}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          fill="#E0F2FE"
                        >
                          {planet.name}
                        </text>
                      </g>
                    ) : (
                      <g opacity="0.45">
                        <circle
                          cx={px}
                          cy={py}
                          r={planet.radiusPx}
                          fill="none"
                          stroke="#64748B"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={px}
                          y={py + planet.radiusPx + 12}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#94A3B8"
                        >
                          {planet.name} ({planet.starsRequired}★)
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right 5 cols: Rounded Planet Cards */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-sky-700 dark:text-cyan-300">
                Planet {selectedPlanet.index} of 8 · Needs {selectedPlanet.starsRequired} Stars
              </span>
              <span className="font-mono-tabular text-xs font-bold text-orange-600 dark:text-amber-300">
                {selectedPlanet.index <= activePlanets ? 'In Orbit' : 'Waiting / Drifted'}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-orange-bordered-sm">
              {selectedPlanet.name} — {selectedPlanet.healthBadge}
            </h2>
            <p className="text-sm text-sky-900/90 dark:text-slate-300 mt-2 leading-relaxed">
              {selectedPlanet.description}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-sky-50 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700 text-xs text-sky-800 dark:text-slate-300 leading-relaxed">
              <strong className="text-sky-950 dark:text-white">How Planets Work:</strong>{' '}
              Complete Dr. Pisces tasks and Space Test cards to earn Stars toward all 8 planets. If your overall Wing Gauge drops below 64%, 52%, or 38%, planets drift away until your activity and rest recover.
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-display text-lg font-bold text-sky-950 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" aria-hidden="true" />
              <span>All 8 Planet Milestones</span>
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {SOLAR_SYSTEM_PLANETS.map((planet) => {
                const active = planet.index <= activePlanets;
                const selected = selectedPlanet.index === planet.index;
                return (
                  <button
                    key={planet.name}
                    type="button"
                    onClick={() => setSelectedPlanet(planet)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-orange-500 bg-amber-50 dark:bg-amber-950/40'
                        : active
                        ? 'border-sky-200 dark:border-slate-700 bg-sky-50/80 dark:bg-slate-800/70'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-65'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-sky-950 dark:text-white flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: active ? planet.color : '#94A3B8' }}
                        />
                        {planet.name}
                      </span>
                      <span className="font-mono-tabular text-[11px] font-semibold text-sky-700 dark:text-slate-300">
                        {planet.starsRequired}★
                      </span>
                    </div>
                    <div className="text-[11px] text-sky-800/85 dark:text-slate-400 truncate mt-0.5">
                      {planet.healthBadge}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 pt-2.5 border-t border-sky-100 dark:border-slate-800 text-[11px] text-sky-800 dark:text-slate-400 leading-relaxed">
              Data Citation:{' '}
              <a
                href="https://science.nasa.gov/solar-system/planets/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sky-700 dark:text-cyan-300 hover:underline"
              >
                NASA Science — Eight-Planet Orbital Reference
              </a>{' '}
              &amp;{' '}
              <a
                href="https://nlsp.nasa.gov/resources/lsah"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sky-700 dark:text-cyan-300 hover:underline"
              >
                NASA LSAH — Activity Baseline
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
