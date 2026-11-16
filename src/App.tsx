import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  AstronautBiometrics,
  INITIAL_BIOMETRICS,
  ZERO_G_LIGHT_TESTS,
  ZeroGTestProtocol,
  computeWingBars,
} from './data/lsahData';
import { MLAnalysisResult, runLsahMlClassifier } from './lib/mlClassifier';
import { BioluminescentSky } from './components/BioluminescentSky';
import { TopBar } from './components/TopBar';
import { AsclepiusWingsHero } from './components/AsclepiusWingsHero';
import { MLSymptomAnalyzer } from './components/MLSymptomAnalyzer';
import { BodySystemsDeepDive } from './components/BodySystemsDeepDive';
import { SolarSystemProgress } from './components/SolarSystemProgress';
import { DrPiscesChatDrawer } from './components/DrPiscesChatDrawer';
import { DrPiscesAlertToast } from './components/DrPiscesAlertToast';
import { ZeroGTestCard } from './components/ZeroGTestCard';

export default function App() {
  const [isNight, setIsNight] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pisces_night') === 'true';
    } catch {
      return false;
    }
  });

  const [biometrics, setBiometrics] = useState<AstronautBiometrics>(() => {
    try {
      const saved = localStorage.getItem('pisces_biometrics');
      return saved ? { ...INITIAL_BIOMETRICS, ...JSON.parse(saved) } : INITIAL_BIOMETRICS;
    } catch {
      return INITIAL_BIOMETRICS;
    }
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pisces_symptoms');
      return saved ? (JSON.parse(saved) as string[]) : ['visual_blur'];
    } catch {
      return ['visual_blur'];
    }
  });

  const [starsEarned, setStarsEarned] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('pisces_stars');
      return saved ? Number(saved) : 4;
    } catch {
      return 4;
    }
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [queuedPrompt, setQueuedPrompt] = useState<string | null>(null);
  const [activeTestModal, setActiveTestModal] = useState<ZeroGTestProtocol | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [taskFeedback, setTaskFeedback] = useState<string | null>(null);

  // Sync Tailwind v4 dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isNight);
    try {
      localStorage.setItem('pisces_night', String(isNight));
    } catch {
      // ignore storage failure
    }
  }, [isNight]);

  useEffect(() => {
    try {
      localStorage.setItem('pisces_biometrics', JSON.stringify(biometrics));
    } catch {
      // ignore
    }
  }, [biometrics]);

  useEffect(() => {
    try {
      localStorage.setItem('pisces_symptoms', JSON.stringify(selectedSymptoms));
    } catch {
      // ignore
    }
  }, [selectedSymptoms]);

  useEffect(() => {
    try {
      localStorage.setItem('pisces_stars', String(starsEarned));
    } catch {
      // ignore
    }
  }, [starsEarned]);

  const { mentalWing, physicalWing, overallActivityScore } = useMemo(
    () => computeWingBars(biometrics, selectedSymptoms),
    [biometrics, selectedSymptoms]
  );

  const mlAnalysis = useMemo(
    () => runLsahMlClassifier(biometrics, selectedSymptoms),
    [biometrics, selectedSymptoms]
  );

  // Planets gained from Stars, reduced if overall activity drops
  const planetPenalty =
    overallActivityScore < 38
      ? 3
      : overallActivityScore < 52
      ? 2
      : overallActivityScore < 64
      ? 1
      : 0;

  const activePlanets = Math.max(0, Math.min(8, Math.min(8, starsEarned) - planetPenalty));

  // Proactive Dr. Pisces pop-up only after >= 14s dwell + user interaction (never on arrival)
  useEffect(() => {
    if (!hasInteracted) return;
    const timer = window.setTimeout(() => {
      if (!chatOpen && !activeTestModal) {
        setAlertVisible(true);
      }
    }, 14000);
    return () => window.clearTimeout(timer);
  }, [hasInteracted, chatOpen, activeTestModal]);

  const handleUpdateBiometrics = (patch: Partial<AstronautBiometrics>) => {
    setHasInteracted(true);
    setBiometrics((prev) => ({ ...prev, ...patch }));
  };

  const handleToggleSymptom = (symptomId: string) => {
    setHasInteracted(true);
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleOpenChat = (initialPrompt?: string) => {
    setHasInteracted(true);
    if (initialPrompt) {
      setQueuedPrompt(initialPrompt);
    }
    setAlertVisible(false);
    setChatOpen(true);
  };

  const handleCompleteTest = (protocol: ZeroGTestProtocol) => {
    setHasInteracted(true);
    setStarsEarned((s) => Math.min(12, s + 1));

    // Apply realistic positive telemetry update after optical check-in
    setBiometrics((prev) => {
      if (protocol.id === 'spectral_retinal_oct') {
        return { ...prev, choroidalDeltaUm: Math.max(18, prev.choroidalDeltaUm - 12) };
      }
      if (protocol.id === 'blue_pupillometry') {
        return { ...prev, sleepHours: Math.min(8.5, prev.sleepHours + 0.6), stressLevel: Math.max(2, prev.stressLevel - 1) };
      }
      if (protocol.id === 'optical_ppg_hrv') {
        return { ...prev, hrvRmssd: Math.min(72, prev.hrvRmssd + 8), restingHr: Math.max(58, prev.restingHr - 4) };
      }
      if (protocol.id === 'transcutaneous_photometry') {
        return { ...prev, nkCellActivity: Math.min(54, prev.nkCellActivity + 6), vitaminD: Math.min(44, prev.vitaminD + 5) };
      }
      return { ...prev, moodScore: Math.min(10, prev.moodScore + 1) };
    });

    setTaskFeedback(`Logged ${protocol.name} (+1 Star earned).`);
    window.setTimeout(() => setTaskFeedback(null), 4000);
  };

  const handleCompleteAlertTask = (
    note: string,
    task: MLAnalysisResult['suggestedTask']
  ) => {
    setStarsEarned((s) => Math.min(12, s + task.starReward));
    setBiometrics((prev) => {
      switch (task.targetSystem) {
        case 'neuro_ocular':
          return { ...prev, choroidalDeltaUm: Math.max(16, prev.choroidalDeltaUm - 14) };
        case 'mental':
          return { ...prev, sleepHours: Math.min(8.4, prev.sleepHours + 0.8), moodScore: Math.min(10, prev.moodScore + 1) };
        case 'circulation':
          return { ...prev, hrvRmssd: Math.min(72, prev.hrvRmssd + 9), hydrationLiters: Math.min(3.5, prev.hydrationLiters + 0.5) };
        case 'immune':
          return { ...prev, nkCellActivity: Math.min(55, prev.nkCellActivity + 7) };
        case 'metabolism':
        default:
          return { ...prev, vitaminD: Math.min(46, prev.vitaminD + 6), exerciseMinutes: Math.min(120, prev.exerciseMinutes + 20) };
      }
    });
    setAlertVisible(false);
    setTaskFeedback(`Dr. Pisces logged "${note}" (+${task.starReward} Star).`);
    window.setTimeout(() => setTaskFeedback(null), 4500);
  };

  const handleSimulateActivityDrop = () => {
    setHasInteracted(true);
    setBiometrics((prev) => ({
      ...prev,
      exerciseMinutes: 15,
      sleepHours: 4.5,
      hrvRmssd: 26,
      nkCellActivity: 24,
      moodScore: 4,
      stressLevel: 8,
    }));
    setAlertVisible(true);
  };

  const handleRecoverMetrics = () => {
    setHasInteracted(true);
    setBiometrics((prev) => ({
      ...prev,
      exerciseMinutes: 95,
      sleepHours: 7.6,
      hrvRmssd: 58,
      nkCellActivity: 45,
      vitaminD: 38,
      choroidalDeltaUm: 18,
      moodScore: 8,
      stressLevel: 3,
      restingHr: 64,
    }));
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <BioluminescentSky isNight={isNight} />
      <TopBar onOpenChat={() => handleOpenChat()} />

      {/* Subtle confirmation banner when task or light scan completes */}
      {taskFeedback && (
        <div
          role="status"
          className="fixed top-20 right-4 z-40 px-4 py-2.5 rounded-xl bg-amber-300 text-orange-950 font-semibold text-xs border-2 border-orange-500 shadow-md"
        >
          {taskFeedback}
        </div>
      )}

      <main>
        <AsclepiusWingsHero
          biometrics={biometrics}
          onUpdateBiometrics={handleUpdateBiometrics}
          mentalWing={mentalWing}
          physicalWing={physicalWing}
          overallActivityScore={overallActivityScore}
          isNight={isNight}
          onToggleNight={() => {
            setHasInteracted(true);
            setIsNight((v) => !v);
          }}
          starsEarned={starsEarned}
          activePlanets={activePlanets}
          onOpenChat={handleOpenChat}
          onSummonCheckIn={() => {
            setHasInteracted(true);
            setAlertVisible(true);
          }}
        />

        <MLSymptomAnalyzer
          biometrics={biometrics}
          selectedSymptoms={selectedSymptoms}
          onToggleSymptom={handleToggleSymptom}
          onCompleteTest={handleCompleteTest}
          onAskPiscesAboutRisk={(summary) => handleOpenChat(summary)}
        />

        <BodySystemsDeepDive
          biometrics={biometrics}
          onUpdateBiometrics={handleUpdateBiometrics}
          onOpenTestModal={(testId) => {
            setHasInteracted(true);
            const found = ZERO_G_LIGHT_TESTS.find((t) => t.id === testId) ?? ZERO_G_LIGHT_TESTS[0];
            setActiveTestModal(found);
          }}
        />

        <SolarSystemProgress
          starsEarned={starsEarned}
          activePlanets={activePlanets}
          planetPenalty={planetPenalty}
          overallActivityScore={overallActivityScore}
          onSimulateActivityDrop={handleSimulateActivityDrop}
          onRecoverMetrics={handleRecoverMetrics}
          onLaunchTaskForStar={() => {
            setHasInteracted(true);
            setAlertVisible(true);
          }}
        />
      </main>

      <footer className="relative z-10 border-t border-sky-200/80 dark:border-slate-800 py-8 px-4 sm:px-6 text-center text-xs text-sky-800 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>
            Pisces Orbital Health · Calibrated on NASA Lifetime Surveillance of Astronaut Health (LSAH) reference cohorts
          </span>
          <a
            href="https://nlsp.nasa.gov/resources/lsah"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-orange-600 dark:text-amber-300 hover:underline"
          >
            NASA NLSP LSAH Resource
          </a>
        </div>
      </footer>

      {/* Dr. Pisces Chatbot Drawer */}
      <DrPiscesChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        biometrics={biometrics}
        selectedSymptoms={selectedSymptoms}
        queuedPrompt={queuedPrompt}
        onClearQueuedPrompt={() => setQueuedPrompt(null)}
        onCompleteTest={handleCompleteTest}
      />

      {/* Proactive Dr. Pisces Critical Metric Pop-up */}
      <DrPiscesAlertToast
        visible={alertVisible}
        analysis={mlAnalysis}
        onDismiss={() => setAlertVisible(false)}
        onCompleteTask={handleCompleteAlertTask}
      />

      {/* Standalone Light-Based Zero-G Test Instruction Modal */}
      {activeTestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={activeTestModal.name}
        >
          <div className="w-full max-w-xl relative">
            <button
              type="button"
              onClick={() => setActiveTestModal(null)}
              aria-label="Close test protocol"
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-white dark:bg-slate-800 border border-sky-300 dark:border-slate-600 text-sky-950 dark:text-white shadow cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <ZeroGTestCard
              protocol={activeTestModal}
              onCompleteTest={(proto) => {
                handleCompleteTest(proto);
                window.setTimeout(() => setActiveTestModal(null), 950);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
