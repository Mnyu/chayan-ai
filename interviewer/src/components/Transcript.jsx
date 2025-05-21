import { useChat, useLocalParticipant, useTracks, useTrackTranscription } from '@livekit/components-react';
import { LocalParticipant, Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import Chat from './Chat';

const Transcript = ({ agentAudioTrack }) => {
  const agentMessages = useTrackTranscription(agentAudioTrack || undefined);
  const localParticipant = useLocalParticipant();

  const tracks = useTracks();

  const localTracks = tracks.filter(({ participant }) => participant instanceof LocalParticipant);
  const localMicTrack = localTracks.find(({ source }) => source === Track.Source.Microphone);

  // const localMessages = useTrackTranscription({
  //   publication: localParticipant.microphoneTrack,
  //   source: Track.Source.Microphone,
  //   participant: localParticipant.localParticipant,
  // });

  const localMessages = useTrackTranscription(localMicTrack);

  const [transcripts, setTranscripts] = useState(new Map());
  const [messages, setMessages] = useState([]);
  const { chatMessages, send: sendChat } = useChat();

  useEffect(() => {
    if (agentAudioTrack) {
      agentMessages.segments.forEach((segment) =>
        transcripts.set(
          segment.id,
          segmentToChatMessage(segment, transcripts.get(segment.id), agentAudioTrack.participant),
        ),
      );
    }
    localMessages.segments.forEach((segment) =>
      transcripts.set(
        segment.id,
        segmentToChatMessage(segment, transcripts.get(segment.id), localParticipant.localParticipant),
      ),
    );
    const allMessages = Array.from(transcripts.values());
    for (const msg of chatMessages) {
      const isAgent = agentAudioTrack
        ? msg.from?.identity === agentAudioTrack.participant?.identity
        : msg.from?.identity !== localParticipant.localParticipant.identity;
      const isSelf = msg.from?.identity === localParticipant.localParticipant.identity;
      let name = msg.from?.name;
      if (!name) {
        if (isAgent) {
          name = 'Agent';
        } else if (isSelf) {
          name = 'You';
        } else {
          name = 'Unknown';
        }
      }
      allMessages.push({
        name,
        message: msg.message,
        timestamp: msg.timestamp,
        isSelf: isSelf,
      });
    }
    allMessages.sort((a, b) => a.timestamp - b.timestamp);
    setMessages(allMessages);
  }, [
    transcripts,
    chatMessages,
    agentAudioTrack,
    agentAudioTrack?.participant,
    agentMessages.segments,
    localParticipant.localParticipant,
    localMessages.segments,
  ]);

  return <Chat messages={messages} onSend={sendChat} />;
};
export default Transcript;

function segmentToChatMessage(segment, existingMessage, participant) {
  const msg = {
    message: segment.final ? segment.text : `${segment.text} ...`,
    name: participant instanceof LocalParticipant ? 'You' : 'Interviewer',
    isSelf: participant instanceof LocalParticipant,
    timestamp: existingMessage?.timestamp ?? Date.now(),
  };
  return msg;
}
