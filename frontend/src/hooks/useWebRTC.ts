'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getIceServers } from '../shared/index';
import { SignalPayload, IceCandidatePayload } from '../types/index';
import { useChatStore } from '../stores/useChatStore';

export function useWebRTC(socket: Socket | null) {
  const { mode, status, roomId, partnerSocketId, peerInitiator } = useChatStore();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

  // Request camera / microphone permissions
  const requestMediaPermissions = useCallback(async () => {
    setPermissionError(null);

    // Security check: Chrome Android blocks getUserMedia on unsecure origins
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      console.warn('Insecure context detected. Media devices require HTTPS or chrome://flags configuration.');
      setPermissionError('CONNECTION_NOT_SECURE: Mobile Chrome blocks camera access over HTTP/IP addresses unless enabled in chrome://flags');
      return null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: mode === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      // If PC already exists, add tracks
      if (pcRef.current) {
        const senders = pcRef.current.getSenders();
        stream.getTracks().forEach((track) => {
          const senderExists = senders.some((s) => s.track && s.track.kind === track.kind);
          if (!senderExists) {
            pcRef.current?.addTrack(track, stream);
          }
        });
      }

      return stream;
    } catch (err: any) {
      console.error('Failed to get media permissions:', err);
      if (err.name === 'SecurityError' || !window.isSecureContext) {
        setPermissionError('CONNECTION_NOT_SECURE: Mobile Chrome blocks camera access over IP addresses');
      } else {
        setPermissionError(err.message || 'Media permission denied');
      }
      return null;
    }
  }, [mode]);

  // Clean up WebRTC connection
  const cleanupConnection = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }
    iceCandidatesQueue.current = [];
    setRemoteStream(null);
    setConnectionState('closed');
  }, []);

  // Clean up local media tracks
  const stopLocalMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
  }, []);

  // Process queued ICE candidates after setRemoteDescription
  const processQueuedIceCandidates = async (pc: RTCPeerConnection) => {
    while (iceCandidatesQueue.current.length > 0) {
      const candidate = iceCandidatesQueue.current.shift();
      if (candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding queued ICE candidate:', err);
        }
      }
    }
  };

  // Create PeerConnection
  const createPeerConnection = useCallback(() => {
    cleanupConnection();

    const pc = new RTCPeerConnection({
      iceServers: getIceServers(),
    });

    pcRef.current = pc;

    // Attach local stream tracks to PC
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming remote tracks
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      } else {
        const newStream = new MediaStream([event.track]);
        setRemoteStream(newStream);
      }
      setConnectionState('connected');
    };

    // Send ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket && partnerSocketId && roomId) {
        socket.emit('iceCandidate', {
          targetSocketId: partnerSocketId,
          candidate: event.candidate.toJSON(),
          roomId,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      if (pc.connectionState === 'connected') {
        setPermissionError(null);
      }
    };

    return pc;
  }, [socket, partnerSocketId, roomId, cleanupConnection]);

  // Handle Signaling Connection logic
  useEffect(() => {
    if (status !== 'connected' || !socket || !roomId || mode === 'text') {
      cleanupConnection();
      return;
    }

    let isMounted = true;
    const pc = createPeerConnection();

    // Signal Listeners
    const handleSignal = async ({ signal, fromSocketId }: SignalPayload) => {
      if (!isMounted || !pc) return;

      try {
        if (signal.type === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          await processQueuedIceCandidates(pc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit('signal', {
            targetSocketId: fromSocketId || partnerSocketId,
            signal: answer,
            roomId,
          });
        } else if (signal.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          await processQueuedIceCandidates(pc);
        }
      } catch (err) {
        console.error('Error handling WebRTC signal:', err);
      }
    };

    const handleIceCandidate = async ({ candidate }: IceCandidatePayload) => {
      if (!isMounted || !pc) return;

      try {
        if (pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          iceCandidatesQueue.current.push(candidate);
        }
      } catch (err) {
        console.error('Error adding ICE Candidate:', err);
      }
    };

    socket.on('signal', handleSignal);
    socket.on('iceCandidate', handleIceCandidate);

    // If initiator, create Offer
    if (peerInitiator) {
      (async () => {
        try {
          const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: mode === 'video',
          });
          await pc.setLocalDescription(offer);

          socket.emit('signal', {
            targetSocketId: partnerSocketId,
            signal: offer,
            roomId,
          });
        } catch (err) {
          console.error('Error creating WebRTC offer:', err);
        }
      })();
    }

    return () => {
      isMounted = false;
      socket.off('signal', handleSignal);
      socket.off('iceCandidate', handleIceCandidate);
      cleanupConnection();
    };
  }, [
    status,
    socket,
    roomId,
    mode,
    partnerSocketId,
    peerInitiator,
    createPeerConnection,
    cleanupConnection,
  ]);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      stopLocalMedia();
      cleanupConnection();
    };
  }, [stopLocalMedia, cleanupConnection]);

  return {
    localStream,
    remoteStream,
    connectionState,
    permissionError,
    requestMediaPermissions,
    stopLocalMedia,
  };
}
