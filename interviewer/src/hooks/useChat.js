import { setupChat } from '@livekit/components-core';
import { useConnectionState, useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { useObservableState } from './internal/useObservableState';
import { useMemo } from 'react';

const useChat = (options) => {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);
  const isDisconnected = useMemo(() => connectionState === ConnectionState.Disconnected, [connectionState]);
  const setup = useMemo(() => setupChat(room, options), [room, options, isDisconnected]);

  const isSending = useObservableState(setup.isSendingObservable, false);
  const chatMessages = useObservableState(setup.messageObservable, []);

  return { send: setup.send, chatMessages, isSending };
};

export default useChat;
