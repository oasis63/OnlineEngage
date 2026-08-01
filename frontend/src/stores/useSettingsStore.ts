import { create } from 'zustand';
import { IndianLanguage } from '../types/index';

interface SettingsState {
  theme: 'dark';
  defaultLanguage: IndianLanguage;
  soundEnabled: boolean;
  setDefaultLanguage: (lang: IndianLanguage) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  defaultLanguage: 'hindi',
  soundEnabled: true,
  setDefaultLanguage: (defaultLanguage) => set({ defaultLanguage }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
}));
