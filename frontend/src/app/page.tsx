'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  MessageSquare,
  Video,
  Mic,
  Globe,
  Plus,
  X,
  ArrowRight,
  User,
  Heart,
  Zap,
  AlertCircle,
  Minimize2,
  SlidersHorizontal,
  SkipForward,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../shared/index';
import { useChatStore } from '../stores/useChatStore';
import { useSocket } from '../hooks/useSocket';
import { useWebRTC } from '../hooks/useWebRTC';
import { WaitingScreen } from '../components/WaitingScreen';
import { TextChat } from '../components/TextChat';
import { VideoChat } from '../components/VideoChat';
import { VoiceChat } from '../components/VoiceChat';
import { RightSidebar } from '../components/RightSidebar';
import { IndianLanguage, QueueMode, UserGender, GenderPreference } from '../types/index';

export default function HomePage() {
  const {
    status,
    mode,
    name,
    gender,
    interestedIn,
    age,
    language,
    interests,
    partnerName,
    partnerGender,
    partnerAge,
    setName,
    setGender,
    setInterestedIn,
    setAge,
    setMode,
    setLanguage,
    setInterests,
  } = useChatStore();

  const { socket, joinQueue, leaveQueue, nextStranger, sendMessage, sendTyping, sendStopTyping } = useSocket();
  const { localStream, remoteStream, connectionState, permissionError, requestMediaPermissions } = useWebRTC(socket);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Default chat panel collapsed for video/voice mode
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  useEffect(() => {
    if (mode === 'text') {
      setIsChatPanelOpen(true);
    } else {
      setIsChatPanelOpen(false);
    }
  }, [mode, status]);

  const handleAddInterest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, '');
    if (cleaned && !interests.includes(cleaned) && interests.length < 10) {
      setInterests([...interests, cleaned]);
      setTagInput('');
    }
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter((i) => i !== tag));
  };

  const handleStartChatting = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError('Please enter your display name.');
      return;
    }
    if (!age || age < 13 || age > 120) {
      setFormError('Please enter a valid age (13-120).');
      return;
    }

    setIsModalOpen(false);
    if (mode !== 'text') {
      await requestMediaPermissions();
    }
    joinQueue();
  };

  const openModalWithMode = (selectedMode: QueueMode) => {
    setMode(selectedMode);
    setIsModalOpen(true);
  };

  if (status === 'waiting') {
    return <WaitingScreen onCancel={leaveQueue} />;
  }

  // Connected Chat View
  if (status === 'connected') {
    return (
      <div className="flex flex-1 flex-col md:flex-row h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] p-2 sm:p-3 max-w-[1600px] mx-auto w-full gap-3 overflow-hidden">
        {/* Mobile Top Connected Bar (Visible only on mobile screens) */}
        <div className="flex md:hidden items-center justify-between p-2.5 bg-zinc-950/90 border border-zinc-800 rounded-2xl backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-500/50">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">{partnerName || 'Stranger'}</div>
              <div className="text-[10px] text-zinc-400">
                {partnerAge ? `${partnerAge}y` : ''} {partnerGender ? `• ${partnerGender}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {mode !== 'text' && (
              <Button
                variant={isChatPanelOpen ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsChatPanelOpen(!isChatPanelOpen)}
                className={`text-xs py-1.5 px-2.5 font-bold ${
                  isChatPanelOpen ? 'bg-emerald-600 text-white' : ''
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                <span>Chat</span>
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={nextStranger}
              className="text-xs py-1.5 px-3 font-bold bg-emerald-600 hover:bg-emerald-500"
            >
              <SkipForward className="w-3.5 h-3.5 mr-1" /> Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={leaveQueue}
              className="text-xs py-1.5 px-2 text-zinc-400 hover:text-rose-400"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Main Center Stage: Text / Video / Voice */}
        <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0 min-w-0 h-full overflow-hidden">
          {/* Text Chat Only Mode */}
          {mode === 'text' && (
            <div className="flex-1 flex flex-col min-h-0 min-w-0 h-full">
              <TextChat
                onSendMessage={sendMessage}
                onSendTyping={sendTyping}
                onSendStopTyping={sendStopTyping}
              />
            </div>
          )}

          {/* Video Chat Mode */}
          {mode === 'video' && (
            <div className="flex-1 flex min-h-0 min-w-0 h-full overflow-hidden">
              <VideoChat
                localStream={localStream}
                remoteStream={remoteStream}
                connectionState={connectionState}
                permissionError={permissionError}
                onRequestPermissions={requestMediaPermissions}
              />
            </div>
          )}

          {/* Voice Chat Mode */}
          {mode === 'voice' && (
            <div className="flex-1 flex min-h-0 min-w-0 h-full overflow-hidden">
              <VoiceChat
                remoteStream={remoteStream}
                connectionState={connectionState}
                permissionError={permissionError}
                onRequestPermissions={requestMediaPermissions}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar: Contains Stranger card, Open Text Chat button & inline Chat drawer on Desktop */}
        <div className="hidden md:flex h-full">
          <RightSidebar
            onNext={nextStranger}
            onDisconnect={leaveQueue}
            isChatPanelOpen={isChatPanelOpen}
            onToggleChatPanel={() => setIsChatPanelOpen(!isChatPanelOpen)}
            onSendMessage={sendMessage}
            onSendTyping={sendTyping}
            onSendStopTyping={sendStopTyping}
          />
        </div>

        {/* Mobile Chat Bottom Sheet Drawer (Visible on small screens when chat is opened) */}
        {mode !== 'text' && isChatPanelOpen && (
          <div className="flex md:hidden fixed inset-x-0 bottom-0 z-50 h-[65vh] bg-zinc-950/95 border-t border-zinc-800 rounded-t-3xl backdrop-blur-2xl p-3 flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-800/80 mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> Chat with {partnerName || 'Stranger'}
              </span>
              <button
                onClick={() => setIsChatPanelOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <TextChat
                onSendMessage={sendMessage}
                onSendTyping={sendTyping}
                onSendStopTyping={sendStopTyping}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Real Homepage View
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full text-center">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-xs font-bold text-emerald-400 mb-6 shadow-lg shadow-emerald-950/50 backdrop-blur-md">
        <Zap className="w-4 h-4 text-emerald-400" /> India&apos;s #1 Anonymous Network
      </div>

      {/* Hero Taglines - Highlighting Text, Voice & Video Chat */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none mb-6">
        Text, Voice & Video Chat <br />
        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
          Instantly & Anonymously
        </span>
      </h1>

      <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
        No sign up required. Choose Text, HD Video, or Crystal-Clear Voice Chat to connect with strangers across India in seconds!
      </p>

      {/* Interactive Mode Cards on Hero Page */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mx-auto mb-8">
        <button
          onClick={() => openModalWithMode('text')}
          className="flex flex-col items-center p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all text-center group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-0.5">Text Chat</h3>
          <p className="text-[11px] text-zinc-400">Instant 1-on-1 messaging</p>
        </button>

        <button
          onClick={() => openModalWithMode('video')}
          className="flex flex-col items-center p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all text-center group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-0.5">Video Chat</h3>
          <p className="text-[11px] text-zinc-400">50/50 Dual HD Video view</p>
        </button>

        <button
          onClick={() => openModalWithMode('voice')}
          className="flex flex-col items-center p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all text-center group cursor-pointer"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
            <Mic className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-0.5">Voice Chat</h3>
          <p className="text-[11px] text-zinc-400">Low-latency voice calls</p>
        </button>
      </div>

      {/* Hero Main Action Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => setIsModalOpen(true)}
        className="px-8 py-5 text-lg font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white rounded-2xl shadow-2xl shadow-emerald-950/80 hover:scale-105 transition-all group"
      >
        <span>Start Chatting Now</span>
        <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* Feature Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 w-full max-w-3xl">
        {[
          { label: 'Zero Sign Up', sub: 'Instant connection' },
          { label: '100% Private', sub: 'Session memory' },
          { label: '8 Languages', sub: 'Filter matches' },
          { label: 'HD Media', sub: 'Text, Voice & Video' },
        ].map((f, i) => (
          <div key={i} className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md text-center">
            <div className="text-xs font-bold text-white">{f.label}</div>
            <div className="text-[10px] text-zinc-400">{f.sub}</div>
          </div>
        ))}
      </div>

      {/* Profile & Matching Details Modal / Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-400" /> Matchmaking Profile
                </h3>
                <p className="text-xs text-zinc-400">Stored in temporary session only • Never saved on backend</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-950/90 border border-rose-800/50 p-3 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul, Priya, Alex"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Your Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as UserGender)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> Interested In
                  </label>
                  <select
                    value={interestedIn}
                    onChange={(e) => setInterestedIn(e.target.value as GenderPreference)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="all">Anyone (All)</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Age</label>
                  <input
                    type="number"
                    min={13}
                    max={120}
                    value={age || ''}
                    onChange={(e) => setAge(parseInt(e.target.value || '18', 10))}
                    placeholder="e.g. 21"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-400" /> Language Filter
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as IndianLanguage)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Optional Interests
                </label>
                <form onSubmit={handleAddInterest} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. coding, anime, bollywood, cricket"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <Button type="submit" variant="secondary" size="sm" disabled={!tagInput.trim()}>
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </form>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((tag) => (
                    <Badge key={tag} variant="amber" className="px-2.5 py-0.5 text-[11px] gap-1">
                      #{tag}
                      <button type="button" onClick={() => handleRemoveInterest(tag)}>
                        <X className="w-3 h-3 hover:text-rose-400" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Chat Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'text', label: 'Text Chat', icon: <MessageSquare className="w-4 h-4" /> },
                    { id: 'video', label: 'Video Chat', icon: <Video className="w-4 h-4" /> },
                    { id: 'voice', label: 'Voice Chat', icon: <Mic className="w-4 h-4" /> },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as QueueMode)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                        mode === m.id
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/40'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="mb-1">{m.icon}</div>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartChatting}
              className="w-full font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-400 py-3.5 text-base shadow-xl shadow-emerald-950/50"
            >
              <span>Start Chatting Now</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
