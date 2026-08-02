import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Shield, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Chat with Girls & Guys in India — Gender Preference Random Chat | Womegle',
  description: 'Looking to chat with girls or guys in India? Womegle features instant gender preference matching, 8 regional Indian languages, and safe 1-on-1 text, voice, and video chat.',
  keywords: ['Chat with girls India', 'Talk to girls online India', 'Gender preference random chat', 'Meet Indian girls online'],
  alternates: {
    canonical: 'https://womegle.in/chat-with-girls-india',
  },
};

export default function ChatWithGirlsIndiaPage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-xs font-semibold text-rose-400">
          <Heart className="w-4 h-4" /> Gender Preference Matchmaking
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Chat with Girls & Guys in India
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Select your preferred gender match on Womegle (womegle.in). Priority matchmaking matches you with your interested gender (Female, Male, or Anyone) instantly across India.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/60 font-bold">
              Start Gender Matched Chat <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none space-y-8 border-t border-zinc-800/80 pt-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">How Gender Preference Matchmaking Works</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Unlike basic random chat sites, Womegle allows users to specify their own gender and select their interested gender preference (Female, Male, Other, or Anyone). Our Upstash Cloud Redis algorithm prioritizes mutual gender matches so you spend more time having engaging conversations and less time clicking next.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Safe & Respectful Environment</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Womegle enforces rate-limiting, message sanitization, and immediate partner disconnection to ensure all users enjoy a safe and respectful chatting environment.
          </p>
        </section>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-8 border-t border-zinc-800">
        <Link href="/">
          <Button variant="primary" className="text-base px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-950/80 font-black">
            Start Matched Chat Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
