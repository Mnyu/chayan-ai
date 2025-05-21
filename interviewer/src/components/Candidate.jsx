import { useConnectionState, useTracks, VideoTrack } from '@livekit/components-react';
import { ConnectionState, LocalParticipant, Track } from 'livekit-client';
import { useMemo } from 'react';
import { Card, Flex, Spin } from 'antd';
import StatisticTimer from 'antd/es/statistic/Timer';

const Candidate = () => {
  const roomState = useConnectionState();
  const tracks = useTracks();
  const localTracks = tracks.filter(({ participant }) => participant instanceof LocalParticipant);
  const localCameraTrack = localTracks.find(({ source }) => source === Track.Source.Camera);
  // const localMicTrack = localTracks.find(({ source }) => source === Track.Source.Microphone);

  const content = useMemo(() => {
    const videoContent = <VideoTrack trackRef={localCameraTrack} className='' />;
    const loadingContent = <Spin tip='Loading' size='large'></Spin>;
    const disconnectedContent = <Flex>No video track. Connect to get started.</Flex>;

    let content = null;
    if (roomState === ConnectionState.Disconnected) {
      content = disconnectedContent;
    } else if (localCameraTrack) {
      content = videoContent;
    } else {
      content = loadingContent;
    }
    return <div className=''>{content}</div>;
  }, [localCameraTrack, roomState]);

  return (
    <Card
      title='Candidate'
      className='h-1/2 w-full'
      // extra={<StatisticTimer value={Date.now()} type='countup' title='' />}
    >
      <Flex vertical justify='flex-start' align='center'>
        {content}
      </Flex>
    </Card>
  );
};

export default Candidate;
