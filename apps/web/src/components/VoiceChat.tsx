'use client';

import React, { useRef, useEffect } from 'react';
import { Button, Badge } from '@anonchat/ui';
import { Mic, MicOff, Volume2, UserCheck, ShieldAlert } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';

interface VoiceChatProps {
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState;
  permissionError?: string | null;
  onRequestPermissions?: () => void;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({
  remoteStream,
  connectionState,
  permissionError,
  onRequestPermissions,
}) => {
  const { isAudioMuted, toggleAudioMute } = useSettingsStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play().catch((err) => console.log('Remote audio play error:', err));
    }
  }, [remoteStream]);

  return (
    <div className="relative flex-1 w-full h-full min-h-[300px] bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center">
      {/* Hidden audio element for remote WebRTC stream */}
      <audio ref={audioRef} autoPlay playsInline />

      {/* Visual Avatar with Wave Animation */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute h-36 w-36 rounded-full bg-emerald-500/10 animate-ping" />
        <div className="absolute h-28 w-28 rounded-full bg-emerald-500/20 animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 border-2 border-emerald-400 shadow-xl shadow-emerald-950/50">
          <UserCheck className="h-12 w-12 text-white" />
        </div>
      </div>

      <div className="text-center space-y-2 mb-6 max-w-md">
        <h3 className="text-xl font-bold text-white">Voice Chat Active</h3>
        <p className="text-sm text-zinc-400">
          {connectionState === 'connected'
            ? 'Connected to stranger via high-quality WebRTC audio.'
            : 'Establishing audio peer connection...'}
        </p>
        <div className="flex justify-center pt-1">
          <Badge variant={connectionState === 'connected' ? 'emerald' : 'amber'}>
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            Audio Status: {connectionState}
          </Badge>
        </div>
      </div>

      {permissionError && (
        <div className="mb-6 rounded-xl bg-amber-950/80 border border-amber-800/50 p-3 text-xs text-amber-300 flex items-center gap-2 max-w-md">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRequestPermissions && (
          <Button variant="outline" size="md" onClick={onRequestPermissions}>
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>Enable Mic</span>
          </Button>
        )}
        <Button
          variant={isAudioMuted ? 'danger' : 'primary'}
          size="lg"
          onClick={toggleAudioMute}
          className="rounded-full px-6"
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
        </Button>
      </div>
    </div>
  );
};
