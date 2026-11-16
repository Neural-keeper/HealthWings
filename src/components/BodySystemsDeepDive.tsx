import React, { useMemo, useState } from 'react';
import {
  AstronautBiometrics,
  BenchmarkMetric,
  BodySystemId,
  BodySystemProfile,
  MissionPhase,
  ZERO_G_LIGHT_TESTS,
  buildBodySystems,
  getBenchmarkStatus,
} from '../data/lsahData';

interface BodySystemsDeepDiveProps {
  biometrics: AstronautBiometrics;
  onUpdateBiometrics: (patch: Partial<AstronautBiometrics>) => void;
  onOpenTestModal: (testId: string) => void;
}

const HealthyBenchmarkBar: React.FC<{ metric: BenchmarkMetric }> = ({ metric }) => {
  const status = getBenchmarkStatus(metric);
  const span = metric.scaleMax - metric.scaleMin;
  const healthyLeftPct = ((metric.healthyMin - metric.scaleMin) / span) * 100;
  const healthyWidthPct = ((metric.healthyMax - metric.healthyMin) / span) * 100;
  const currentPct = Math.max(
    2,
    Math.min(98, ((metric.currentValue - metric.scaleMin) / span) * 100)
  );

  const statusTone =
    status === 'Nominal'
      ? 'text-emerald-700 dark:text-emerald-300'
      : status === 'Watch'
      ? 'text-amber-700 dark:text-amber-300'
      : 'text-rose-700 dark:text-rose-300';

  const markerTone =
    status === 'Nominal'
      ? 'bg-emerald-500 border-white dark:border-slate-900'
      : status === 'Watch'
      ? 'bg-amber-500 border-white dark:border-slate-900'
      : 'bg-rose-500 border-white dark:border-slate-900';

  const statusGlyph = status === 'Nominal' ? '●' : status === 'Watch' ? '▲' : '✖';

  return (
    <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-800/60 border border-sky-200/80 dark:border-slate-700/80">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-sky-950 dark:text-white">
          {metric.label}
        </span>
        <div className="flex items-center gap-3 text-xs font-mono-tabular">
          <span className="font-bold text-sky-950 dark:text-white">
            You: {metric.currentValue} {metric.unit}
          </span>
          <span className={`font-semibold ${statusTone}`}>
            {statusGlyph} {status}
          </span>
        </div>
      </div>

      {/* Horizontal Scale with Healthy Adult Band + Astronaut Marker */}
      <div className="relative h-6 flex items-center my-2">
        {/* Track */}
        <div className="w-full h-2.5 rounded-full bg-sky-200/80 dark:bg-slate-700 relative overflow-hidden">
          {/* Healthy Adult Target Zone */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-300/75 dark:bg-emerald-500/45 border-x border-emerald-600/50"
            style={{
              left: `${Math.max(0, healthyLeftPct)}%`,
              width: `${Math.min(100, healthyWidthPct)}%`,
            }}
            title={`Healthy Adult Target: ${metric.healthyMin}–${metric.healthyMax} ${metric.unit}`}
          />
        </div>

        {/* Astronaut Current Position Pin */}
        <div
          className={`absolute w-4 h-4 rounded-full border-2 shadow-sm -translate-x-1/2 transition-all duration-300 ${markerTone}`}
          style={{ left: `${currentPct}%` }}
          aria-label={`Astronaut current reading ${metric.currentValue} ${metric.unit}`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-sky-800 dark:text-slate-400">
        <span className="font-mono-tabular">
          Healthy Adult Zone: {metric.healthyMin}–{metric.healthyMax} {metric.unit}
        </span>
        <span>{metric.lsahCohortNote}</span>
      </div>
    </div>
  );
};

const LongitudinalScatterPlot: React.FC<{
  system: BodySystemProfile;
  phaseFilter: 'All' | MissionPhase;
}> = ({ system, phaseFilter }) => {
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const points = useMemo(() => {
    if (phaseFilter === 'All') return system.scatterSeries;
    return system.scatterSeries.filter((p) => p.phase === phaseFilter);
  }, [system.scatterSeries, phaseFilter]);

  const width = 560;
  const height = 225;
  const padL = 44;
  const padR = 18;
  const padT = 18;
  const padB = 34;

  const primaryBenchmark = system.benchmarks[0];
  const minVal = primaryBenchmark.scaleMin;
  const maxVal = primaryBenchmark.scaleMax;

  const minDay = phaseFilter === 'Pre-Flight' ? -35 : phaseFilter === 'In-Flight' ? 0 : phaseFilter === 'Post-Flight' ? 180 : -35;
  const maxDay = phaseFilter === 'Pre-Flight' ? 0 : phaseFilter === 'In-Flight' ? 185 : 215;

  const mapX = (day: number) =>
    padL + ((day - minDay) / (maxDay - minDay || 1)) * (width - padL - padR);
  const mapY = (val: number) =>
    height - padB - ((val - minVal) / (maxVal - minVal || 1)) * (height - padT - padB);

  // Build healthy band rectangle
  const yHealthyTop = mapY(primaryBenchmark.healthyMax);
  const yHealthyBottom = mapY(primaryBenchmark.healthyMin);

  // Cohort mean trend path across filtered points
  const sortedPoints = [...points].sort((a, b) => a.flightDay - b.flightDay);
  const meanLinePath = sortedPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${mapX(pt.flightDay).toFixed(1)} ${mapY(pt.cohortMean).toFixed(1)}`)
    .join(' ');

  const hoveredPoint = points.find((p) => p.id === hoveredPointId) ?? null;

  return (
    <div className="relative rounded-2xl bg-white dark:bg-slate-950/70 border border-sky-200 dark:border-slate-800 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
        <span className="text-xs font-semibold text-sky-900 dark:text-slate-200">
          {primaryBenchmark.label} over Mission Timeline ({system.primaryUnit})
        </span>
        <span className="text-[11px] font-mono-tabular text-sky-700 dark:text-slate-400">
          Hover points for cohort stats
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto cursor-crosshair"
        role="img"
        aria-label={`Scatter plot of ${system.name} across mission days`}
      >
        {/* Healthy Adult Target Band */}
        <rect
          x={padL}
          y={yHealthyTop}
          width={width - padL - padR}
          height={Math.max(4, yHealthyBottom - yHealthyTop)}
          fill="rgba(16, 185, 129, 0.14)"
        />

        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const val = Math.round(minVal + t * (maxVal - minVal));
          const y = mapY(val);
          return (
            <g key={t}>
              <line
                x1={padL}
                y1={y}
                x2={width - padR}
                y2={y}
                stroke="currentColor"
                className="text-sky-200/80 dark:text-slate-800"
                strokeWidth="1"
              />
              <text
                x={padL - 6}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                className="fill-sky-800 dark:fill-slate-400"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* X-axis Launch FD-0 marker if visible */}
        {minDay <= 0 && maxDay >= 0 && (
          <line
            x1={mapX(0)}
            y1={padT}
            x2={mapX(0)}
            y2={height - padB}
            stroke="#0284C7"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            opacity="0.65"
          />
        )}

        {/* X-axis tick labels */}
        {[-30, 0, 60, 120, 180, 210]
          .filter((d) => d >= minDay && d <= maxDay)
          .map((d) => (
            <text
              key={d}
              x={mapX(d)}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              className="fill-sky-800 dark:fill-slate-400"
            >
              {d < 0 ? `L${d}` : d > 180 ? `R+${d - 180}` : `FD-${d}`}
            </text>
          ))}

        {/* NASA LSAH Cohort Mean Trend Line */}
        {sortedPoints.length > 1 && (
          <path
            d={meanLinePath}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="5 3"
            opacity="0.85"
          />
        )}

        {/* Crosshair guide on hover */}
        {hoveredPoint && (
          <g pointerEvents="none">
            <line
              x1={mapX(hoveredPoint.flightDay)}
              y1={padT}
              x2={mapX(hoveredPoint.flightDay)}
              y2={height - padB}
              stroke="#EA580C"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={padL}
              y1={mapY(hoveredPoint.value)}
              x2={width - padR}
              y2={mapY(hoveredPoint.value)}
              stroke="#EA580C"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </g>
        )}

        {/* Scatter points */}
        {sortedPoints.map((pt) => {
          const cx = mapX(pt.flightDay);
          const cy = mapY(pt.value);
          const isHovered = hoveredPointId === pt.id;
          return (
            <g
              key={pt.id}
              onMouseEnter={() => setHoveredPointId(pt.id)}
              onMouseLeave={() => setHoveredPointId(null)}
              className="cursor-pointer"
            >
              {pt.isCurrentCrew && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={11}
                  fill="rgba(249, 115, 22, 0.2)"
                  stroke="#EA580C"
                  strokeWidth="1.5"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={pt.isCurrentCrew ? 6 : isHovered ? 6.5 : 4.5}
                fill={
                  pt.isCurrentCrew
                    ? '#F97316'
                    : pt.phase === 'Pre-Flight'
                    ? '#60A5FA'
                    : pt.phase === 'Post-Flight'
                    ? '#34D399'
                    : '#FACC15'
                }
                stroke={isHovered ? '#0F172A' : '#FFFFFF'}
                strokeWidth={isHovered ? 2 : 1.5}
              />
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Footer */}
      <div className="mt-2 pt-2 border-t border-sky-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular min-h-[26px]">
        {hoveredPoint ? (
          <>
            <span className="font-semibold text-orange-600 dark:text-amber-300">
              {hoveredPoint.isCurrentCrew ? 'Live Crew Reading' : hoveredPoint.phase} · Day {hoveredPoint.flightDay}
            </span>
            <span className="text-sky-950 dark:text-slate-200">
              Value: {hoveredPoint.value} {system.primaryUnit} · Cohort Mean: {hoveredPoint.cohortMean}±{hoveredPoint.cohortSd} (N={hoveredPoint.cohortN})
            </span>
          </>
        ) : (
          <>
            <span className="text-sky-700 dark:text-slate-400">
              Green band = Healthy Adult Zone · Dashed = NASA LSAH Cohort Mean
            </span>
            <span className="text-orange-600 dark:text-amber-300">
              Orange ring = Your live FD-{system.scatterSeries.find((p) => p.isCurrentCrew)?.flightDay} point
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export const BodySystemsDeepDive: React.FC<BodySystemsDeepDiveProps> = ({
  biometrics,
  onUpdateBiometrics,
  onOpenTestModal,
}) => {
  const [phaseFilter, setPhaseFilter] = useState<'All' | MissionPhase>('All');
  const systems = useMemo(() => buildBodySystems(biometrics), [biometrics]);

  const renderSystemControl = (systemId: BodySystemId) => {
    switch (systemId) {
      case 'immune':
        return (
          <label className="block text-xs">
            <div className="flex justify-between font-semibold mb-1">
              <span>Simulate NK-Cell Cytotoxicity</span>
              <span className="font-mono-tabular">{biometrics.nkCellActivity}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={62}
              value={biometrics.nkCellActivity}
              onChange={(e) => onUpdateBiometrics({ nkCellActivity: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </label>
        );
      case 'metabolism':
        return (
          <label className="block text-xs">
            <div className="flex justify-between font-semibold mb-1">
              <span>Simulate 25-OH Vitamin D</span>
              <span className="font-mono-tabular">{biometrics.vitaminD} ng/mL</span>
            </div>
            <input
              type="range"
              min={14}
              max={58}
              value={biometrics.vitaminD}
              onChange={(e) => onUpdateBiometrics({ vitaminD: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </label>
        );
      case 'mental':
        return (
          <label className="block text-xs">
            <div className="flex justify-between font-semibold mb-1">
              <span>Simulate Sleep Duration</span>
              <span className="font-mono-tabular">{biometrics.sleepHours.toFixed(1)} hrs</span>
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
        );
      case 'circulation':
        return (
          <label className="block text-xs">
            <div className="flex justify-between font-semibold mb-1">
              <span>Simulate Resting Heart Rate</span>
              <span className="font-mono-tabular">{biometrics.restingHr} bpm</span>
            </div>
            <input
              type="range"
              min={48}
              max={98}
              value={biometrics.restingHr}
              onChange={(e) => onUpdateBiometrics({ restingHr: Number(e.target.value) })}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </label>
        );
      case 'neuro_ocular':
        return (
          <label className="block text-xs">
            <div className="flex justify-between font-semibold mb-1">
              <span>Simulate Choroidal Thickness Shift</span>
              <span className="font-mono-tabular">+{biometrics.choroidalDeltaUm} μm</span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={biometrics.choroidalDeltaUm}
              onChange={(e) => onUpdateBiometrics({ choroidalDeltaUm: Number(e.target.value) })}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </label>
        );
    }
  };

  return (
    <section
      id="body-systems"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12"
    >
      {/* Header + Phase Filter Tabs */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-cyan-300 mb-1">
            Scroll Deep-Dive · Dynamic Scatter Plots &amp; Healthy Adult Benchmarks
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-orange-bordered text-balance">
            Body Systems Longitudinal Telemetry
          </h2>
        </div>

        <div
          role="group"
          aria-label="Mission phase filter"
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-sky-100 dark:bg-slate-900 border border-sky-200 dark:border-slate-800"
        >
          {(['All', 'Pre-Flight', 'In-Flight', 'Post-Flight'] as const).map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setPhaseFilter(phase)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                phaseFilter === phase
                  ? 'bg-amber-300 text-orange-950 border border-orange-500'
                  : 'text-sky-900 dark:text-slate-300 hover:bg-sky-200/70 dark:hover:bg-slate-800'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      {/* Stacked Progressive Detail Sections for All 5 Body Systems */}
      <div className="space-y-8">
        {systems.map((sys, idx) => {
          const test = ZERO_G_LIGHT_TESTS.find((t) => t.id === sys.recommendedTestId);
          return (
            <article
              key={sys.id}
              className="p-5 sm:p-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5 pb-4 border-b border-sky-100 dark:border-slate-800">
                <div className="max-w-2xl">
                  <div className="text-xs font-semibold text-sky-700 dark:text-cyan-300">
                    0{idx + 1}. {sys.wingSide === 'mental' ? 'Left Wing · Mental Health' : 'Right Wing · Physical Health'} · {sys.lsahStudyRef}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-orange-bordered-sm mt-1">
                    {sys.name}
                  </h3>
                  <p className="text-sm text-sky-900/90 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {sys.summary}
                  </p>
                </div>

                {test && (
                  <button
                    type="button"
                    onClick={() => onOpenTestModal(test.id)}
                    className="px-4 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-950 dark:text-sky-100 text-xs font-semibold border border-sky-300 dark:border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Open {test.name}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 6 cols: Healthy Adult Benchmark Bars + Interactive Telemetry Simulator */}
                <div className="lg:col-span-6 space-y-4">
                  {sys.benchmarks.map((m) => (
                    <HealthyBenchmarkBar key={m.id} metric={m} />
                  ))}

                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/40 border border-amber-200 dark:border-slate-700">
                    {renderSystemControl(sys.id)}
                  </div>
                </div>

                {/* Right 6 cols: Dynamic Scatter Plot over Time */}
                <div className="lg:col-span-6">
                  <LongitudinalScatterPlot system={sys} phaseFilter={phaseFilter} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
