import { CheckCircleFilled, MinusCircleFilled, SyncOutlined } from '@ant-design/icons';
import { useConnectionState, useLocalParticipant, useRoomContext, useRoomInfo } from '@livekit/components-react';
import { Button, Flex, Typography } from 'antd';
import StatisticTimer from 'antd/es/statistic/Timer';
import { ConnectionState } from 'livekit-client';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const Info = ({ voiceAssistant, participantName, disconnect }) => {
  const navigate = useNavigate();
  const room = useRoomContext();
  const { name } = useRoomInfo();
  const roomState = useConnectionState();
  const { localParticipant } = useLocalParticipant();

  const roomConnectionIcon = useMemo(() => {
    if (roomState === ConnectionState.Connected) {
      return <CheckCircleFilled style={{ color: '#52c41a' }} />;
    } else if (roomState === ConnectionState.Connecting) {
      return <SyncOutlined spin style={{ color: '#ff7a45' }} />;
    } else {
      return <MinusCircleFilled style={{ color: '#dc4446' }} />;
    }
  }, [roomState]);

  const interviewerConnectionIcon = useMemo(() => {
    if (voiceAssistant && voiceAssistant.agent) {
      return <CheckCircleFilled style={{ color: '#52c41a' }} />;
    } else if (roomState === ConnectionState.Connecting) {
      return <SyncOutlined spin style={{ color: '#ff7a45' }} />;
    } else {
      return <MinusCircleFilled style={{ color: '#dc4446' }} />;
    }
  }, [roomState, voiceAssistant.agent]);

  const disconnectFromRoom = () => {
    const userId = localParticipant ? localParticipant.identity : '';
    disconnect(room, userId);
    navigate('/done');
  };

  return (
    <Flex vertical gap={20}>
      <Flex justify='space-between' gap={15}>
        <Text type='secondary'>Description</Text>
        <Text>Mock Interview</Text>
      </Flex>
      <Flex justify='space-between' gap={15}>
        <Text type='secondary'>Room</Text>
        <Text>{roomState === ConnectionState.Connected ? name : ''}</Text>
      </Flex>
      <Flex justify='space-between' gap={15}>
        <Text type='secondary'>Candidate</Text>
        <Text>{participantName}</Text>
      </Flex>
      <Flex justify='space-between' gap={15}>
        <Text type='secondary'>Candidate Connected</Text>
        {roomConnectionIcon}
      </Flex>
      <Flex justify='space-between' gap={15}>
        <Text type='secondary'>Interviewer Connected</Text>
        {interviewerConnectionIcon}
      </Flex>
      <Flex justify='flex-end'>
        <Button type='primary' danger onClick={disconnectFromRoom}>
          Disconnect
        </Button>
      </Flex>
    </Flex>
  );
};
export default Info;
