import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getIceServers } from '@anonchat/shared';
import { SignalPayload, IceCandidatePayload } from '@anonchat/types';
import { useChatStore } from '../stores/useChatStore';
import { useSettingsStore } from '../stores/useSettingsStore';

export function useWebRTC(socket: Socket | null) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const { status, mode, roomId, peerInitiator } = useChatStore();
  const { isAudioMuted, isVideoOff, selectedAudioInput, selectedVideoInput } = useSettingsStore();

  const requestMediaPermissions = useCallback(async () => {
    setPermissionError(null);
    if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
      setPermissionError(
        'Mobile browsers require HTTPS for camera and microphone access. Please open using https://' +
          window.location.hostname +
          ':8443'
      );
      return null;
    }

    try {
      const audioConstraints: boolean | MediaTrackConstraints = selectedAudioInput
        ? { deviceId: { exact: selectedAudioInput }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        : { echoCancellation: true, noiseSuppression: true, autoGainControl: true };

      const videoConstraints: boolean | MediaTrackConstraints =
        mode === 'video'
          ? selectedVideoInput
            ? { deviceId: { exact: selectedVideoInput }, width: { ideal: 1280 }, height: { ideal: 720 } }
            : { width: { ideal: 1280 }, height: { ideal: 720 } }
          : false;

      const constraints: MediaStreamConstraints = {
        audio: audioConstraints,
        video: videoConstraints,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // Ensure all tracks are enabled by default
      stream.getTracks().forEach((t) => (t.enabled = true));
      setLocalStream(stream);
      return stream;
    } catch (err: any) {
      console.error('Error requesting media permissions:', err);
      const errMsg =
        err?.name === 'NotAllowedError'
          ? 'Camera/microphone permission was denied by browser settings.'
          : err?.message || 'Failed to access camera and microphone.';
      setPermissionError(errMsg);
      return null;
    }
  }, [mode, selectedAudioInput, selectedVideoInput]);

  // Request media when connected or mode changes
  useEffect(() => {
    if (status !== 'connected' || mode === 'text') {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      setRemoteStream(null);
      remoteStreamRef.current = null;
      setPermissionError(null);
      return;
    }

    if (!localStream) {
      requestMediaPermissions();
    }
  }, [status, mode, localStream, requestMediaPermissions]);

  // Manage WebRTC PeerConnection
  useEffect(() => {
    if (!socket || status !== 'connected' || !roomId || mode === 'text' || !localStream) {
      return;
    }

    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const pc = new RTCPeerConnection({
      iceServers: getIceServers(host),
    });
    peerConnectionRef.current = pc;
    pendingCandidatesRef.current = [];
    
    // Maintain persistent remoteStream instance
    const remoteMediaStream = new MediaStream();
    remoteStreamRef.current = remoteMediaStream;

    // Add local tracks to peer connection
    localStream.getTracks().forEach((track) => {
      track.enabled = true;
      pc.addTrack(track, localStream);
    });

    // Handle remote track events - accumulate all tracks (Audio + Video)
    pc.ontrack = (event) => {
      console.log('WebRTC ontrack received track:', event.track.kind, event.track.id);
      event.track.enabled = true;

      if (remoteStreamRef.current) {
        const existingTracks = remoteStreamRef.current.getTracks();
        if (!existingTracks.some((t) => t.id === event.track.id)) {
          remoteStreamRef.current.addTrack(event.track);
        }
      }

      setRemoteStream(remoteStreamRef.current);
    };

    // Send local ICE candidates over Socket.IO
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const payload: IceCandidatePayload = {
          roomId,
          candidate: event.candidate.toJSON(),
        };
        socket.emit('iceCandidate', payload);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('WebRTC Connection state:', pc.connectionState);
      setConnectionState(pc.connectionState);
    };

    // Helper to process buffered candidates after setting remote description
    const processPendingCandidates = async () => {
      while (pendingCandidatesRef.current.length > 0) {
        const candidate = pendingCandidatesRef.current.shift();
        if (candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error('Error adding buffered ICE candidate:', e);
          }
        }
      }
    };

    // Signaling handlers
    const handleOffer = async (payload: SignalPayload) => {
      if (payload.roomId !== roomId) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        await processPendingCandidates();

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, sdp: answer });
      } catch (err) {
        console.error('Error handling WebRTC offer:', err);
      }
    };

    const handleAnswer = async (payload: SignalPayload) => {
      if (payload.roomId !== roomId) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        await processPendingCandidates();
      } catch (err) {
        console.error('Error handling WebRTC answer:', err);
      }
    };

    const handleIceCandidate = async (payload: IceCandidatePayload) => {
      if (payload.roomId !== roomId) return;
      try {
        if (pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } else {
          pendingCandidatesRef.current.push(payload.candidate);
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('iceCandidate', handleIceCandidate);

    // If initiator, create and emit offer
    if (peerInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (pc.localDescription) {
            socket.emit('offer', { roomId, sdp: pc.localDescription });
          }
        })
        .catch((err) => console.error('Error creating WebRTC offer:', err));
    }

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('iceCandidate', handleIceCandidate);
      pc.close();
      peerConnectionRef.current = null;
      remoteStreamRef.current = null;
      pendingCandidatesRef.current = [];
    };
  }, [socket, status, roomId, mode, peerInitiator, localStream]);

  // Sync mute & camera toggles with localStream tracks
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioMuted;
      });
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOff;
      });
    }
  }, [localStream, isAudioMuted, isVideoOff]);

  return {
    localStream,
    remoteStream,
    connectionState,
    permissionError,
    requestMediaPermissions,
  };
}
