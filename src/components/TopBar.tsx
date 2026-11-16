import React from 'react';
import { MessageCircle } from 'lucide-react';

interface TopBarProps {
  onOpenChat: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenChat }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-sky-200/80 dark:border-slate-800/90 bg-sky-50/90 dark:bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#wings-hero"
          className="font-display text-2xl font-bold tracking-tight text-orange-bordered-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 rounded-md"
        >
          Pisces Orbital
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-sky-900 dark:text-sky-100"
        >
          <a
            href="#wings-hero"
            className="hover:text-orange-600 dark:hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Health Wings
          </a>
          <a
            href="#ml-triage"
            className="hover:text-orange-600 dark:hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Symptom ML
          </a>
          <a
            href="#body-systems"
            className="hover:text-orange-600 dark:hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Body Systems
          </a>
          <a
            href="#solar-system"
            className="hover:text-orange-600 dark:hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Solar System
          </a>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-300 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 text-orange-950 font-display font-semibold text-sm border-2 border-orange-500 shadow-sm transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <MessageCircle className="w-4 h-4 text-orange-700" aria-hidden="true" />
            <span>Ask Dr. Pisces</span>
          </button>
        </div>
      </div>
    </header>
  );
};
