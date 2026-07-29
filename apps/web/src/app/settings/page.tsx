'use client';

import React from 'react';
import { Card, Button, Badge } from '@anonchat/ui';
import { Settings, Mic, Video, Globe, Sliders, Check } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useMediaDevices } from '../../hooks/useMediaDevices';
import { SUPPORTED_LANGUAGES } from '@anonchat/shared';
import { IndianLanguage } from '@anonchat/types';

export default function SettingsPage() {
  const {
    defaultLanguage,
    videoQuality,
    selectedAudioInput,
    selectedVideoInput,
    setDefaultLanguage,
    setVideoQuality,
    setSelectedAudioInput,
    setSelectedVideoInput,
  } = useSettingsStore();

  const { audioInputs, videoInputs } = useMediaDevices();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <div className="w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
            <p className="text-sm text-zinc-400">Configure your hardware devices, video quality, and language defaults.</p>
          </div>
        </div>

        <Card className="border-zinc-800/80 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Audio Input Device */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-400" /> Audio Input (Microphone)
            </label>
            <select
              value={selectedAudioInput}
              onChange={(e) => setSelectedAudioInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">Default Microphone</option>
              {audioInputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>

          {/* Video Input Device */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" /> Video Input (Camera)
            </label>
            <select
              value={selectedVideoInput}
              onChange={(e) => setSelectedVideoInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">Default Camera</option>
              {videoInputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>

          {/* Video Quality Resolution */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Video Quality
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['480p', '720p', '1080p'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setVideoQuality(q)}
                  className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    videoQuality === q
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {videoQuality === q && <Check className="w-4 h-4" />}
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Default Language Preference */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" /> Default Match Language
            </label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value as IndianLanguage)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </Card>
      </div>
    </div>
  );
}
