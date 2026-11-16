import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { LogIn, LogOut, Star, CheckCircle2, Cloud, ArrowLeft, Edit3 } from 'lucide-react';
import { CheckinEntry } from '../lib/firebase';
import { DrPiscesMascot } from './DrPiscesMascot';

interface AccountPageProps {
  user: User | null;
  authLoading: boolean;
  authError: string | null;
  callsign: string;
  onUpdateCallsign: (nextCallsign: string) => void;
  starsEarned: number;
  activePlanets: number;
  mentalScore: number;
  physicalScore: number;
  recentCheckins: CheckinEntry[];
  isSavingCloud: boolean;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onBackHome: () => void;
  onGoToPlanets: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  authLoading,
  authError,
  callsign,
  onUpdateCallsign,
  starsEarned,
  activePlanets,
  mentalScore,
  physicalScore,
  recentCheckins,
  isSavingCloud,
  onSignIn,
  onSignOut,
  onBackHome,
  onGoToPlanets,
}) => {
  const [editingCallsign, setEditingCallsign] = useState(false);
  const [draftCallsign, setDraftCallsign] = useState(callsign);

  const handleSaveCallsign = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = draftCallsign.trim().slice(0, 40);
    if (cleaned) {
      onUpdateCallsign(cleaned);
    }
    setEditingCallsign(false);
  };

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-16">
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
          Crew Profile · Cloud Sync &amp; Check-In History
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-orange-bordered text-balance">
          Your HealthWings Account
        </h1>
      </div>

      {authError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs sm:text-sm text-rose-800 dark:text-rose-200"
        >
          {authError}
        </div>
      )}

      {!user ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="shrink-0">
            <DrPiscesMascot size={126} />
          </div>
          <div className="space-y-3 flex-1">
            <h2 className="font-display text-2xl font-bold text-orange-bordered-sm">
              Sign In to Save Your Wings &amp; Planets
            </h2>
            <p className="text-sm text-sky-900/90 dark:text-slate-300 leading-relaxed max-w-xl">
              Right now your check-ins live on this device only. Sign in with Google to save your HealthWings speedometer numbers, earned stars, and 8-planet solar system progress safely to your account.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void onSignIn()}
                disabled={authLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 disabled:opacity-60 text-orange-950 font-display font-semibold text-sm border-2 border-orange-500 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-orange-700" aria-hidden="true" />
                <span>{authLoading ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Profile & Cloud Status Card */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Crew avatar'}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl border-2 border-sky-300 object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-slate-800 border-2 border-sky-300 flex items-center justify-center font-display text-xl font-bold text-orange-600">
                  {callsign.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-display text-xl font-bold text-orange-bordered-sm truncate">
                  {callsign}
                </div>
                <div className="text-xs text-sky-800 dark:text-slate-400 truncate">
                  {user.email}
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                  <Cloud className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isSavingCloud ? 'Saving changes...' : 'Synced to HealthWings Cloud'}</span>
                </div>
              </div>
            </div>

            {editingCallsign ? (
              <form onSubmit={handleSaveCallsign} className="flex items-center gap-2">
                <input
                  type="text"
                  value={draftCallsign}
                  onChange={(e) => setDraftCallsign(e.target.value)}
                  maxLength={40}
                  placeholder="Enter crew callsign"
                  className="flex-1 px-3 py-2 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-300 dark:border-slate-700 text-xs text-sky-950 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-amber-300 text-orange-950 font-semibold text-xs border border-orange-500 cursor-pointer"
                >
                  Save
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDraftCallsign(callsign);
                  setEditingCallsign(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:underline cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Edit Crew Callsign</span>
              </button>
            )}

            {/* Rounded-Rectangle Stat Mini-Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700">
                <div className="text-[11px] font-semibold text-sky-700 dark:text-slate-400">
                  Mental Wing
                </div>
                <div className="font-mono-tabular text-2xl font-bold text-sky-950 dark:text-white">
                  {mentalScore}%
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800/70 border border-amber-200 dark:border-slate-700">
                <div className="text-[11px] font-semibold text-orange-700 dark:text-amber-300">
                  Physical Wing
                </div>
                <div className="font-mono-tabular text-2xl font-bold text-sky-950 dark:text-white">
                  {physicalScore}%
                </div>
              </div>
              <button
                type="button"
                onClick={onGoToPlanets}
                className="col-span-2 p-3.5 rounded-2xl bg-slate-950 text-white border border-sky-400/50 flex items-center justify-between cursor-pointer hover:border-amber-300 transition-colors"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" aria-hidden="true" />
                  <span>{starsEarned} Stars Earned</span>
                </span>
                <span className="font-mono-tabular text-xs font-bold text-cyan-300">
                  {activePlanets} / 8 Planets →
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => void onSignOut()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-950 dark:text-slate-200 text-xs font-semibold border border-sky-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Right: Recent Check-In & Star History */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-sky-200 dark:border-slate-800 shadow-sm">
            <h2 className="font-display text-xl font-bold text-orange-bordered-sm mb-1">
              Recent Check-Ins &amp; Completed Space Tests
            </h2>
            <p className="text-xs text-sky-800 dark:text-slate-400 mb-4">
              Each time you complete a Dr. Pisces task or Space Test card, it’s logged here.
            </p>

            {recentCheckins.length === 0 ? (
              <div className="p-6 rounded-2xl bg-sky-50 dark:bg-slate-800/60 border border-sky-200 dark:border-slate-700 text-center text-sm text-sky-800 dark:text-slate-300">
                No cloud check-ins logged yet. Complete a Space Test card or Quick Task to log your first star!
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentCheckins.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-2xl bg-sky-50/85 dark:bg-slate-800/70 border border-sky-200 dark:border-slate-700 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <div className="text-sm font-semibold text-sky-950 dark:text-white">
                          {entry.title}
                        </div>
                        {entry.note && (
                          <div className="text-xs text-sky-800 dark:text-slate-400 mt-0.5">
                            {entry.note}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs font-bold text-orange-600 dark:text-amber-300 shrink-0">
                      +{entry.starReward} ★
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
