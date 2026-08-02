'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Camera,
  Mic,
  RefreshCw,
  Maximize2,
  Minimize2,
  VideoOff,
  MicOff,
  ShieldAlert,
  MessageSquare,
  ExternalLink,
  Maximize,
  Minimize,
  Shield,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/Button';
import { useChatStore } from '../stores/useChatStore';

interface VideoChatProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState;
  permissionError: string | null;
  onRequestPermissions: () => void;
}

export const VideoChat: React.FC<VideoChatProps> = ({
  localStream,
  remoteStream,
  connectionState,
  permissionError,
  onRequestPermissions,
}) => {
  const { setMode, partnerName } = useChatStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSplitView, setIsSplitView] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isShieldBlurred, setIsShieldBlurred] = useState(false);

  // Attach local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isSplitView]);

  // Attach remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, isSplitView]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleShieldBlur = () => {
    setIsShieldBlurred(!isShieldBlurred);
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch((err) => {
        console.error('Failed to exit fullscreen:', err);
      });
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  // Keyboard shortcut master controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        toggleShieldBlur();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        toggleVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShieldBlurred, isMuted, isVideoOff, localStream]);

  if (permissionError) {
    const isSecurityError = permissionError.includes('CONNECTION_NOT_SECURE');

    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 bg-zinc-950/90 rounded-2xl border border-zinc-800 text-center space-y-6 max-w-xl mx-auto overflow-y-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-950/80 border border-rose-800/50">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isSecurityError ? 'Mobile Connection Is Not Secure' : 'Camera Permissions Required'}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Mobile Chrome/Safari blocks camera & microphone on IP addresses (`https://192.168.1.17:8443`) unless enabled in Chrome flags.
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
            <RefreshCw className="w-4 h-4 mr-2" /> Retry Camera Access
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
    <div
      ref={containerRef}
      className="relative flex flex-1 flex-col h-full w-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl min-h-[450px]"
    >
      {/* Top Floating Controls */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={toggleShieldBlur}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md shadow-lg transition-all cursor-pointer ${
            isShieldBlurred
              ? 'bg-rose-950/90 border-rose-700 text-rose-400 shadow-rose-950/50'
              : 'bg-zinc-950/80 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white'
          }`}
          title="Emergency Shield Blur (Shortcut: B)"
        >
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isShieldBlurred ? 'Shield Active (B)' : 'Blur Shield (B)'}</span>
        </button>

        <button
          onClick={() => setIsSplitView(!isSplitView)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
        >
          {isSplitView ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-emerald-400" /> PIP View
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> 50/50 Dual View
            </>
          )}
        </button>

        <button
          onClick={toggleFullScreen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
          title="Toggle Full Screen Video Mode"
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-3.5 h-3.5 text-amber-400" /> Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize className="w-3.5 h-3.5 text-amber-400" /> Fullscreen Video
            </>
          )}
        </button>
      </div>

      {/* Main Video Display Canvas */}
      <div className="relative flex-1 flex h-full w-full min-h-0 overflow-hidden bg-black">
        <div
          className={`h-full w-full gap-2 p-2 bg-zinc-950 transition-all duration-300 ${
            isSplitView ? 'grid grid-cols-1 md:grid-cols-2' : 'relative flex items-center justify-center'
          }`}
        >
          {/* Stranger Remote Video */}
          <div
            className={`relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/80 flex items-center justify-center transition-all ${
              isSplitView ? 'h-full w-full' : 'absolute inset-0 h-full w-full z-0'
            }`}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`h-full w-full object-cover bg-black transition-all duration-300 ${
                isShieldBlurred ? 'blur-3xl scale-110 opacity-40' : ''
              }`}
            />
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-xs font-semibold text-white backdrop-blur-md flex items-center gap-1.5">
              <span>{partnerName || 'Stranger'}</span>
              {isShieldBlurred && (
                <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">(Blurred)</span>
              )}
            </div>

            {isShieldBlurred && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 gap-3 p-4 text-center">
                <EyeOff className="w-10 h-10 text-rose-400 animate-pulse" />
                <div className="text-xs font-bold text-white">Emergency Shield Active</div>
                <p className="text-[11px] text-zinc-400 max-w-xs">Video is blurred for your privacy & safety. Press [B] or tap button to unblur.</p>
              </div>
            )}

            {(!remoteStream || connectionState !== 'connected') && !isShieldBlurred && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 gap-3 z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 animate-pulse">
                  <Camera className="w-8 h-8 text-zinc-600" />
                </div>
                <span className="text-xs text-zinc-400 font-medium">
                  {connectionState === 'connecting' ? 'Connecting media...' : 'Waiting for video stream...'}
                </span>
              </div>
            )}
          </div>

          {/* User Local Video */}
          <div
            className={`relative bg-zinc-900 overflow-hidden transition-all ${
              isSplitView
                ? 'h-full w-full rounded-2xl border border-zinc-800/80'
                : 'absolute bottom-16 right-4 sm:bottom-20 sm:right-6 z-20 w-36 h-48 sm:w-48 sm:h-64 rounded-2xl border-2 border-emerald-500/90 shadow-2xl'
            }`}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover bg-black -scale-x-100"
            />
            <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-[11px] font-semibold text-emerald-400 backdrop-blur-md">
              {isSplitView ? 'You (Me)' : 'You'}
            </div>
            {isVideoOff && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 gap-2 z-10">
                <VideoOff className="w-6 h-6 text-zinc-600" />
                <span className="text-[10px] text-zinc-400">Camera Off</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 backdrop-blur-xl shadow-2xl">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isMuted
              ? 'bg-rose-950/90 border-rose-800 text-rose-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:text-white'
          }`}
          title="Mute Microphone (Shortcut: M)"
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isVideoOff
              ? 'bg-rose-950/90 border-rose-800 text-rose-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:text-white'
          }`}
          title="Turn Camera On/Off (Shortcut: V)"
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleShieldBlur}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            isShieldBlurred
              ? 'bg-rose-950/90 border-rose-800 text-rose-400'
              : 'bg-zinc-900 border-zinc-800 text-emerald-400 hover:text-emerald-300'
          }`}
          title="Emergency Shield Blur (Shortcut: B)"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
