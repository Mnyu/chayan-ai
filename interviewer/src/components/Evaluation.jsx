import { Card, Collapse, Empty, Flex, Progress, Rate, Typography } from 'antd';
import DetailedFeedback from './DetailedFeedback';

const twoColors = {
  '0%': '#ff7a45',
  '100%': '#87d068',
};

const format = (percent, successPercent) => {
  if (percent === 0) return 0;
  return (percent / 20).toFixed(1);
};

const Evaluation = ({ evaluation }) => {
  const detailedFeedbackItems = [
    {
      key: 'detailedFeedback',
      label: <Typography.Title level={5}>Detailed Feedback</Typography.Title>,
      children: <DetailedFeedback evaluationItems={evaluation ? evaluation.evaluationItems : []} />,
    },
  ];

  return (
    <>
      {evaluation ? (
        <Flex vertical gap={20}>
          <Flex justify='space-between' className='w-full min-h-max' gap={24}>
            <Card className='w-1/2'>
              <Flex vertical gap={10} className=''>
                <Flex align='center' justify='center' className=''>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    Overall Feedback
                  </Typography.Title>
                </Flex>
                <Flex>
                  <Typography.Paragraph>{evaluation.overallFeedback}</Typography.Paragraph>
                </Flex>
              </Flex>
            </Card>
            <Card className='w-1/2 h-1/2'>
              <Flex vertical gap={20}>
                <Flex align='center' gap='middle' justify='center'>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    Ratings
                  </Typography.Title>
                </Flex>
                <Flex align='center' gap='middle' justify='center'>
                  <Flex vertical align='center' gap={5}>
                    <Rate allowHalf value={evaluation.overallRating} disabled />
                    <Typography.Title type='secondary' level={4} style={{ margin: 0 }}>
                      {evaluation.overallRating}/5
                    </Typography.Title>
                  </Flex>
                </Flex>
                <Flex justify='space-between'>
                  <Flex vertical align='center' gap={5}>
                    <Progress
                      type='dashboard'
                      size='small'
                      percent={evaluation.overallRating * 20}
                      format={format}
                      strokeColor={twoColors}
                    />
                    <Typography.Title level={5}>Technologies</Typography.Title>
                  </Flex>
                  <Flex vertical align='center' gap={5}>
                    <Progress
                      type='dashboard'
                      size='small'
                      percent={evaluation.technologiesRating * 20}
                      format={format}
                      strokeColor={twoColors}
                    />
                    <Typography.Title level={5}>Projects</Typography.Title>
                  </Flex>
                  <Flex vertical align='center' gap={5}>
                    <Progress
                      type='dashboard'
                      size='small'
                      percent={evaluation.communicationRating * 20}
                      format={format}
                      strokeColor={twoColors}
                    />
                    <Typography.Title level={5}>Communication</Typography.Title>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          </Flex>
          <Collapse
            items={detailedFeedbackItems}
            defaultActiveKey={['detailedFeedback']}
            style={{ background: 'none' }}
          />
        </Flex>
      ) : (
        <Flex justify='center' className='w-full'>
          <Empty description={<Typography.Text>Evaluation not available</Typography.Text>}></Empty>
        </Flex>
      )}
    </>
  );
};
export default Evaluation;
