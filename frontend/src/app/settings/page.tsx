'use client';

import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Settings, Globe, Volume2, Shield } from 'lucide-react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { SUPPORTED_LANGUAGES } from '../../shared/index';
import { IndianLanguage } from '../../types/index';

export default function SettingsPage() {
  const { defaultLanguage, soundEnabled, setDefaultLanguage, setSoundEnabled } = useSettingsStore();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full space-y-6">
      <div className="text-center space-y-2">
        <Badge variant="emerald" className="px-3 py-1 text-xs">
          Preferences
        </Badge>
        <h1 className="text-3xl font-black text-white tracking-tight">App Settings</h1>
        <p className="text-zinc-400 text-xs sm:text-sm">
          Settings are stored locally in your browser storage.
        </p>
      </div>

      <Card className="w-full p-6 space-y-6">
        {/* Default Language Setting */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Default Matchmaking Language
            </h3>
            <p className="text-xs text-zinc-400">Pre-select your preferred language for quick matchmaking.</p>
          </div>
          <select
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value as IndianLanguage)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sound Notifications */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" /> Sound Notifications
            </h3>
            <p className="text-xs text-zinc-400">Play a subtle audio alert when connected with a stranger.</p>
          </div>
          <Button
            variant={soundEnabled ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-xs px-4"
          >
            {soundEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
