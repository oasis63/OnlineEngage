'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Shield, Info, Heart, Lock, Globe, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Wom<span className="text-emerald-500">egle</span>
              </span>
            </Link>
            <p className="text-zinc-400 max-w-md leading-relaxed">
              Womegle (womegle.in) is India&apos;s #1 free anonymous random 1-on-1 text, voice, and video chat platform. Connect with strangers across India instantly with zero registration, gender preference filters, and 8 Indian languages support.
            </p>
          </div>

          {/* Quick Links Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400" /> About Womegle
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-emerald-400 transition-colors">
                  Settings & Preferences
                </Link>
              </li>
              <li>
                <span className="text-zinc-500 cursor-not-allowed">Terms & Privacy (Zero Data Stored)</span>
              </li>
            </ul>
          </div>

          {/* Featured SEO Topics Col */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore Chat Modes</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/omegle-online-chat" className="hover:text-emerald-400 transition-colors">
                  Omegle Online Chat
                </Link>
              </li>
              <li>
                <Link href="/omegle-online-video" className="hover:text-emerald-400 transition-colors">
                  Omegle Online Video
                </Link>
              </li>
              <li>
                <Link href="/omegle-online-voice" className="hover:text-emerald-400 transition-colors">
                  Omegle Online Voice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-zinc-500">
          <p>© {new Date().getFullYear()} Womegle.in • Built for India 🇮🇳</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-zinc-400">
              <Lock className="w-3 h-3 text-emerald-400" /> 100% Session Encrypted
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Shield className="w-3 h-3 text-emerald-400" /> Zero Sign-Up Required
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
