import { useState, useEffect } from 'react';

export interface MediaDeviceInfoSimple {
  deviceId: string;
  label: string;
}

export function useMediaDevices() {
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfoSimple[]>([]);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfoSimple[]>([]);

  useEffect(() => {
    async function getDevices() {
      try {
        // Request permissions first to obtain device labels
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).catch(() => {});
        const devices = await navigator.mediaDevices.enumerateDevices();

        const audio = devices
          .filter((d) => d.kind === 'audioinput')
          .map((d, index) => ({ deviceId: d.deviceId, label: d.label || `Microphone ${index + 1}` }));

        const video = devices
          .filter((d) => d.kind === 'videoinput')
          .map((d, index) => ({ deviceId: d.deviceId, label: d.label || `Camera ${index + 1}` }));

        setAudioInputs(audio);
        setVideoInputs(video);
      } catch (err) {
        console.error('Error enumerating media devices:', err);
      }
    }

    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      getDevices();
    }
  }, []);

  return { audioInputs, videoInputs };
}
