'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button, Badge } from '@anonchat/ui';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Maximize, User, Camera, Volume2, LayoutGrid, Layers } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';

interface VideoChatProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState;
  permissionError?: string | null;
  onRequestPermissions?: () => void;
}

export const VideoChat: React.FC<VideoChatProps> = ({
  localStream,
  remoteStream,
  connectionState,
  permissionError,
  onRequestPermissions,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isAudioMuted, isVideoOff, toggleAudioMute, toggleVideoOff } = useSettingsStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'split' | 'pip'>('split');

  // Attach & auto-play local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch((err) => console.log('Local video play error:', err));
    }
  }, [localStream, layoutMode]);

  // Attach & auto-play remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.volume = 1.0;
      remoteVideoRef.current.muted = false;

      const playPromise = remoteVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setAutoplayBlocked(false))
          .catch((err) => {
            console.log('Remote video autoplay blocked by browser policy:', err);
            setAutoplayBlocked(true);
          });
      }
    }
  }, [remoteStream, layoutMode]);

  const handleManualPlayAudio = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current.volume = 1.0;
      remoteVideoRef.current
        .play()
        .then(() => setAutoplayBlocked(false))
        .catch((err) => console.error('Play error on click:', err));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full max-h-[calc(100vh-5.5rem)] min-h-[300px] bg-zinc-950 rounded-3xl border border-zinc-800/80 overflow-hidden shadow-2xl flex flex-col"
    >
      {/* Video Container Grid */}
      <div
        className={`relative w-full h-full flex-1 overflow-hidden ${
          layoutMode === 'split'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-2 p-2 bg-zinc-950'
            : 'flex items-center justify-center bg-black'
        }`}
      >
        {/* Remote Video Container */}
        <div
          className={`relative flex items-center justify-center bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/60 ${
            layoutMode === 'split' ? 'w-full h-full' : 'w-full h-full'
          }`}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-contain bg-black ${remoteStream ? 'block' : 'hidden'}`}
          />

          {!remoteStream && (
            <div className="flex flex-col items-center justify-center gap-3 text-zinc-500 p-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800">
                <User className="h-8 w-8 text-zinc-500" />
              </div>
              <p className="text-xs font-semibold text-zinc-400">
                {connectionState === 'connected'
                  ? 'Receiving stranger video stream...'
                  : connectionState === 'connecting'
                  ? 'Connecting peer video stream...'
                  : 'Waiting for partner media...'}
              </p>
            </div>
          )}

          {/* Label Tag */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-[11px] font-bold text-zinc-200 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Stranger
          </div>
        </div>

        {/* Local Video Container (50/50 Split Mode or PIP Floating) */}
        <div
          className={`${
            layoutMode === 'split'
              ? 'relative w-full h-full flex items-center justify-center bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/60'
              : 'absolute bottom-4 right-4 z-20 w-32 sm:w-44 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-zinc-900 shadow-2xl p-1'
          }`}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full ${layoutMode === 'split' ? 'h-full object-contain bg-black' : 'h-28 sm:h-36 object-cover'} rounded-xl transform -scale-x-100 ${
              localStream && !isVideoOff ? 'block' : 'hidden'
            }`}
          />

          {(!localStream || isVideoOff) && (
            <div className="flex flex-col items-center justify-center h-full min-h-[120px] bg-zinc-900 text-zinc-400 text-center gap-2 p-2">
              <Camera className="w-6 h-6 text-emerald-400" />
              {permissionError ? (
                <span className="text-[10px] text-amber-400 font-medium leading-tight">{permissionError}</span>
              ) : (
                <span className="text-[10px]">Your Camera Off</span>
              )}
              {onRequestPermissions && (
                <Button variant="primary" size="sm" onClick={onRequestPermissions} className="text-[10px] py-1 h-7">
                  Enable Camera
                </Button>
              )}
            </div>
          )}

          {/* Label Tag */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-950/80 border border-zinc-800 text-[10px] font-bold text-zinc-200 backdrop-blur-md">
            You (Me)
          </div>
        </div>

        {/* Autoplay Blocked Tap Overlay for Mobile */}
        {autoplayBlocked && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 text-center">
            <Button variant="primary" size="lg" onClick={handleManualPlayAudio} className="gap-2 font-bold px-6 py-3">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <span>Tap to Enable Audio & Video</span>
            </Button>
          </div>
        )}
      </div>

      {/* Floating Video Media Controls Overlay */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-zinc-950/90 p-2 rounded-2xl border border-zinc-800/80 backdrop-blur-xl shadow-2xl">
        <Button
          variant={isAudioMuted ? 'danger' : 'secondary'}
          size="sm"
          onClick={toggleAudioMute}
          title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
        >
          {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
        <Button
          variant={isVideoOff ? 'danger' : 'secondary'}
          size="sm"
          onClick={toggleVideoOff}
          title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
        >
          {isVideoOff ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLayoutMode(layoutMode === 'split' ? 'pip' : 'split')}
          title="Toggle 50/50 Split View or Floating PIP View"
          className="text-xs gap-1 font-semibold"
        >
          {layoutMode === 'split' ? <Layers className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          <span className="hidden sm:inline">{layoutMode === 'split' ? 'PIP View' : '50/50 Split'}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleFullscreen} title="Toggle Fullscreen">
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
