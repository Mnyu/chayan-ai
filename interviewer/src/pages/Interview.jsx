import { useEffect, useState } from 'react';
import useInterviews from '../hooks/useInterviews';
import { useParams } from 'react-router-dom';
import { Button, Card, Collapse, DatePicker, Descriptions, Flex, Spin, Typography } from 'antd';
import Chat from '../components/Chat';
import Evaluation from '../components/Evaluation';
import dayjs from 'dayjs';
import InterviewStatus from '../components/InterviewStatus';

const Interview = () => {
  const { id } = useParams();
  const { getInterview, evaluateInterview } = useInterviews();

  const [loading, setLoading] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [resumeSummaryDetails, setResumeSummaryDetails] = useState([]);
  const [transcriptMessages, setTranscriptMessages] = useState([]);
  const [evaluation, setEvaluation] = useState([]);

  const transcriptItems = [
    {
      key: 'transcript',
      label: <Typography.Title level={5}>Transcript</Typography.Title>,
      children: <Chat messages={transcriptMessages}></Chat>,
    },
  ];
  const evaluationItems = [{ key: 'evaluation', label: '', children: <Evaluation evaluation={evaluation} /> }];

  const updateInterviewDetails = (interview) => {
    const newInterviewDetails = [];
    if (interview.userName) {
      newInterviewDetails.push({ key: 'userName', label: 'Name', children: interview.userName });
    }
    if (interview.resumePath) {
      newInterviewDetails.push({
        key: 'resumePath',
        label: 'Resume',
        children: <Typography.Link href='javascript:void(0)'>{interview.resumePath.split('/')[1]}</Typography.Link>,
      });
    }
    if (interview.createdAt) {
      newInterviewDetails.push({
        key: 'createdAt',
        label: 'Creation Date',
        children: (
          <DatePicker
            defaultValue={dayjs(interview.createdAt, 'YYYY-MM-DDTHH:mm:ssZ')}
            format='YYYY-MM-DD'
            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
            disabled
          />
        ),
      });
      if (interview.status) {
        newInterviewDetails.push({
          key: 'status',
          label: 'Status',
          children: <InterviewStatus status={interview.status} />,
        });
      }
    }
    setInterviewDetails(newInterviewDetails);
  };

  const updateResumeSummaryDetails = (resumeSummary) => {
    const newResumeSummaryDetails = [];
    if (resumeSummary?.experience) {
      newResumeSummaryDetails.push({
        key: 'experience',
        label: 'Experience',
        span: 3,
        children: resumeSummary.experience,
      });
    }
    if (resumeSummary?.technologies) {
      newResumeSummaryDetails.push({
        key: 'technologies',
        label: 'Technologies',
        span: 3,
        children: (
          <>
            {resumeSummary.technologies.map((tech) => (
              <Typography.Text key={tech} keyboard>
                {tech}
              </Typography.Text>
            ))}
          </>
        ),
      });
    }
    if (resumeSummary?.achievements) {
      newResumeSummaryDetails.push({
        key: 'achievements',
        label: 'Achievements',
        span: 3,
        children: (
          <>
            <Flex vertical gap={10}>
              {resumeSummary.achievements.map((achiv) => (
                <Typography.Text key={achiv} keyboard>
                  {achiv}
                </Typography.Text>
              ))}
            </Flex>
          </>
        ),
      });
    }
    setResumeSummaryDetails(newResumeSummaryDetails);
  };

  const updateTranscript = (name, transcript) => {
    const newTranscript = [];
    transcript &&
      transcript.map((message) => {
        newTranscript.push({
          name: message.role === 'user' ? name : 'Interviewer',
          message: message.content,
          timestamp: message.created_at,
          isSelf: message.role === 'user',
        });
      });
    setTranscriptMessages(newTranscript);
  };

  const evalInterview = async (interviewId) => {
    if (interviewId) {
      setLoading(true);
      const interview = await evaluateInterview(interviewId);
      setEvaluation(interview.evaluation);
      setLoading(false);
      console.log('EVALUATION DONE');
    }
  };

  useEffect(() => {
    const onLoad = async (interviewId) => {
      const interview = await getInterview(interviewId);
      updateInterviewDetails(interview);
      updateResumeSummaryDetails(interview.resumeSummary);
      updateTranscript(interview.userName, interview.transcript);
      setEvaluation(interview.evaluation);
    };
    if (id) {
      onLoad(id);
    }
  }, []);

  // const onChange = (val) => {
  //   console.log(val);
  //   if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
  //     console.log('changed!');
  //   }
  // };

  return (
    <Flex vertical gap={0} style={{ overflowY: 'auto' }} className='h-full'>
      <Spin size='large' spinning={loading}>
        <Card className='' style={{ background: 'none', margin: 24 }}>
          <Descriptions
            title={<Typography.Title level={3}>Interview Details</Typography.Title>}
            items={interviewDetails}
            // extra={<Button onClick={() => evalInterview(id)}>Evaluate</Button>}
          />
        </Card>
        <Card className='' style={{ background: 'none', margin: 24 }}>
          <Descriptions
            title={
              evaluation ? (
                <Typography.Title level={3}>
                  Evaluation : &nbsp;
                  {evaluation.recommendation === 'HIRE' ? (
                    <Typography.Text type='success' style={{ fontSize: '24px' }}>
                      {evaluation.recommendation}
                    </Typography.Text>
                  ) : (
                    <Typography.Text type='danger' style={{ fontSize: '24px' }}>
                      {evaluation.recommendation}
                    </Typography.Text>
                  )}
                </Typography.Title>
              ) : (
                <Typography.Title level={3}>Evaluation</Typography.Title>
              )
            }
            items={evaluationItems}
          />
        </Card>
        <Card className='' style={{ background: 'none', margin: 24 }}>
          <Descriptions
            title={<Typography.Title level={3}>Resume Summary</Typography.Title>}
            items={resumeSummaryDetails}
          />
        </Card>
        <Collapse
          // title={<Typography.Title level={3}>Transcript</Typography.Title>}
          items={transcriptItems}
          style={{ background: 'none', margin: 24 }}
        />
        {/* <Card className='' style={{ background: 'none', margin: 24 }}>
        <Descriptions title={<Typography.Title level={3}>Transcript</Typography.Title>} items={transcriptItems} />
      </Card> */}
      </Spin>
    </Flex>
  );
};
export default Interview;
