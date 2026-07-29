'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, Info, ShieldCheck } from 'lucide-react';
import { Button, Badge } from '@anonchat/ui';
import { useChatStore } from '../stores/useChatStore';

export const Navbar: React.FC = () => {
  const { fullReset } = useChatStore();

  const handleBrandClick = () => {
    fullReset();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" onClick={handleBrandClick} className="flex items-center gap-2 group cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 font-bold text-white shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Anon<span className="text-emerald-500">Chat</span>
            </span>
          </Link>
          <Badge variant="emerald" className="hidden sm:inline-flex gap-1 items-center">
            <ShieldCheck className="w-3 h-3" /> Anonymous & Secure
          </Badge>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          <Link href="/about">
            <Button variant="ghost" size="sm">
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">About</span>
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
