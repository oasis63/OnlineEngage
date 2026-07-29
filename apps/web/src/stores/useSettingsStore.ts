import { create } from 'zustand';
import { IndianLanguage } from '@anonchat/types';

interface SettingsState {
  defaultLanguage: IndianLanguage;
  videoQuality: '720p' | '1080p' | '480p';
  selectedAudioInput: string;
  selectedVideoInput: string;
  isAudioMuted: boolean;
  isVideoOff: boolean;

  setDefaultLanguage: (lang: IndianLanguage) => void;
  setVideoQuality: (quality: '720p' | '1080p' | '480p') => void;
  setSelectedAudioInput: (deviceId: string) => void;
  setSelectedVideoInput: (deviceId: string) => void;
  toggleAudioMute: () => void;
  toggleVideoOff: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  defaultLanguage: 'en',
  videoQuality: '720p',
  selectedAudioInput: '',
  selectedVideoInput: '',
  isAudioMuted: false,
  isVideoOff: false,

  setDefaultLanguage: (defaultLanguage) => set({ defaultLanguage }),
  setVideoQuality: (videoQuality) => set({ videoQuality }),
  setSelectedAudioInput: (selectedAudioInput) => set({ selectedAudioInput }),
  setSelectedVideoInput: (selectedVideoInput) => set({ selectedVideoInput }),
  toggleAudioMute: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  toggleVideoOff: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
}));
