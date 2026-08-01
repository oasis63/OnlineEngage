'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, User, RefreshCw, AlertCircle, ShieldAlert, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { useChatStore } from '../stores/useChatStore';

interface VoiceChatProps {
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState;
  permissionError: string | null;
  onRequestPermissions: () => void;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({
  remoteStream,
  connectionState,
  permissionError,
  onRequestPermissions,
}) => {
  const { partnerName, setMode } = useChatStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (permissionError) {
    const isSecurityError = permissionError.includes('CONNECTION_NOT_SECURE');

    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 bg-zinc-950/90 rounded-2xl border border-zinc-800 text-center space-y-6 max-w-xl mx-auto overflow-y-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-950/80 border border-rose-800/50">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isSecurityError ? 'Mobile Connection Is Not Secure' : 'Microphone Permissions Required'}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Mobile Chrome/Safari blocks microphone on IP addresses (`https://192.168.1.17:8443`) unless enabled in Chrome flags.
          </p>
        </div>

        {isSecurityError && (
          <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-left space-y-3">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4" /> Quick Fix for Mobile Chrome (Android):
            </div>
            <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside leading-normal">
              <li>Open a new tab in Chrome and go to: <br /><code className="text-emerald-400 font-mono bg-zinc-950 px-2 py-1 rounded text-[11px] select-all">chrome://flags/#unsafely-treat-insecure-origin-as-secure</code></li>
              <li>Enable the flag and add: <code className="text-emerald-400 font-mono bg-zinc-950 px-1.5 py-0.5 rounded text-[10px]">https://192.168.1.17:8443</code></li>
              <li>Relaunch Chrome and refresh this page.</li>
            </ol>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button variant="primary" onClick={onRequestPermissions} className="flex-1 text-xs">
            <RefreshCw className="w-4 h-4 mr-2" /> Retry Microphone Access
          </Button>

          <Button
            variant="outline"
            onClick={() => setMode('text')}
            className="flex-1 text-xs text-zinc-300 hover:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-emerald-400" /> Switch to Text Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-8 bg-zinc-950/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl space-y-8">
      {/* Hidden Audio Tag */}
      <audio ref={audioRef} autoPlay playsInline />

      {/* Voice Call Avatar & Wave Pulse */}
      <div className="relative flex items-center justify-center">
        {connectionState === 'connected' && (
          <>
            <span className="absolute h-48 w-48 rounded-full bg-emerald-500/10 animate-ping" />
            <span className="absolute h-36 w-36 rounded-full bg-emerald-500/20 animate-pulse" />
          </>
        )}

        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 border-4 border-emerald-500/80 shadow-2xl">
          <User className="h-14 w-14 text-white" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-white">{partnerName || 'Stranger'}</h3>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400">
          <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>
            {connectionState === 'connected'
              ? 'Voice Call Active (Encrypted)'
              : connectionState === 'connecting'
              ? 'Connecting Voice Stream...'
              : 'Waiting for Audio...'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full border shadow-xl transition-all ${
            isMuted
              ? 'bg-rose-950/90 border-rose-800 text-rose-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:text-white hover:border-emerald-500/50'
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
