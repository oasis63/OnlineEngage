import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Video, Shield, Zap, Globe, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Free Random Video Chat with Strangers in India — 1-on-1 HD Video | Womegle',
  description: 'Connect to free random video chat with strangers across India. 1-on-1 WebRTC video call with gender preference, 8 Indian languages, and zero registration at Womegle.in.',
  keywords: ['Random video chat', 'Free random video chat India', '1-on-1 video call strangers', 'Online video chat India'],
  alternates: {
    canonical: 'https://womegle.in/random-video-chat',
  },
};

export default function RandomVideoChatPage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <Video className="w-4 h-4" /> HD 1-on-1 Random Video Chat
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Free Random Video Chat with Strangers
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Meet interesting people face-to-face from Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, and across India in high-definition random video chat rooms.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/60 font-bold">
              Start Random Video Chat Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none space-y-8 border-t border-zinc-800/80 pt-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">How Random Video Chat Works on Womegle</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Random video chat connects two strangers via live video feeds with the click of a single button. On Womegle (womegle.in), video streams are transmitted directly between browsers using encrypted WebSockets and peer-to-peer WebRTC technology.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            If you ever want to switch to a new stranger, simply click **Next** or press your keyboard shortcut. Matchmaking happens in under 2 seconds!
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Why Womegle Offers the Best Video Chat Experience in India</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300 list-none pl-0">
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">50/50 Dual & PIP Views</strong>
                Flexibly toggle between side-by-side dual view, floating PIP overlay, and fullscreen video.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Mobile Camera Support</strong>
                Optimized for Android Chrome and iOS Safari with built-in camera permission guides.
              </div>
            </li>
          </ul>
        </section>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-8 border-t border-zinc-800">
        <Link href="/">
          <Button variant="primary" className="text-base px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-950/80 font-black">
            Start Free Video Call <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
