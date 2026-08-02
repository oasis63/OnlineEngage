'use client';

import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="emerald" className="px-3 py-1 text-xs">
          About Womegle.in
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          100% Anonymous 1-on-1 Connections
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Womegle connects people across India instantly for Text, Video, and Voice conversations without demanding personal data or account creation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <Card className="p-5 flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Log Policy</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            No profile creation, no phone numbers, no email addresses required. Sessions live only in memory.
          </p>
        </Card>

        <Card className="p-5 flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">8 Indian Languages</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Match with people who speak Hindi, English, Hinglish, Tamil, Telugu, Kannada, Malayalam, or Marathi.
          </p>
        </Card>

        <Card className="p-5 flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Encrypted P2P Media</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            WebRTC peer-to-peer video and voice calls stream directly between users without passing through servers.
          </p>
        </Card>
      </div>
    </div>
  );
}
