import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, Shield, MessageSquare, Globe, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Anonymous Chat India — 100% Private 1-on-1 Online Chat | Womegle',
  description: 'Looking for anonymous chat in India? Womegle offers 100% private text, voice, and video chat with zero data logging, zero registration, and 8 Indian language filters.',
  keywords: ['Anonymous chat India', 'Private chat online', 'Anonymous messaging India', 'Talk anonymously India'],
  alternates: {
    canonical: 'https://womegle.in/anonymous-chat-india',
  },
};

export default function AnonymousChatIndiaPage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <Lock className="w-4 h-4" /> 100% Private & Ephemeral
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Anonymous Chat in India
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Express yourself freely without revealing your identity. Womegle (womegle.in) ensures your personal details, phone number, and location remain 100% private.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/60 font-bold">
              Start Anonymous Chat Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none space-y-8 border-t border-zinc-800/80 pt-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Zero Log Policy & Complete Anonymity</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Privacy is the foundation of Womegle. We do not require account registration, Facebook logins, or phone verification. All chat sessions, text messages, and signaling data exist strictly in temporary RAM memory during your active conversation. The moment you click **Disconnect** or close the browser tab, session memory is purged automatically.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Features of Anonymous Chat on Womegle</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300 list-none pl-0">
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">No Tracking Cookies</strong>
                No cross-site tracking or selling user data to third-party ad networks.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Encrypted P2P Media</strong>
                Audio and video calls stream directly between browsers over WebRTC encryption.
              </div>
            </li>
          </ul>
        </section>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-8 border-t border-zinc-800">
        <Link href="/">
          <Button variant="primary" className="text-base px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-950/80 font-black">
            Start Private Chat <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
