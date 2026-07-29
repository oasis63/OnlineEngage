'use client';

import React from 'react';
import { Card, Badge } from '@anonchat/ui';
import { Shield, Lock, Cpu, Globe, HeartHandshake, EyeOff } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="w-full space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="emerald" className="px-3 py-1">
            About AnonChat
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Zero Tracking. 100% Anonymous.
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            AnonChat is a modern, ultra-fast anonymous random video, voice, and text chat platform built specifically for India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-zinc-800 bg-zinc-950/60 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">No Database & No Signups</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We do not ask for phone numbers, emails, names, or logins. No user profiles or messages are ever saved or persisted on any server database.
            </p>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/60 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-950/60 text-teal-400 border border-teal-800/50">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Peer-to-Peer WebRTC</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Video and voice streams are transmitted directly peer-to-peer between your browser and your partner using WebRTC encrypted media channels.
            </p>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/60 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/50">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Indian Regional Languages</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Find partners fluent in English, Hindi, Tamil, Kannada, Malayalam, Telugu, Marathi, or Gujarati to converse comfortably in your native language.
            </p>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/60 p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/50">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Redis Queue Matchmaking</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              High performance sub-second priority matching algorithm pairs users sharing similar interests first before falling back to random match.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
