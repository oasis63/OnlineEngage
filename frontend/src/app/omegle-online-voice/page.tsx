import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mic, Volume2, Shield, Radio, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Omegle Online Voice — Anonymous 1-on-1 Audio Calls India | Womegle',
  description: 'Looking for Omegle online voice chat? Talk to strangers in India using crystal-clear audio calls. Gender preference, language filters, and complete anonymity.',
  keywords: ['Omegle online voice', 'Omegle voice call', 'Anonymous audio chat India', 'Voice chat with strangers'],
  alternates: {
    canonical: 'https://womegle.in/omegle-online-voice',
  },
};

export default function OmegleOnlineVoicePage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <Mic className="w-4 h-4" /> #1 Omegle Online Voice Alternative
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Omegle Online Voice Call in India
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          Prefer voice conversation without turning on your camera? Womegle offer high-definition 1-on-1 anonymous audio calls with zero video required.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3 rounded-xl shadow-lg shadow-emerald-900/40">
              Start Free Voice Call <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Volume2 className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">Crystal-Clear Audio</h2>
          <p className="text-xs text-zinc-400">High-bitrate Opus audio codec ensures natural voice clarity with minimal data usage.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Radio className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">No Camera Needed</h2>
          <p className="text-xs text-zinc-400">Enjoy relaxing late-night voice chats without worrying about camera lighting or background.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">Private & Instant</h2>
          <p className="text-xs text-zinc-400">Skip registration and talk freely with strangers matching your language and interests.</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none space-y-4 pt-6 border-t border-zinc-800">
        <h2 className="text-xl font-bold text-white">Why Womegle is the Best Omegle Online Voice Alternative</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Audio-only chat is one of the most popular ways to make new friends online. Womegle connects users across 8 Indian languages (Hindi, English, Hinglish, Tamil, Telugu, Kannada, Malayalam, Marathi) for instant 1-on-1 voice calls with zero setup delay.
        </p>
      </div>
    </div>
  );
}
