import {
  BarVisualizer,
  ConnectionState,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useRoomContext,
  useTracks,
  useVoiceAssistant,
  VideoTrack,
} from '@livekit/components-react';
import { Card, Flex } from 'antd';
import { LocalParticipant, Track } from 'livekit-client';
import { useCallback, useEffect, useState } from 'react';
import Interviewer from './Interviewer';
import Candidate from './Candidate';
import Transcript from './Transcript';
import Info from './Info';

const Playground = ({ participantName, disconnect }) => {
  const { localParticipant } = useLocalParticipant();
  const voiceAssistant = useVoiceAssistant();
  const roomState = useConnectionState();
  const [transcripts, setTranscripts] = useState([]);
  // const tracks = useTracks();

  // const localTracks = tracks.filter(({ participant }) => participant instanceof LocalParticipant);
  // const localCameraTrack = localTracks.find(({ source }) => source === Track.Source.Camera);
  // const localMicTrack = localTracks.find(({ source }) => source === Track.Source.Microphone);

  useEffect(() => {
    const onLoad = async () => {
      if (roomState === ConnectionState.Connected) {
        await localParticipant.setCameraEnabled(true);
        await localParticipant.setMicrophoneEnabled(true);
      }
    };
    onLoad();
  }, [localParticipant, roomState]);

  const onDataReceived = useCallback(
    (msg) => {
      console.log(msg);
      if (msg.topic === 'transcription') {
        const decoded = JSON.parse(new TextDecoder('utf-8').decode(msg.payload));
        let timestamp = new Date().getTime();
        if ('timestamp' in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp;
        }
        setTranscripts([
          ...transcripts,
          {
            name: 'You',
            message: decoded.text,
            timestamp: timestamp,
            isSelf: true,
          },
        ]);
      }
    },
    [transcripts],
  );

  useDataChannel(onDataReceived);

  return (
    <Flex justify='center' align='flex-start' className='h-full'>
      <Flex className='h-full w-1/5'>
        <Card title='Details' className='w-full'>
          <Info voiceAssistant={voiceAssistant} participantName={participantName} disconnect={disconnect} />
        </Card>
      </Flex>
      <Flex vertical className='h-full w-1/3'>
        <Candidate />
        <Interviewer voiceAssistant={voiceAssistant} />
      </Flex>
      <Flex className='h-full w-1/5'>
        <Transcript agentAudioTrack={voiceAssistant.audioTrack} />
        {/* <Card title='Chat' className='w-full h-full overflow-auto'>
          <Transcript agentAudioTrack={voiceAssistant.audioTrack} />
        </Card> */}
      </Flex>
    </Flex>
    // <>
    //   <div>Playground</div>;
    //   {localCameraTrack ? (
    //     <div>
    //       <VideoTrack className='' trackRef={localCameraTrack} />
    //     </div>
    //   ) : (
    //     <div>localCameraTrack not present. Please connect first</div>
    //   )}
    //   {localMicTrack ? (
    //     <div>
    //       <BarVisualizer
    //         trackRef={localMicTrack}
    //         className='blue-border video'
    //         barCount={20}
    //         options={{ minHeight: 0 }}
    //       />
    //     </div>
    //   ) : (
    //     <div>localMicTrack not present. Please connect first</div>
    //   )}
    //   <BarVisualizer
    //     state={voiceAssistant.state}
    //     trackRef={voiceAssistant.audioTrack}
    //     barCount={5}
    //     options={{ minHeight: 20 }}
    //   />
    // </>
  );
};
export default Playground;
