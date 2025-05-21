import { CarryOutOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Flex, List, Modal, Result, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import useConnection from '../hooks/useConnection';
import { useRoomContext } from '@livekit/components-react';
import { useState } from 'react';

const instructions = [
  {
    id: 'speak-slow',
    heading: 'Speak Slowly and Clearly',
    content: 'Articulate your words carefully to help the system capture your answers correctly.',
  },
  {
    id: 'bg-noise',
    heading: 'Avoid Background Noise',
    content: 'Choose a well-lit and quiet location to minimize errors in speech recognition.',
  },
  {
    id: 'interrupt',
    heading: 'Do Not Interrupt the Prompts',
    content: 'Wait until the AI has finished speaking before responding.',
  },
  {
    id: 'net',
    heading: 'Internet',
    content: 'Make sure you are using a stable internet connection to avoid disruptions.',
  },
  {
    id: 'cam-mic',
    heading: 'Camera and Microphone',
    content: 'Grant camera and microphone permissions in your browser.',
  },
];

const StartInterviewPopup = ({
  isModalOpen,
  setIsModalOpen,
  selectedInterviewId,
  selectedUserName,
  setSelectedInterviewId,
  setSelectedUserName,
}) => {
  const navigate = useNavigate();
  const { connect } = useConnection();
  const room = useRoomContext();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const cleanup = () => {
    setSelectedInterviewId(null);
    setSelectedUserName(null);
    setLoading(false);
  };

  const startInterview = async () => {
    setLoading(true);
    if (selectedInterviewId) {
      await connect(room, selectedUserName, selectedInterviewId);
      cleanup();
      setIsModalOpen(false);
      navigate('/playground', { state: { username: selectedUserName } });
    }
    setLoading(false);
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      className='min-w-3xl'
      afterClose={cleanup}
      footer={[
        <Flex key='reg-footer' justify='center'>
          <Button type='primary' onClick={startInterview}>
            Start Interview
          </Button>
        </Flex>,
      ]}
    >
      <Spin size='large' spinning={loading}>
        <Flex vertical gap={0}>
          <Flex justify='center'>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Your Interview is Ready!
            </Typography.Title>
          </Flex>
          <Result
            icon={<CheckCircleOutlined style={{ color: 'green' }} />}
            title='Important Instructions Before You Begin:'
            // subTitle='and then click on Start Interview'
            style={{ paddingTop: 15 }}
            extra={
              <>
                <Typography.Paragraph style={{ fontSize: 16 }}>
                  This is an AI-powered interview. <br />
                  Your responses will be transcribed automatically and evaluated based on the transcript. <br />
                  To ensure accuracy and fairness :
                </Typography.Paragraph>
                <List
                  bordered
                  dataSource={instructions}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
                      <Flex vertical>
                        <Flex>
                          <Typography.Text style={{ fontSize: 14 }}>
                            <CarryOutOutlined style={{ marginRight: 10 }} />
                            <i>
                              <b>{item.heading} : </b>
                            </i>
                          </Typography.Text>
                        </Flex>
                        <Typography.Text style={{ fontSize: 14 }}>
                          <i>{item.content}</i>
                        </Typography.Text>
                      </Flex>
                    </List.Item>
                  )}
                />
              </>
            }
          />
        </Flex>
      </Spin>
    </Modal>
  );
};
export default StartInterviewPopup;
