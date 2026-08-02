import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Video, Camera, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const metadata: Metadata = {
  title: '1-on-1 Video Chat with Strangers Online Free | Womegle',
  description: 'Enjoy free 1-on-1 video chat with strangers online. Womegle offers HD video calls, gender matching, 8 Indian languages, and zero registration.',
  keywords: ['Video chat with strangers', '1 on 1 video chat strangers', 'Free video chat online', 'Stranger video call India'],
  alternates: {
    canonical: 'https://womegle.in/video-chat-with-strangers',
  },
};

export default function VideoChatWithStrangersPage() {
  return (
    <div className="flex-1 bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-400">
          <Video className="w-4 h-4" /> 1-on-1 HD Video Chat
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Video Chat with Strangers Online
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Connect face-to-face with random people across India. Switch between 50/50 Dual Equal View, Picture-in-Picture (PIP), and Fullscreen Video mode.
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/60 font-bold">
              Start Video Chat Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-invert max-w-none space-y-8 border-t border-zinc-800/80 pt-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Why Womegle Offers the Best Video Call Experience</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Womegle (womegle.in) utilizes WebRTC P2P media streaming and Google STUN / Coturn TURN servers. This guarantees smooth video quality even on 4G/5G mobile connections with minimal latency.
          </p>
        </section>
      </div>

      {/* CTA Bottom */}
      <div className="text-center pt-8 border-t border-zinc-800">
        <Link href="/">
          <Button variant="primary" className="text-base px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-950/80 font-black">
            Join Video Chat Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
