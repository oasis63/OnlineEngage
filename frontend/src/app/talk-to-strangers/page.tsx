import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Users, Globe, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: 'Talk to Strangers Online Free — No Registration Required | Womegle',
  description: 'Want to talk to strangers online for free? Womegle allows you to connect instantly with strangers across India via text, voice, or video chat. Zero sign-up.',
  keywords: ['Talk to strangers', 'Talk to strangers online free', 'Meet strangers online', 'Chat with strangers India'],
  alternates: {
    canonical: 'https://womegle.in/talk-to-strangers',
  },
};

export default function TalkToStrangersPage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <Users className="w-4 h-4" /> Instant Stranger Matchmaking
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Talk to Strangers Online Free
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Break out of your social routine and make new friends across India. Whether you want to talk about movies, cricket, tech, or share life stories, Womegle pairs you instantly.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/60 font-bold">
              Talk to a Stranger Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none space-y-8 border-t border-zinc-800/80 pt-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Why Talk to Strangers on Womegle?</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Talking to strangers gives you an unbiased perspective and an opportunity to practice communication skills in a safe environment. On Womegle (womegle.in), you can filter chat partners by 8 regional Indian languages (Hindi, English, Hinglish, Tamil, Telugu, Kannada, Malayalam, Marathi) and tag your favorite interests (e.g. #anime, #coding, #music).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">How to Get Started in 3 Simple Steps</h2>
          <ol className="text-xs text-zinc-300 list-decimal list-inside space-y-3">
            <li>Choose your preferred chat mode: **Text Chat**, **Video Chat**, or **Voice Chat**.</li>
            <li>Select your display nickname, age, gender preference, and regional language filter.</li>
            <li>Click **Start Chatting Now** to meet someone new instantly!</li>
          </ol>
        </section>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-8 border-t border-zinc-800">
        <Link href="/">
          <Button variant="primary" className="text-base px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-950/80 font-black">
            Start Talking Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
