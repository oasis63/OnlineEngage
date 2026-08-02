'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Shield, Info, Lock, Globe, Video, Mic } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Wom<span className="text-emerald-500">egle</span>
              </span>
            </Link>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Womegle (womegle.in) is India&apos;s #1 free anonymous online chat, random video call & voice chat platform. Connect with strangers across India instantly with zero registration, gender preference filters, and 8 Indian languages support.
            </p>
          </div>

          {/* Featured SEO Topics Col 1 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Online Video Calls</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/random-video-chat" className="hover:text-emerald-400 transition-colors">
                  Random Video Chat India
                </Link>
              </li>
              <li>
                <Link href="/video-chat-with-strangers" className="hover:text-emerald-400 transition-colors">
                  Video Chat with Strangers
                </Link>
              </li>
              <li>
                <Link href="/omegle-online-video" className="hover:text-emerald-400 transition-colors">
                  Omegle Online Video Call
                </Link>
              </li>
              <li>
                <Link href="/omegle-alternative" className="hover:text-emerald-400 transition-colors">
                  Best Omegle Alternative (2026)
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured SEO Topics Col 2 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Online Chat & Voice</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/anonymous-chat-india" className="hover:text-emerald-400 transition-colors">
                  Anonymous Chat India
                </Link>
              </li>
              <li>
                <Link href="/talk-to-strangers" className="hover:text-emerald-400 transition-colors">
                  Talk to Strangers Online
                </Link>
              </li>
              <li>
                <Link href="/omegle-online-voice" className="hover:text-emerald-400 transition-colors">
                  Online Voice Chat (No Cam)
                </Link>
              </li>
              <li>
                <Link href="/chat-with-girls-india" className="hover:text-emerald-400 transition-colors">
                  Chat with Girls & Guys
                </Link>
              </li>
            </ul>
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
                <Link href="/safe-random-chat" className="hover:text-emerald-400 transition-colors">
                  Safe Random Chat Rules
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Comprehensive SEO Keyword Tag Cloud / Topic Directory */}
        <div className="pt-6 border-t border-zinc-800/60 space-y-3">
          <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Popular Search Topics in India</h4>
          <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500">
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">Online Chat India</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">Online Video Calls</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">Online Voice Chat</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">Hindi Random Video Chat</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">Tamil Anonymous Chat</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">Telugu Online Call</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">Indian Omegle Alternative</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">1-on-1 Cam Chat</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">No Registration Chat Room</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">Talk to Strangers Free</span>
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
