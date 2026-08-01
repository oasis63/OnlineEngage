import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Shield, Globe, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Omegle Online Chat — Best Anonymous Text Chat Platform in India | Womegle',
  description: 'Looking for Omegle online chat? Womegle is India\'s top free anonymous text chat platform. Connect instantly with strangers by gender preference & 8 Indian languages with zero sign-up.',
  keywords: ['Omegle online chat', 'Omegle text chat', 'Anonymous text chat India', 'Omegle alternative text chat'],
  alternates: {
    canonical: 'https://womegle.in/omegle-online-chat',
  },
};

export default function OmegleOnlineChatPage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <MessageSquare className="w-4 h-4" /> #1 Omegle Online Chat Replacement
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Omegle Online Chat in India
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          Since Omegle shut down, millions of users in India search for safe, real-time anonymous text chat. Womegle brings back the thrill of random 1-on-1 text chatting with instant gender and language filters.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3 rounded-xl shadow-lg shadow-emerald-900/40">
              Start Free Online Chat Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Shield className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">100% Anonymous & Safe</h2>
          <p className="text-xs text-zinc-400">No email, phone number, or login required. Chat freely with complete privacy.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Globe className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">8 Indian Languages</h2>
          <p className="text-xs text-zinc-400">Filter chat partners in Hindi, English, Hinglish, Tamil, Telugu, Kannada, Malayalam, or Marathi.</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <Users className="w-8 h-8 text-emerald-400" />
          <h2 className="text-base font-bold">Gender Preference</h2>
          <p className="text-xs text-zinc-400">Select your preferred gender match for meaningful conversations.</p>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="prose prose-invert max-w-none space-y-4 pt-6 border-t border-zinc-800">
        <h2 className="text-xl font-bold text-white">Why Womegle is the Best Omegle Online Chat Alternative</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Omegle was famous for its simple text chat interface where strangers could talk about shared interests. Womegle upgrades the classic Omegle online chat experience by adding rate-limit protection, bright emerald scrollbars, partner typing indicators, and shared interest tag matching tailored specifically for Indian users.
        </p>

        <h3 className="text-lg font-semibold text-zinc-200">How to Start Online Text Chatting:</h3>
        <ol className="text-xs text-zinc-400 list-decimal list-inside space-y-2">
          <li>Click the <strong>Start Free Online Chat Now</strong> button above.</li>
          <li>Choose your display nickname, age, gender preference, and language.</li>
          <li>Click <strong>Start Chatting</strong> to connect instantly with a stranger!</li>
        </ol>
      </div>
    </div>
  );
}
