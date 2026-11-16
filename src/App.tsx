import { useEffect, useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import { X, Sparkles } from 'lucide-react';
import {
  AstronautBiometrics,
  INITIAL_BIOMETRICS,
  ZERO_G_LIGHT_TESTS,
  ZeroGTestProtocol,
  computeWingBars,
} from './data/lsahData';
import { MLAnalysisResult, runLsahMlClassifier } from './lib/mlClassifier';
import {
  CheckinEntry,
  fetchRecentCheckins,
  loadOrCreateAstronautProfile,
  logCheckinEntry,
  saveAstronautProfile,
  signInWithGoogle,
  signOutAccount,
  subscribeToAuth,
  testFirestoreConnection,
} from './lib/firebase';
import { BioluminescentSky } from './components/BioluminescentSky';
import { AppPage, TopBar } from './components/TopBar';
import { AsclepiusWingsHero } from './components/AsclepiusWingsHero';
import { MLSymptomAnalyzer } from './components/MLSymptomAnalyzer';
import { BodySystemsDeepDive } from './components/BodySystemsDeepDive';
import { SolarSystemProgress } from './components/SolarSystemProgress';
import { DisclosurePage } from './components/DisclosurePage';
import { AccountPage } from './components/AccountPage';
import { DrPiscesChatDrawer } from './components/DrPiscesChatDrawer';
import { DrPiscesAlertToast } from './components/DrPiscesAlertToast';
import { ZeroGTestCard } from './components/ZeroGTestCard';

function parsePageFromHash(): AppPage {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === 'planets' || hash === 'disclosure' || hash === 'account') {
    return hash;
  }
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => parsePageFromHash());

  const [isNight, setIsNight] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hw_night') === 'true';
    } catch {
      return false;
    }
  });

  const [biometrics, setBiometrics] = useState<AstronautBiometrics>(() => {
    try {
      const saved = localStorage.getItem('hw_biometrics');
      return saved ? { ...INITIAL_BIOMETRICS, ...JSON.parse(saved) } : INITIAL_BIOMETRICS;
    } catch {
      return INITIAL_BIOMETRICS;
    }
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hw_symptoms');
      return saved ? (JSON.parse(saved) as string[]) : ['visual_blur'];
    } catch {
      return ['visual_blur'];
    }
  });

  const [starsEarned, setStarsEarned] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hw_stars');
      return saved ? Number(saved) : 4;
    } catch {
      return 4;
    }
  });

  const [completedTests, setCompletedTests] = useState<string[]>([]);
  const [callsign, setCallsign] = useState<string>('Astronaut Explorer');

  // Firebase Auth + Firestore state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSavingCloud, setIsSavingCloud] = useState<boolean>(false);
  const [recentCheckins, setRecentCheckins] = useState<CheckinEntry[]>([]);
  const profileLoadedRef = useRef<boolean>(false);

  // UI Overlays
  const [chatOpen, setChatOpen] = useState(false);
  const [queuedPrompt, setQueuedPrompt] = useState<string | null>(null);
  const [activeTestModal, setActiveTestModal] = useState<ZeroGTestProtocol | null>(null);
  const [recipeCatalogOpen, setRecipeCatalogOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [taskFeedback, setTaskFeedback] = useState<string | null>(null);

  // Hash navigation sync
  useEffect(() => {
    const onHashChange = () => setCurrentPage(parsePageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? 'home' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate Firestore connection on boot
  useEffect(() => {
    void testFirestoreConnection();
  }, []);

  // Listen to Firebase Auth state and load user's cloud profile when signed in
  useEffect(() => {
    const unsub = subscribeToAuth(async (nextUser) => {
      setUser(nextUser);
      setAuthError(null);
      if (!nextUser) {
        profileLoadedRef.current = false;
        setRecentCheckins([]);
        setAuthLoading(false);
        return;
      }

      try {
        setAuthLoading(true);
        const profile = await loadOrCreateAstronautProfile(nextUser, {
          starsEarned,
          selectedSymptoms,
          biometrics,
        });
        setBiometrics(profile.biometrics);
        setSelectedSymptoms(profile.selectedSymptoms);
        setStarsEarned(profile.starsEarned);
        setCompletedTests(profile.completedTests);
        setCallsign(profile.callsign);
        profileLoadedRef.current = true;

        const logs = await fetchRecentCheckins(nextUser.uid);
        setRecentCheckins(logs);
      } catch (err) {
        setAuthError(
          err instanceof Error
            ? 'Could not sync your HealthWings cloud profile. Local mode remains active.'
            : 'Account sync error.'
        );
      } finally {
        setAuthLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Auto-save profile changes to Firestore when authenticated
  useEffect(() => {
    if (!user || !profileLoadedRef.current) return;
    const timer = window.setTimeout(async () => {
      try {
        setIsSavingCloud(true);
        await saveAstronautProfile(user.uid, {
          displayName: user.displayName || callsign,
          callsign,
          starsEarned,
          selectedSymptoms,
          biometrics,
          completedTests,
        });
      } catch {
        // Structured error logged in firebase.ts
      } finally {
        setIsSavingCloud(false);
      }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [user, callsign, starsEarned, selectedSymptoms, biometrics, completedTests]);

  // Sync Tailwind v4 dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isNight);
    try {
      localStorage.setItem('hw_night', String(isNight));
    } catch {
      // ignore
    }
  }, [isNight]);

  useEffect(() => {
    try {
      localStorage.setItem('hw_biometrics', JSON.stringify(biometrics));
    } catch {
      // ignore
    }
  }, [biometrics]);

  useEffect(() => {
    try {
      localStorage.setItem('hw_symptoms', JSON.stringify(selectedSymptoms));
    } catch {
      // ignore
    }
  }, [selectedSymptoms]);

  useEffect(() => {
    try {
      localStorage.setItem('hw_stars', String(starsEarned));
    } catch {
      // ignore
    }
  }, [starsEarned]);

  const wingSummary = useMemo(
    () => computeWingBars(biometrics, selectedSymptoms),
    [biometrics, selectedSymptoms]
  );

  const mlAnalysis = useMemo(
    () => runLsahMlClassifier(biometrics, selectedSymptoms),
    [biometrics, selectedSymptoms]
  );

  const planetPenalty =
    wingSummary.overallActivityScore < 38
      ? 3
      : wingSummary.overallActivityScore < 52
      ? 2
      : wingSummary.overallActivityScore < 64
      ? 1
      : 0;

  const activePlanets = Math.max(0, Math.min(8, Math.min(8, starsEarned) - planetPenalty));

  // Proactive Dr. Pisces pop-up only after >= 14s dwell + interaction
  useEffect(() => {
    if (!hasInteracted) return;
    const timer = window.setTimeout(() => {
      if (!chatOpen && !activeTestModal && !recipeCatalogOpen) {
        setAlertVisible(true);
      }
    }, 14000);
    return () => window.clearTimeout(timer);
  }, [hasInteracted, chatOpen, activeTestModal, recipeCatalogOpen]);

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

  const recordCheckinInCloud = async (title: string, note: string, starReward: number) => {
    if (!user) return;
    try {
      await logCheckinEntry(user.uid, { title, note, starReward });
      const logs = await fetchRecentCheckins(user.uid);
      setRecentCheckins(logs);
    } catch {
      // Handled by firebase.ts
    }
  };

  const handleCompleteTest = (protocol: ZeroGTestProtocol) => {
    setHasInteracted(true);
    setStarsEarned((s) => Math.min(12, s + 1));
    setCompletedTests((prev) => [protocol.id, ...prev.slice(0, 24)]);

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

    void recordCheckinInCloud(protocol.name, 'Completed Space Test card', 1);
    setTaskFeedback(`Completed "${protocol.name}" (+1 Star earned!).`);
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
    void recordCheckinInCloud(task.title, note, task.starReward);
    setTaskFeedback(`Logged "${note}" (+${task.starReward} Star!).`);
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

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      setAuthLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Google sign-in did not complete.'
      );
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutAccount();
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col">
      <BioluminescentSky isNight={isNight} />
      <TopBar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenChat={() => handleOpenChat()}
      />

      {taskFeedback && (
        <div
          role="status"
          className="fixed top-20 right-4 z-40 px-4 py-2.5 rounded-2xl bg-amber-300 text-orange-950 font-semibold text-xs border-2 border-orange-500 shadow-md"
        >
          {taskFeedback}
        </div>
      )}

      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <AsclepiusWingsHero
              biometrics={biometrics}
              onUpdateBiometrics={handleUpdateBiometrics}
              wingSummary={wingSummary}
              isNight={isNight}
              onToggleNight={() => {
                setHasInteracted(true);
                setIsNight((v) => !v);
              }}
              starsEarned={starsEarned}
              activePlanets={activePlanets}
              onGoToPlanets={() => navigateTo('planets')}
              onOpenChat={handleOpenChat}
              onSummonCheckIn={() => {
                setHasInteracted(true);
                setAlertVisible(true);
              }}
              onOpenQuickRecipe={() => {
                setHasInteracted(true);
                setRecipeCatalogOpen(true);
              }}
            />

            <MLSymptomAnalyzer
              biometrics={biometrics}
              selectedSymptoms={selectedSymptoms}
              onToggleSymptom={handleToggleSymptom}
              onAskPiscesAboutRisk={(summary) => handleOpenChat(summary)}
              onPopSpaceTestModal={(proto) => {
                setHasInteracted(true);
                setActiveTestModal(proto);
              }}
            />

            <BodySystemsDeepDive
              biometrics={biometrics}
              onUpdateBiometrics={handleUpdateBiometrics}
              onOpenTestModal={(testId) => {
                setHasInteracted(true);
                const found =
                  ZERO_G_LIGHT_TESTS.find((t) => t.id === testId) ??
                  ZERO_G_LIGHT_TESTS[0];
                setActiveTestModal(found);
              }}
            />
          </>
        )}

        {currentPage === 'planets' && (
          <SolarSystemProgress
            starsEarned={starsEarned}
            activePlanets={activePlanets}
            planetPenalty={planetPenalty}
            overallActivityScore={wingSummary.overallActivityScore}
            onSimulateActivityDrop={handleSimulateActivityDrop}
            onRecoverMetrics={handleRecoverMetrics}
            onLaunchTaskForStar={() => {
              setHasInteracted(true);
              setAlertVisible(true);
            }}
            onBackHome={() => navigateTo('home')}
          />
        )}

        {currentPage === 'disclosure' && (
          <DisclosurePage onBackHome={() => navigateTo('home')} />
        )}

        {currentPage === 'account' && (
          <AccountPage
            user={user}
            authLoading={authLoading}
            authError={authError}
            callsign={callsign}
            onUpdateCallsign={(next) => setCallsign(next)}
            starsEarned={starsEarned}
            activePlanets={activePlanets}
            mentalScore={wingSummary.mentalScore}
            physicalScore={wingSummary.physicalScore}
            recentCheckins={recentCheckins}
            isSavingCloud={isSavingCloud}
            onSignIn={handleGoogleSignIn}
            onSignOut={handleSignOut}
            onBackHome={() => navigateTo('home')}
            onGoToPlanets={() => navigateTo('planets')}
          />
        )}
      </main>

      <footer className="relative z-10 border-t border-sky-200/80 dark:border-slate-800 py-7 px-4 sm:px-6 text-xs text-sky-800 dark:text-slate-400 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>
            HealthWings · Based on NASA Lifetime Surveillance of Astronaut Health (LSAH) data
          </span>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => navigateTo('planets')}
              className="font-semibold text-sky-900 dark:text-sky-200 hover:underline cursor-pointer"
            >
              Planets Page
            </button>
            <button
              type="button"
              onClick={() => navigateTo('disclosure')}
              className="font-semibold text-sky-900 dark:text-sky-200 hover:underline cursor-pointer"
            >
              Data &amp; Privacy Disclosure
            </button>
            <button
              type="button"
              onClick={() => navigateTo('account')}
              className="font-semibold text-orange-600 dark:text-amber-300 hover:underline cursor-pointer"
            >
              {user ? `Account (${callsign})` : 'Sign In'}
            </button>
          </div>
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
        onPopSpaceTest={(proto) => {
          setChatOpen(false);
          setActiveTestModal(proto);
        }}
      />

      {/* Proactive Dr. Pisces Task Pop-up */}
      <DrPiscesAlertToast
        visible={alertVisible}
        analysis={mlAnalysis}
        onDismiss={() => setAlertVisible(false)}
        onCompleteTask={handleCompleteAlertTask}
      />

      {/* Pop-Up Space Test Card Modal */}
      {activeTestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={activeTestModal.name}
        >
          <div className="w-full max-w-lg max-h-[84vh] flex flex-col relative">
            <button
              type="button"
              onClick={() => setActiveTestModal(null)}
              aria-label="Close Space Test card"
              className="absolute -top-2.5 -right-2.5 z-10 p-2 rounded-full bg-white dark:bg-slate-800 border border-sky-300 dark:border-slate-600 text-sky-950 dark:text-white shadow cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="overflow-y-auto rounded-3xl">
              <ZeroGTestCard
                protocol={activeTestModal}
                onCompleteTest={(proto) => {
                  handleCompleteTest(proto);
                  window.setTimeout(() => setActiveTestModal(null), 950);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Space Test Cards Picker Modal */}
      {recipeCatalogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Space Test Cards"
        >
          <div className="w-full max-w-2xl max-h-[78vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-700 p-4 sm:p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-sky-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold text-orange-bordered-sm">
                  Space Test Cards
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setRecipeCatalogOpen(false)}
                aria-label="Close Space Test cards list"
                className="p-1.5 rounded-xl hover:bg-sky-100 dark:hover:bg-slate-800 text-sky-900 dark:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ZERO_G_LIGHT_TESTS.map((test) => (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => {
                    setRecipeCatalogOpen(false);
                    setActiveTestModal(test);
                  }}
                  className="text-left p-3.5 rounded-2xl bg-amber-50/85 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-amber-300 dark:border-slate-600 transition-colors cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-orange-600 dark:text-amber-300">
                    {test.durationSec}s · {test.wavelengthNm}
                  </div>
                  <div className="font-display text-base font-bold text-sky-950 dark:text-white mt-0.5">
                    {test.name}
                  </div>
                  <p className="text-xs text-sky-900/85 dark:text-slate-300 mt-1 line-clamp-2">
                    {test.zeroGPrinciple}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
