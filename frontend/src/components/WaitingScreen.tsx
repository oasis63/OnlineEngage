'use client';

import React from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { RefreshCw, X, Globe, Sparkles, MessageSquare, Video, Mic, Heart } from 'lucide-react';
import { useChatStore } from '../stores/useChatStore';
import { SUPPORTED_LANGUAGES } from '../shared/index';

interface WaitingScreenProps {
  onCancel: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ onCancel }) => {
  const { mode, language, interests, interestedIn } = useChatStore();

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-6 text-center max-w-lg mx-auto w-full">
      {/* Animated Matchmaking Radar Glow */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute h-40 w-40 rounded-full bg-emerald-500/10 animate-ping" />
        <div className="absolute h-28 w-28 rounded-full bg-teal-500/20 animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/80">
          <RefreshCw className="h-10 w-10 text-white animate-spin [animation-duration:3s]" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
        Finding a Stranger...
      </h2>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">
        Connecting you with available users in India matching your language and preference filter.
      </p>

      {/* Selected Filters Summary Pill */}
      <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-8 space-y-3">
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-left">
          Active Matchmaking Filters
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge variant="emerald" className="text-xs px-3 py-1 flex items-center gap-1.5">
            {mode === 'video' ? (
              <Video className="w-3.5 h-3.5" />
            ) : mode === 'voice' ? (
              <Mic className="w-3.5 h-3.5" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5" />
            )}
            <span className="capitalize">{mode} Chat</span>
          </Badge>

          {langObj && (
            <Badge variant="default" className="text-xs px-3 py-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              {langObj.name}
            </Badge>
          )}

          <Badge variant="default" className="text-xs px-3 py-1 flex items-center gap-1.5 capitalize">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Seeking: {interestedIn}
          </Badge>
        </div>

        {interests.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center pt-1 border-t border-zinc-800/60">
            {interests.map((tag) => (
              <Badge key={tag} variant="amber" className="text-[11px] px-2 py-0.5">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={onCancel}
        className="text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-700 font-bold text-sm px-6 rounded-xl"
      >
        <X className="w-4 h-4 mr-2" /> Cancel Search
      </Button>
    </div>
  );
};
