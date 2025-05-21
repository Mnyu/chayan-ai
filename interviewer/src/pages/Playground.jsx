import { useEffect, useState } from 'react';
import { useConnectionState, useLocalParticipant, useVoiceAssistant } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { Card, Flex } from 'antd';
import Info from '../components/Info';
import Candidate from '../components/Candidate';
import Interviewer from '../components/Interviewer';
import Transcript from '../components/Transcript';
import useConnection from '../hooks/useConnection';
import { useLocation } from 'react-router-dom';

const Playground = () => {
  const location = useLocation();
  const username = location.state?.username;
  const { localParticipant } = useLocalParticipant();
  const voiceAssistant = useVoiceAssistant();
  const roomState = useConnectionState();
  const [transcripts, setTranscripts] = useState([]);

  const { disconnect } = useConnection();

  useEffect(() => {
    const onLoad = async () => {
      if (roomState === ConnectionState.Connected) {
        await localParticipant.setCameraEnabled(true);
        await localParticipant.setMicrophoneEnabled(true);
      }
    };
    onLoad();
  }, [localParticipant, roomState]);

  return (
    <Flex justify='center' align='flex-start' className='h-full'>
      <Flex className='h-full w-1/5'>
        <Card title='Details' className='w-full'>
          <Info voiceAssistant={voiceAssistant} participantName={username} disconnect={disconnect} />
        </Card>
      </Flex>
      <Flex vertical className='h-full w-1/3'>
        <Candidate />
        <Interviewer voiceAssistant={voiceAssistant} />
      </Flex>
      <Flex className='h-full w-1/5'>
        <Transcript agentAudioTrack={voiceAssistant.audioTrack} />
      </Flex>
    </Flex>
  );
};
export default Playground;
