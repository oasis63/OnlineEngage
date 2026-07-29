'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Badge } from '@anonchat/ui';
import { Loader2, X, Sparkles } from 'lucide-react';
import { useChatStore } from '../stores/useChatStore';
import { SUPPORTED_LANGUAGES } from '@anonchat/shared';

interface WaitingScreenProps {
  onCancel: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ onCancel }) => {
  const { mode, language, interests } = useChatStore();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-emerald-950/40 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Glowing aura background */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-teal-600/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Spinner */}
          <div className="relative flex h-24 w-24 items-center justify-center my-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Searching for a stranger...
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            Matching you based on language and interest preferences.
          </p>

          {/* Preferences summary */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 w-full">
            <Badge variant="emerald" className="capitalize">
              Mode: {mode}
            </Badge>
            {langObj && (
              <Badge variant="default">
                Language: {langObj.name} ({langObj.nativeName})
              </Badge>
            )}
            {interests.length > 0 &&
              interests.map((tag) => (
                <Badge key={tag} variant="amber">
                  #{tag}
                </Badge>
              ))}
          </div>

          {/* Wait Time Display */}
          <div className="rounded-xl bg-zinc-900/80 px-4 py-2 border border-zinc-800 text-xs text-zinc-400 mb-6">
            Time elapsed: <span className="font-semibold text-emerald-400">{seconds}s</span> | Estimated wait: <span className="text-zinc-300">~5s</span>
          </div>

          {/* Cancel button */}
          <Button variant="danger" size="md" onClick={onCancel} className="w-full sm:w-auto min-w-[160px]">
            <X className="w-4 h-4" /> Cancel Search
          </Button>
        </div>
      </Card>
    </div>
  );
};
