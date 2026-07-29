'use client';

import React from 'react';
import { Button, Badge } from '@anonchat/ui';
import { SkipForward, LogOut, Globe, Sparkles, User, Calendar } from 'lucide-react';
import { useChatStore } from '../stores/useChatStore';
import { SUPPORTED_LANGUAGES } from '@anonchat/shared';

interface ControlsProps {
  onNext: () => void;
  onDisconnect: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onNext, onDisconnect }) => {
  const { partnerName, partnerGender, partnerAge, partnerLanguage, sharedInterests } = useChatStore();

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === partnerLanguage);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl">
      {/* Partner Info Summary */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {partnerName && (
          <Badge variant="emerald" className="flex items-center gap-1 font-semibold px-3 py-1">
            <User className="w-3.5 h-3.5" />
            {partnerName} {partnerAge ? `(${partnerAge} y/o)` : ''} {partnerGender ? `• ${partnerGender}` : ''}
          </Badge>
        )}
        {langObj && (
          <Badge variant="default" className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-400" />
            {langObj.name}
          </Badge>
        )}
        {sharedInterests.length > 0 && (
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">Shared:</span>
            {sharedInterests.map((interest) => (
              <Badge key={interest} variant="amber">
                #{interest}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 ml-auto">
        <Button variant="outline" size="md" onClick={onDisconnect}>
          <LogOut className="w-4 h-4 text-zinc-400" />
          <span>Disconnect</span>
        </Button>
        <Button variant="primary" size="md" onClick={onNext} className="bg-emerald-600 hover:bg-emerald-500 font-semibold">
          <SkipForward className="w-4 h-4" />
          <span>Next Stranger</span>
        </Button>
      </div>
    </div>
  );
};
