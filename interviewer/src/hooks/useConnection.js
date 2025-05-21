import { useState } from 'react';

const useConnection = () => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = async (room, username, interviewId) => {
    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          interviewId: interviewId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to connect');
      }
      const data = await response.json();
      await room.connect('wss://myproject-ar2vjs8f.livekit.cloud', data.token);
      await room.localParticipant.setCameraEnabled(true);
      await room.localParticipant.setMicrophoneEnabled(true);
      setIsConnected(true);
    } catch (err) {
      console.error('Connect error:', err);
    }
  };

  const disconnect = async (room, userId) => {
    try {
      room.disconnect();
      const response = await fetch('/api/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: room.roomInfo.name, userId }),
      });
      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }
      setIsConnected(false);
    } catch (err) {
      console.error('Connect error:', err);
    }
  };

  return { isConnected, connect, disconnect };
};

export default useConnection;
