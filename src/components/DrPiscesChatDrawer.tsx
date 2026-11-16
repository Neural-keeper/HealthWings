import React, { useEffect, useRef, useState } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import {
  AstronautBiometrics,
  ZERO_G_LIGHT_TESTS,
  ZeroGTestProtocol,
} from '../data/lsahData';
import { DrPiscesMascot } from './DrPiscesMascot';
import { ZeroGTestCard } from './ZeroGTestCard';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  followUpQuestions?: string[];
  recommendedTest?: ZeroGTestProtocol;
}

interface DrPiscesChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  biometrics: AstronautBiometrics;
  selectedSymptoms: string[];
  queuedPrompt: string | null;
  onClearQueuedPrompt: () => void;
  onCompleteTest: (protocol: ZeroGTestProtocol) => void;
}

export const DrPiscesChatDrawer: React.FC<DrPiscesChatDrawerProps> = ({
  isOpen,
  onClose,
  biometrics,
  selectedSymptoms,
  queuedPrompt,
  onClearQueuedPrompt,
  onCompleteTest,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Bloop! I'm Dr. Pisces, your orbital flight surgeon. Looking at Flight Day ${biometrics.flightDay}, how are your eyes, sleep, and energy feeling today? Tell me any symptoms and I'll match a light-based zero-G test!`,
      followUpQuestions: [
        'I have slight near-vision blur after waking',
        'Sleep felt fragmented last night',
        'What zero-G light test should I take today?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/pisces/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          biometrics,
          symptoms: selectedSymptoms,
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        followUpQuestions?: string[];
        recommendedTestId?: string;
        showTestCard?: boolean;
        error?: string;
      };

      const matchedTest = data.showTestCard
        ? ZERO_G_LIGHT_TESTS.find((t) => t.id === data.recommendedTestId) ??
          ZERO_G_LIGHT_TESTS[0]
        : undefined;

      setMessages((prev) => [
        ...prev,
        {
          id: `pisces-${Date.now()}`,
          role: 'assistant',
          text:
            data.reply ??
            data.error ??
            'Bloop—let us check your cabin optical sensors right away!',
          followUpQuestions: data.followUpQuestions ?? [],
          recommendedTest: matchedTest,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `pisces-err-${Date.now()}`,
          role: 'assistant',
          text: 'My telemetry antenna had a brief hiccup, but here is our Optical PPG scan card you can run offline in zero-G right now.',
          recommendedTest: ZERO_G_LIGHT_TESTS[0],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && queuedPrompt) {
      const prompt = queuedPrompt;
      onClearQueuedPrompt();
      void sendMessage(prompt);
    }
  }, [isOpen, queuedPrompt]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Dr. Pisces Astronaut Health Chat"
    >
      <div className="w-full max-w-lg h-full bg-sky-50 dark:bg-slate-950 border-l border-sky-200 dark:border-slate-800 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-100 to-amber-100 dark:from-slate-900 dark:to-slate-900 border-b border-sky-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <DrPiscesMascot size={54} />
            <div>
              <h2 className="font-display text-xl font-bold text-orange-bordered-sm">
                Dr. Pisces AI Triage
              </h2>
              <p className="text-xs text-sky-800 dark:text-slate-400">
                NASA LSAH Symptom Q&amp;A · Zero-G Light Diagnostics
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Dr. Pisces chat"
            className="p-2 rounded-xl hover:bg-white/70 dark:hover:bg-slate-800 text-sky-900 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-300 text-orange-950 border border-orange-500 font-medium'
                    : 'bg-white dark:bg-slate-900 text-sky-950 dark:text-slate-100 border border-sky-200 dark:border-slate-800'
                }`}
              >
                {msg.text}
              </div>

              {/* Embedded Zero-G Light Test Card */}
              {msg.recommendedTest && (
                <div className="w-full mt-3">
                  <ZeroGTestCard
                    protocol={msg.recommendedTest}
                    onCompleteTest={onCompleteTest}
                    compact
                  />
                </div>
              )}

              {/* Clickable Follow-Up Symptom Prompts */}
              {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {msg.followUpQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className="text-left text-xs px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-sky-800 dark:text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              <span>Dr. Pisces is consulting NASA LSAH reference curves...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(input);
          }}
          className="p-4 bg-white dark:bg-slate-900 border-t border-sky-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe any symptom, sleep issue, or vision change..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-sm text-sky-950 dark:text-white placeholder:text-sky-700/60 dark:placeholder:text-slate-400 focus:outline-2 focus:outline-orange-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message to Dr. Pisces"
            className="p-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 disabled:opacity-50 text-orange-950 border border-orange-500 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
