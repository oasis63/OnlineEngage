import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Video, Camera, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Omegle Online Video — Best 1-on-1 Random Video Chat in India | Womegle',
  description: 'Looking for Omegle online video chat? Womegle is India\'s premier free 1-on-1 random video call platform. Fullscreen HD video, 50/50 dual view, PIP mode, and zero registration.',
  keywords: ['Omegle online video', 'Omegle video chat', 'Random video chat India', 'Indian Omegle video call'],
  alternates: {
    canonical: 'https://womegle.in/omegle-online-video',
  },
};

export default function OmegleOnlineVideoPage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <Video className="w-4 h-4" /> #1 Omegle Online Video Alternative
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Omegle Online Video Call in India
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          Experience ultra-low latency WebRTC 1-on-1 random video chat. Switch seamlessly between 50/50 Dual Equal View, PIP Overlay, and Fullscreen Video Mode without stream interruptions.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3 rounded-xl shadow-lg shadow-emerald-900/40">
              Start Free Video Chat <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Camera className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">HD WebRTC Video</h2>
          <p className="text-xs text-zinc-400">Encrypted peer-to-peer WebRTC video stream with custom view layout modes.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Zap className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">Instant Matchmaking</h2>
          <p className="text-xs text-zinc-400">Redis-powered cloud matchmaking engine connects you in under 2 seconds.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">Privacy Guaranteed</h2>
          <p className="text-xs text-zinc-400">No account required. Camera permissions are strictly local and temporary.</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none space-y-4 pt-6 border-t border-zinc-800">
        <h2 className="text-xl font-bold text-white">Why Womegle is the Preferred Choice for Omegle Online Video Chat</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Finding a reliable Omegle online video replacement in India can be challenging due to broken streams or heavy lag. Womegle uses Google STUN servers and Coturn TURN fallback nodes to ensure crystal-clear video and audio quality across mobile networks (4G/5G) and Wi-Fi connections.
        </p>

        <h3 className="text-lg font-semibold text-zinc-200">How to Start Online Video Call:</h3>
        <ol className="text-xs text-zinc-400 list-decimal list-inside space-y-2">
          <li>Select <strong>Video Mode</strong> on the homepage.</li>
          <li>Allow camera & microphone access when prompted by your browser.</li>
          <li>Click <strong>Start Chatting</strong> to meet new people face-to-face!</li>
        </ol>
      </div>
    </div>
  );
}
