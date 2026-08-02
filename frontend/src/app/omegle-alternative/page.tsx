import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Video, MessageSquare, Mic, Globe, Zap, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Best Omegle Alternative in India (2026) — 100% Free Anonymous Video & Text Chat | Womegle',
  description: 'Looking for the best Omegle alternative in India? Womegle (womegle.in) offers free random video, voice, and text chat with gender preference, 8 Indian languages, and zero sign-up.',
  keywords: ['Omegle alternative', 'Best Omegle alternative India', 'Omegle replacement', 'Omegle alternative 2026', 'Womegle'],
  alternates: {
    canonical: 'https://womegle.in/omegle-alternative',
  },
};

export default function OmegleAlternativePage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <Zap className="w-4 h-4" /> #1 Omegle Alternative in India (2026)
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Best Omegle Alternative in India (2026)
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Since Omegle shut down, millions of users across India have been searching for a reliable, safe, and instant random video and text chat alternative. Womegle (womegle.in) is engineered specifically for India with gender filters, 8 regional languages, and zero registration.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/60 font-bold">
              Start Chatting on Womegle Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Video className="w-8 h-8 text-emerald-400" />
          <h3 className="text-base font-bold">HD WebRTC Video</h3>
          <p className="text-xs text-zinc-400">Ultra-fast 50/50 dual equal view, PIP overlay, and fullscreen video modes with zero lag.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Globe className="w-8 h-8 text-emerald-400" />
          <h3 className="text-base font-bold">8 Indian Languages</h3>
          <p className="text-xs text-zinc-400">Match with strangers who speak Hindi, English, Hinglish, Tamil, Telugu, Kannada, Malayalam, or Marathi.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <h3 className="text-base font-bold">Zero Sign-Up Required</h3>
          <p className="text-xs text-zinc-400">No email, phone number, or profile registration. All chat sessions live strictly in ephemeral RAM memory.</p>
        </div>
      </div>

      {/* Longform SEO Content */}
      <div className="prose prose-invert max-w-none space-y-8 border-t border-zinc-800/80 pt-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">What Happened to Omegle and Why Womegle is the Best Replacement</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            In November 2023, Omegle officially shut down after 14 years of operation. For over a decade, Omegle was the global epicenter of 1-on-1 random video chat. However, Omegle lacked localized language filters, gender matching preferences, and modern WebRTC video optimizations required for seamless mobile performance in India.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Womegle (womegle.in) was built to fill this void for Indian internet users. Combining lightning-fast Socket.io matchmaking, cloud-hosted Upstash Redis session queues, and encrypted WebRTC peer-to-peer streams, Womegle provides the ultimate Omegle alternative.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Key Features That Make Womegle Superior to Omegle</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300 list-none pl-0">
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Gender Preference Matching</strong>
                Filter chat partners by female, male, or anyone to ensure comfortable and meaningful conversations.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">8 Indian Languages Filter</strong>
                Connect with people speaking your native language across all 28 states and union territories.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Multiple Video View Modes</strong>
                Switch between 50/50 Dual Equal View, Picture-in-Picture (PIP) Overlay, and Fullscreen Video Mode.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Crystal-Clear Voice Calls</strong>
                Low-latency 1-on-1 audio chat for users who prefer talking without turning on their camera.
              </div>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions (FAQ)</h2>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white">Is Womegle completely free to use?</h3>
              <p className="text-xs text-zinc-400">Yes! Womegle is 100% free with unlimited text, voice, and video chats. No premium subscriptions required.</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white">Do I need to register or sign up?</h3>
              <p className="text-xs text-zinc-400">No. Womegle requires zero registration. Simply pick a nickname and start chatting instantly.</p>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-8 border-t border-zinc-800">
        <Link href="/">
          <Button variant="primary" className="text-base px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-950/80 font-black">
            Join Womegle Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
