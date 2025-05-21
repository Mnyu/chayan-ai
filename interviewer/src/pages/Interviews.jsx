import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Button, Card, DatePicker, Empty, Flex, Space, Spin, Table, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import useInterviews from '../hooks/useInterviews';
import { useEffect, useState } from 'react';
import RegisterPopup from '../components/RegisterPopup';
import dayjs from 'dayjs';
import InterviewStatus from '../components/InterviewStatus';
import StartInterviewPopup from '../components/StartInterviewPopup';

const Interviews = () => {
  const navigate = useNavigate();
  const { getAllInterviews, evaluateInterview } = useInterviews();
  const [interviews, setInterviews] = useState([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isStartInterviewModalOpen, setIsStartInterviewModalOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerForInterview = () => {
    // navigate('/register');
    setIsRegisterModalOpen(true);
  };

  const getRowKey = (row) => {
    return row.id;
  };

  const evalInterview = async (interviewId) => {
    if (interviewId) {
      await evaluateInterview(interviewId);
    }
    console.log('EVALUATION DONE');
  };

  const startInterview = (row) => {
    setSelectedInterviewId(row.id);
    setSelectedUserName(row.userName);
    setIsStartInterviewModalOpen(true);
  };

  const viewInterview = (interviewId) => {
    if (interviewId) {
      navigate('/interviews/' + interviewId);
      return;
    }
    console.error('cannot navigate to interview');
  };

  const refreshInterviewsData = async () => {
    setLoading(true);
    const allInterviews = await getAllInterviews();
    setInterviews(allInterviews);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const onLoad = async () => {
      const allInterviews = await getAllInterviews();
      setInterviews(allInterviews);
    };
    onLoad();
    setLoading(false);
  }, []);

  const columns = [
    { key: 'userName', title: 'Name', dataIndex: 'userName' },
    {
      key: 'time',
      title: 'Creation Date',
      render: (_, row) => (
        <DatePicker
          defaultValue={dayjs(row.createdAt, 'YYYY-MM-DDTHH:mm:ssZ')}
          format='YYYY-MM-DD'
          showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
          disabled
        />
      ),
    },
    {
      key: 'resumePath',
      title: 'Resume',
      dataIndex: 'resumePath',
      render: (text) => <Typography.Link href='javascript:void(0)'>{text.split('/')[1]}</Typography.Link>,
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (text) => <InterviewStatus status={text} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, row) => (
        <Space size='middle'>
          {row.status === 'SCHEDULED' && <Button onClick={() => startInterview(row)}>Start Interview</Button>}
          <Button onClick={() => viewInterview(row.id)}>View</Button>
          {/* <Button onClick={() => evalInterview(row.id)}>Evaluate</Button> */}
        </Space>
      ),
    },
  ];
  return (
    <Flex justify='center' style={{ overflowY: 'auto' }} className='h-full'>
      <Spin size='large' spinning={loading}>
        <Card
          // variant='borderless'
          title={
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              Interviews
            </Typography.Title>
          }
          extra={
            <Space>
              <Button icon={<RedoOutlined />} onClick={refreshInterviewsData}>
                Refresh
              </Button>
              <Button icon={<PlusOutlined />} onClick={registerForInterview}>
                New Interview
              </Button>
            </Space>
          }
          className='min-w-5xl'
          style={{ background: 'none', marginTop: 24 }}
        >
          <Table
            rowKey={getRowKey}
            columns={columns}
            dataSource={interviews}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            // pagination={false}
            locale={{ emptyText: <Empty description='No Interviews'></Empty> }}
            style={{ background: 'none' }}
          />
        </Card>
      </Spin>
      <RegisterPopup
        isModalOpen={isRegisterModalOpen}
        setIsModalOpen={setIsRegisterModalOpen}
        interviews={interviews}
        setInterviews={setInterviews}
      />
      <StartInterviewPopup
        isModalOpen={isStartInterviewModalOpen}
        setIsModalOpen={setIsStartInterviewModalOpen}
        selectedInterviewId={selectedInterviewId}
        selectedUserName={selectedUserName}
        setSelectedInterviewId={setSelectedInterviewId}
        setSelectedUserName={setSelectedUserName}
      />
    </Flex>
  );
};
export default Interviews;
