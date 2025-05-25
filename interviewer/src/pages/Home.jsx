import { AudioFilled, BookFilled, CopyFilled } from '@ant-design/icons';
import { Image, Flex, Typography, Button, Row, Col, Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { useTypewriter, Cursor, Typewriter } from 'react-simple-typewriter';

const Home = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const getStarted = () => {
    isLoggedIn ? navigate('/interviews') : navigate('/login');
  };

  const openDemo = () => {
    window.open('https://www.youtube.com/watch?v=2Jxk8iZWjJM');
  };

  return (
    <Content style={{ overflowY: 'auto' }} className='h-full'>
      <Flex justify='space-around' className='' style={{ padding: 20, marginTop: 30 }}>
        <Flex vertical className='h-1/2' style={{ paddingTop: 30 }}>
          <Typography.Title>
            Ace your{' '}
            <span style={{ color: '#ff9c6e', fontWeight: 'bold' }}>
              <Typewriter words={['Technical']} loop={true} cursor delaySpeed={1000} />
            </span>
          </Typography.Title>
          <Typography.Title style={{ marginTop: 0 }}>Interviews</Typography.Title>
          <Typography.Paragraph style={{ fontSize: 18, marginTop: 5, marginBottom: 5 }}>
            Master your interviews with real-time mock interviews powered by cutting-edge AI.
          </Typography.Paragraph>
          <Typography.Paragraph style={{ fontSize: 18, marginTop: 0, marginBottom: 5 }}>
            Crush nervous energy, boost confidence, and walk in ready to win.
          </Typography.Paragraph>
          {/* <Typography.Paragraph style={{ fontSize: 18, marginTop: 5, marginBottom: 5 }}>
            Prepare for your interviews with real-time virtual audio mock interviews
          </Typography.Paragraph>
          <Typography.Paragraph style={{ fontSize: 18, marginTop: 0, marginBottom: 5 }}>
            with the world's most advanced AI. Say goodbye to interview performance anxiety.
          </Typography.Paragraph> */}
          <Typography.Paragraph style={{ fontSize: 18, marginTop: 0, marginBottom: 5 }}>
            Get detailed feedback on your interview answers with powerful suggestions to improve them.
          </Typography.Paragraph>
          <Typography.Paragraph style={{ fontSize: 18, marginTop: 0 }}>
            Simply mention the role, upload your resume and voila.
          </Typography.Paragraph>
          <Flex gap={10}>
            <Button
              type='primary'
              onClick={getStarted}
              style={{ width: '40%', marginTop: 10, padding: 20, fontSize: 18 }}
            >
              Get Started
            </Button>
            <Button onClick={openDemo} style={{ width: '40%', marginTop: 10, padding: 20, fontSize: 18 }}>
              Demo
            </Button>
          </Flex>
        </Flex>
        <Flex className='h-1/2'>
          <Image height={400} src='./background.jpg' className='rounded-4xl' preview={false} />
        </Flex>
      </Flex>
      <Row gutter={[16, 16]} style={{ padding: 20, marginTop: 5 }}>
        <Col span={8}>
          <Card
            variant='borderless'
            style={{ paddingTop: 30, boxShadow: '1px 1px 5px 1px #ff7a45' }}
            cover={<AudioFilled style={{ fontSize: 50 }} />}
          >
            <Meta
              title={
                <Flex justify='center'>
                  <Typography.Title level={4}>Interactive Interviews</Typography.Title>
                </Flex>
              }
              description={
                <Flex justify='center'>
                  {/* <Typography.Text type='secondary' style={{ fontSize: 15 }}>
                    Speak directly with our AI bot for a near realtime interview experience. Immerse yourself in a truly
                    realistic interview environment that mirrors the challenges and nuances of face-to-face
                    interactions.
                  </Typography.Text> */}
                  <Typography.Text type='secondary' style={{ fontSize: 15 }}>
                    Talk directly with our AI bot for a near real-time interview experience. Step into a lifelike
                    interview setting that captures the feel and complexity of an in-person interview.
                  </Typography.Text>
                </Flex>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            variant='borderless'
            style={{ paddingTop: 30, boxShadow: '1px 1px 5px 1px #ff7a45' }}
            cover={<CopyFilled style={{ fontSize: 50 }} />}
          >
            <Meta
              title={
                <Flex justify='center'>
                  <Typography.Title level={4}>Personalized Feedback</Typography.Title>
                </Flex>
              }
              description={
                <Flex justify='center'>
                  <Typography.Text type='secondary' style={{ fontSize: 15 }}>
                    Receive detailed rated feedback on your projects, technical skills and communication skills. Our AI
                    will analyze every response and provide valuable guidelines to sharpen your interview skills.
                  </Typography.Text>
                </Flex>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{ paddingTop: 30, boxShadow: '1px 1px 5px 1px #ff7a45' }}
            variant='borderless'
            hoverable
            cover={<BookFilled style={{ fontSize: 50 }} />}
          >
            <Meta
              title={
                <Flex justify='center'>
                  <Typography.Title level={4}>Review Your Responses</Typography.Title>
                </Flex>
              }
              description={
                <Flex justify='center'>
                  {/* <Typography.Text type='secondary' style={{ fontSize: 15 }}>
                    Review the complete transcript of your interview and identify key areas of improvement.
                    Significantly improve your communication skills. Bring more structure, fluency, and clarity to your
                    answers.
                  </Typography.Text> */}
                  <Typography.Text type='secondary' style={{ fontSize: 15 }}>
                    Go through the full transcript of your interview to spot key areas for improvement. Enhance your
                    communication skills by adding structure, fluency, and clarity to your responses.
                  </Typography.Text>
                </Flex>
              }
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};
export default Home;
