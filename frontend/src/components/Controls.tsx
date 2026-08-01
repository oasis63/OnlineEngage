'use client';

import React from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { SkipForward, LogOut, Globe, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useChatStore } from '../stores/useChatStore';
import { SUPPORTED_LANGUAGES } from '../shared/index';

interface ControlsProps {
  onNext: () => void;
  onDisconnect: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onNext, onDisconnect }) => {
  const { partnerName, partnerGender, partnerAge, partnerLanguage, sharedInterests } = useChatStore();

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === partnerLanguage);

  return (
    <div className="flex flex-col gap-4 p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-500 shadow-lg">
          <User className="h-8 w-8 text-white" />
          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-400 border-2 border-zinc-950 animate-pulse" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{partnerName || 'Stranger'}</h3>
          <p className="text-xs text-zinc-400 capitalize">
            {partnerAge ? `${partnerAge} yrs` : ''} {partnerGender ? `• ${partnerGender}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {langObj && (
            <Badge variant="emerald" className="text-xs px-2.5 py-0.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {langObj.name}
            </Badge>
          )}
          <Badge variant="default" className="text-xs px-2.5 py-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Match
          </Badge>
        </div>
      </div>

      {sharedInterests.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Shared Interests
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sharedInterests.map((interest) => (
              <Badge key={interest} variant="amber" className="text-xs px-2.5 py-0.5">
                #{interest}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 space-y-2 border-t border-zinc-800/80">
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          className="w-full font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/50"
        >
          <SkipForward className="w-4 h-4 mr-2" /> Next Stranger
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={onDisconnect}
          className="w-full text-zinc-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/30"
        >
          <LogOut className="w-4 h-4 mr-2" /> Disconnect
        </Button>
      </div>
    </div>
  );
};
