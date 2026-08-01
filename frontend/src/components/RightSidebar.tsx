'use client';

import React from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { SkipForward, LogOut, Globe, Sparkles, User, ShieldCheck, MessageSquare } from 'lucide-react';
import { useChatStore } from '../stores/useChatStore';
import { SUPPORTED_LANGUAGES } from '../shared/index';
import { TextChat } from './TextChat';

interface RightSidebarProps {
  onNext: () => void;
  onDisconnect: () => void;
  isChatPanelOpen?: boolean;
  onToggleChatPanel?: () => void;
  onSendMessage?: (content: string) => void;
  onSendTyping?: () => void;
  onSendStopTyping?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onNext,
  onDisconnect,
  isChatPanelOpen = false,
  onToggleChatPanel,
  onSendMessage,
  onSendTyping,
  onSendStopTyping,
}) => {
  const { partnerName, partnerGender, partnerAge, partnerLanguage, sharedInterests, mode } = useChatStore();

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === partnerLanguage);

  return (
    <div className="w-full md:w-72 flex flex-col gap-3 p-3 bg-zinc-950/90 border border-zinc-800/80 rounded-2xl backdrop-blur-2xl shadow-2xl shrink-0 h-full overflow-hidden transition-all">
      {/* Connected Stranger Profile Card */}
      <div className="flex flex-col items-center text-center p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 space-y-2 shrink-0">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-500/50 shadow-md">
          <User className="h-6 w-6 text-white" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-zinc-950 animate-pulse" />
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-white tracking-tight leading-tight">
            {partnerName || 'Stranger'}
          </h3>
          <p className="text-[11px] text-zinc-400 capitalize">
            {partnerAge ? `${partnerAge} yrs` : ''} {partnerGender ? `• ${partnerGender}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1">
          {langObj && (
            <Badge variant="emerald" className="text-[10px] px-2 py-0.5 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {langObj.name}
            </Badge>
          )}
          <Badge variant="default" className="text-[10px] px-2 py-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Match
          </Badge>
        </div>
      </div>

      {/* Toggle Chat Panel Button directly BELOW Stranger Profile Card */}
      {mode !== 'text' && onToggleChatPanel && (
        <Button
          variant={isChatPanelOpen ? 'secondary' : 'primary'}
          size="sm"
          onClick={onToggleChatPanel}
          className={`w-full font-bold py-2 text-xs flex items-center justify-center gap-1.5 rounded-xl shrink-0 transition-all ${
            !isChatPanelOpen ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50' : ''
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isChatPanelOpen ? 'Hide Text Chat' : 'Open Text Chat'}</span>
        </Button>
      )}

      {/* Expanded Text Chat Window directly BELOW button inside Sidebar */}
      {mode !== 'text' && isChatPanelOpen && onSendMessage && onSendTyping && onSendStopTyping && (
        <div className="flex-1 min-h-0 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <TextChat
            onSendMessage={onSendMessage}
            onSendTyping={onSendTyping}
            onSendStopTyping={onSendStopTyping}
          />
        </div>
      )}

      {/* Shared Interests */}
      {!isChatPanelOpen && sharedInterests.length > 0 && (
        <div className="space-y-1.5 p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/40 shrink-0">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <Sparkles className="w-3 h-3 text-amber-400" /> Shared Interests
          </div>
          <div className="flex flex-wrap gap-1">
            {sharedInterests.map((interest) => (
              <Badge key={interest} variant="amber" className="text-[10px] px-2 py-0.5">
                #{interest}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Action Control Buttons */}
      <div className="mt-auto space-y-1.5 pt-1 shrink-0">
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          className="w-full font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-2.5 text-xs shadow-xl shadow-emerald-950/50"
        >
          <SkipForward className="w-3.5 h-3.5 mr-1.5" />
          <span>Next Stranger</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onDisconnect}
          className="w-full text-zinc-400 hover:text-rose-400 hover:border-rose-900/50 hover:bg-rose-950/30 py-1.5 text-xs"
        >
          <LogOut className="w-3.5 h-3.5 mr-1.5" />
          <span>Disconnect</span>
        </Button>
      </div>
    </div>
  );
};
