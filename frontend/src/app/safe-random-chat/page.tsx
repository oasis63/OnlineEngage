import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Safe Random Chat Platform — Private & Moderated Online Chat | Womegle',
  description: 'Looking for a safe random chat platform? Womegle provides encrypted 1-on-1 text, voice, and video chat with zero data logging, rate-limit protection, and private P2P media streams.',
  keywords: ['Safe random chat', 'Safe Omegle alternative', 'Secure anonymous chat', 'Safe video chat India'],
  alternates: {
    canonical: 'https://womegle.in/safe-random-chat',
  },
};

export default function SafeRandomChatPage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> Safe & Secure Random Chat
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Safe Random Chat Platform
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Womegle (womegle.in) is engineered with privacy-by-design. Enjoy 1-on-1 random text, voice, and video conversations with full control and privacy protection.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/60 font-bold">
              Start Safe Chat Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none space-y-8 border-t border-zinc-800/80 pt-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Security & Safety Built Into Womegle</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300 list-none pl-0">
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Encrypted P2P Media Streams</strong>
                Video and voice calls are encrypted peer-to-peer over WebRTC, keeping your stream direct between devices.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Zero Data Logs</strong>
                No chat history, personal profiles, IP logs, or cookies are stored on our servers.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Rate Limit Protection</strong>
                Spam protection prevents malicious bots and automated spam scripts.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Instant Disconnect Button</strong>
                Disconnect or skip to a new partner at any moment with 1 click.
              </div>
            </li>
          </ul>
        </section>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-8 border-t border-zinc-800">
        <Link href="/">
          <Button variant="primary" className="text-base px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-950/80 font-black">
            Join Safe Chat Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
