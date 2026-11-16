import React from 'react';
import { MessageCircle } from 'lucide-react';

export type AppPage = 'home' | 'planets' | 'disclosure' | 'account';

interface TopBarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenChat: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onNavigate,
  onOpenChat,
}) => {
  const navItems: { id: AppPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'planets', label: 'Planets' },
    { id: 'disclosure', label: 'Data & Privacy' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-sky-200/90 dark:border-slate-800/90 bg-sky-50/95 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-2xl font-bold tracking-tight text-orange-bordered-sm whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 rounded-md"
        >
          HealthWings
        </button>

        {/* Zone 2: Concise single-line page links */}
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-4 sm:gap-7 text-sm font-semibold text-sky-900 dark:text-sky-100 overflow-x-auto"
        >
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'text-orange-600 dark:text-amber-300 underline decoration-2 underline-offset-4'
                    : 'hover:text-orange-600 dark:hover:text-amber-300 hover:underline underline-offset-4'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-300 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 text-orange-950 font-display font-semibold text-sm border-2 border-orange-500 shadow-sm transition-transform active:scale-95 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <MessageCircle className="w-4 h-4 text-orange-700" aria-hidden="true" />
            <span className="hidden sm:inline">Ask Dr. Pisces</span>
            <span className="sm:hidden">Pisces</span>
          </button>
        </div>
      </div>
    </header>
  );
};
