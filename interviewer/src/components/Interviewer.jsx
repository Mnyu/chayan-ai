import { BarVisualizer, useConnectionState, useTracks, VideoTrack } from '@livekit/components-react';
import { ConnectionState, Track } from 'livekit-client';
import { useMemo } from 'react';
import { Card, Flex, Spin } from 'antd';

const Interviewer = ({ voiceAssistant }) => {
  const roomState = useConnectionState();
  const tracks = useTracks();
  const agentVideoTrack = tracks.find(
    (trackRef) => trackRef.publication.kind === Track.Kind.Video && trackRef.participant.isAgent,
  );

  const video = useMemo(() => {
    const videoContent = <VideoTrack trackRef={agentVideoTrack} className='' />;
    const loadingContent = <Spin tip='Loading' size='large'></Spin>;
    const disconnectedContent = <Flex>No video track. Connect to get started.</Flex>;

    let content = null;
    if (roomState === ConnectionState.Disconnected) {
      content = disconnectedContent;
    } else if (agentVideoTrack) {
      content = videoContent;
    } else {
      content = loadingContent;
    }
    return <div>{content}</div>;
  }, [agentVideoTrack, roomState]);

  const audio = useMemo(() => {
    const disconnectedContent = <Flex>No audio track. Connect to get started.</Flex>;

    const waitingContent = <Spin tip='Loading' size='large'></Spin>;

    const visualizerContent = (
      <div
        className={`flex items-center justify-center w-full h-48 [--lk-va-bar-width:30px] [--lk-va-bar-gap:20px] [--lk-fg:var(--lk-theme-color)]`}
      >
        <BarVisualizer
          state={voiceAssistant.state}
          trackRef={voiceAssistant.audioTrack}
          barCount={5}
          options={{ minHeight: 20 }}
        />
      </div>
    );

    if (roomState === ConnectionState.Disconnected) {
      return disconnectedContent;
    }
    if (!voiceAssistant.audioTrack) {
      return waitingContent;
    }
    return visualizerContent;
  }, [voiceAssistant.audioTrack, roomState, voiceAssistant.state]);

  return (
    <Card title='Interviewer' className='h-1/2 w-full'>
      <Flex vertical justify='flex-start' align='center'>
        {/* {video} */}
        {audio}
      </Flex>
    </Card>
  );
};

export default Interviewer;
