'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { MessageSquare, Settings, RefreshCw, Zap } from 'lucide-react';
import { useChatStore } from '../stores/useChatStore';

export const Navbar: React.FC = () => {
  const { status, mode, fullReset } = useChatStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Wom<span className="text-emerald-500">egle</span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-400/90 tracking-wider uppercase">
              INDIA&apos;S #1 ANONYMOUS CHAT
            </span>
          </div>
        </Link>

        {/* Dynamic Center Badge */}
        <div className="hidden sm:flex items-center gap-2">
          {status === 'connected' ? (
            <Badge variant="emerald" className="animate-pulse flex items-center gap-1.5 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Connected ({mode.toUpperCase()})
            </Badge>
          ) : status === 'waiting' ? (
            <Badge variant="amber" className="animate-pulse flex items-center gap-1.5 px-3 py-1 text-xs">
              <RefreshCw className="h-3 w-3 animate-spin text-amber-400" />
              Searching Stranger...
            </Badge>
          ) : (
            <Badge variant="default" className="flex items-center gap-1.5 px-3 py-1 text-xs text-zinc-400">
              <Zap className="h-3 w-3 text-emerald-400" /> Instant Matchmaking
            </Badge>
          )}
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {status !== 'idle' && (
            <Button
              variant="outline"
              size="sm"
              onClick={fullReset}
              className="text-xs text-zinc-400 hover:text-rose-400 border-zinc-800 hover:border-rose-900/50"
            >
              Leave
            </Button>
          )}

          <Link href="/settings">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs">
              <Settings className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
