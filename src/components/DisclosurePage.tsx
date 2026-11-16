import React from 'react';
import { ShieldCheck, Database, Cpu, Code2, ExternalLink, ArrowLeft } from 'lucide-react';

interface DisclosurePageProps {
  onBackHome: () => void;
}

interface CitationItem {
  category: 'Dataset' | 'Website' | 'Code & AI';
  sourceName: string;
  dataName: string;
  url: string;
  notes: string;
}

const CITATIONS: CitationItem[] = [
  {
    category: 'Dataset',
    sourceName: 'NASA Lifetime Surveillance of Astronaut Health (LSAH)',
    dataName: 'Long-Duration Spaceflight Crew Physiological & Behavioral Reference Curves (NK-Cell, Vitamin D, Sleep, HRV, SANS)',
    url: 'https://nlsp.nasa.gov/resources/lsah',
    notes: 'Used to calibrate healthy adult bounds, cohort mean trajectories, and longitudinal scatter plots.',
  },
  {
    category: 'Website',
    sourceName: 'NASA Space Apps Challenge 2026',
    dataName: 'Health Monitoring Software Challenge Brief & Official Resources Tab',
    url: 'https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/?tab=resources',
    notes: 'Provides challenge scope, autonomous deep-space monitoring guidance, and synthetic/simulated sample telemetry standards.',
  },
  {
    category: 'Dataset',
    sourceName: 'NASA Human Research Program (HRP)',
    dataName: 'Human Health Countermeasures — SANS Ocular Shift, Circadian Sleep & Cardiovascular Deconditioning Risks',
    url: 'https://www.nasa.gov/hrp/',
    notes: 'Used for risk factor weights in the symptom pattern helper and zero-gravity Space Test card selection.',
  },
  {
    category: 'Dataset',
    sourceName: 'NASA Open Science Data Repository (OSDR) & LSDA',
    dataName: 'Spaceflight Biomedical, Nutritional Biochemistry & Immune Dysregulation Mission Studies',
    url: 'https://osdr.nasa.gov/',
    notes: 'Informs Vitamin D, bone turnover (NTx), and immune recovery expectations before, during, and after flight.',
  },
  {
    category: 'Website',
    sourceName: 'NASA Science — Solar System Exploration',
    dataName: 'Eight-Planet Orbital Order & Planetary Reference Profiles (Mercury to Neptune)',
    url: 'https://science.nasa.gov/solar-system/planets/',
    notes: 'Used for the 8-planet progression milestones and planetary visual styling on the Planets page.',
  },
  {
    category: 'Code & AI',
    sourceName: 'Google Gemini API (@google/genai · gemini-4-hydrogen)',
    dataName: 'Dr. Pisces Server-Side Conversational Health Triage (server.ts)',
    url: 'https://ai.google.dev/gemini-api/docs',
    notes: 'Powers Dr. Pisces natural-language Q&A and structured Space Test card recommendations.',
  },
  {
    category: 'Code & AI',
    sourceName: 'HealthWings Logistic Classifier (src/lib/mlClassifier.ts)',
    dataName: 'Custom TypeScript Multi-Feature Z-Score & Sigmoid Risk Scoring Engine',
    url: 'https://www.typescriptlang.org/',
    notes: 'Runs locally and on the Express backend (/api/ml/analyze) to rank attention areas and pick the top critical metric.',
  },
  {
    category: 'Code & AI',
    sourceName: 'Firebase Authentication & Cloud Firestore',
    dataName: 'Google Account Sign-In & Private Crew Profile Storage (src/lib/firebase.ts, firestore.rules)',
    url: 'https://firebase.google.com/docs',
    notes: 'Stores your personal HealthWings callsign, slider snapshots, stars, and Space Test logs privately per user ID.',
  },
  {
    category: 'Code & AI',
    sourceName: 'React 19, Vite, Express, Tailwind CSS v4, Lucide Icons & Google Fonts',
    dataName: 'Open-Source Web Application Stack (Fredoka, Plus Jakarta Sans, JetBrains Mono)',
    url: 'https://react.dev/',
    notes: 'Powers the responsive UI, interactive SVG wings/charts, and accessible day/night sky themes.',
  },
];

export const DisclosurePage: React.FC<DisclosurePageProps> = ({ onBackHome }) => {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-16">
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

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-cyan-300 mb-1">
          Transparency · Full Citations &amp; Plain-English Guide
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-orange-bordered text-balance">
          Data Disclosure, Citations &amp; How HealthWings Works
        </h1>
        <p className="text-sm sm:text-base text-sky-900/90 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Every dataset, website, AI service, and code library behind HealthWings is listed below with its exact source name, data name, and link.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <article className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-orange-500" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-orange-bordered-sm">
              How Your Check-Ins Are Used
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-sky-900/90 dark:text-slate-300">
            <li className="p-3 rounded-2xl bg-amber-50/75 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700">
              <strong className="text-sky-950 dark:text-white">Wing Speedometer:</strong> Combines your mood, sleep, stress, exercise, and heart recovery into two at-a-glance 0–100% gauges (Mental on left, Physical on right).
            </li>
            <li className="p-3 rounded-2xl bg-sky-50/75 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700">
              <strong className="text-sky-950 dark:text-white">Symptom Pattern Helper:</strong> Compares the symptoms you tap with NASA reference ranges to pop up the best light-based Space Test card.
            </li>
            <li className="p-3 rounded-2xl bg-sky-50/75 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700">
              <strong className="text-sky-950 dark:text-white">Simulated Live Telemetry:</strong> Interactive daily slider readings are simulated sample values calibrated to NASA cohorts for demonstration.
            </li>
          </ul>
        </article>

        <article className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-orange-bordered-sm">
              Your Account, Privacy &amp; Health Notice
            </h2>
          </div>
          <div className="space-y-3 text-sm text-sky-900/90 dark:text-slate-300">
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700 leading-relaxed">
              <strong className="block text-sky-950 dark:text-white mb-0.5">Private Account Storage</strong>
              When you sign in with Google, your HealthWings settings, earned stars, and completed Space Test logs are stored privately under your own user ID in Firebase. Nobody else can view or edit your records.
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700 leading-relaxed">
              <strong className="block text-sky-950 dark:text-white mb-0.5">Educational Wellness Prototype</strong>
              HealthWings is an educational astronaut-wellness prototype built for NASA Space Apps exploration. It does not diagnose medical conditions or replace qualified doctors or flight surgeons.
            </div>
          </div>
        </article>
      </div>

      {/* Complete Citations Directory: Datasets, Websites & Code */}
      <article className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-sky-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-sky-600 dark:text-cyan-400" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-orange-bordered-sm">
              Complete Citations: Datasets, Websites &amp; Code
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-sky-800 dark:text-slate-400">
            <Code2 className="w-4 h-4" aria-hidden="true" />
            <span>{CITATIONS.length} cited sources</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CITATIONS.map((item) => (
            <div
              key={`${item.sourceName}-${item.dataName}`}
              className="p-4 rounded-2xl bg-sky-50/75 dark:bg-slate-800/65 border border-sky-200 dark:border-slate-700 flex flex-col justify-between gap-2.5"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-amber-300">
                  {item.category} · {item.sourceName}
                </div>
                <h3 className="text-sm font-bold text-sky-950 dark:text-white mt-0.5 leading-snug">
                  {item.dataName}
                </h3>
                <p className="text-xs text-sky-900/85 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {item.notes}
                </p>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-cyan-300 hover:underline break-all"
              >
                <span>{item.url}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};
