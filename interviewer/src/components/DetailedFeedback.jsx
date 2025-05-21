import { CaretRightFilled } from '@ant-design/icons';
import { Empty, Flex, Table, Typography } from 'antd';

const DetailedFeedback = ({ evaluationItems }) => {
  const feddbackItems =
    evaluationItems && evaluationItems.length > 0
      ? evaluationItems.map((item) => ({
          question: item.question,
          answer: item.answer,
          rating: item.rating,
          guidelines: item.guidelines,
        }))
      : [];
  const columns = [
    {
      key: 'question',
      title: 'Question',
      dataIndex: 'question',
      width: '31%',
      render: (text) => <Typography.Text type='secondary'>{text}</Typography.Text>,
    },
    {
      key: 'answer',
      title: 'Answer',
      width: '31%',
      dataIndex: 'answer',
      render: (text) => <Typography.Text type='secondary'>{text}</Typography.Text>,
    },
    {
      key: 'rating',
      title: 'Rating',
      dataIndex: 'rating',
      align: 'center',
      width: '7%',
      render: (text, row) => {
        if (row.rating === 3) {
          return <Typography.Text type='warning'> {row.rating}</Typography.Text>;
        } else if (row.rating > 3) {
          return <Typography.Text type='success'> {row.rating}</Typography.Text>;
        } else {
          return <Typography.Text type='danger'> {row.rating}</Typography.Text>;
        }
      },
    },
    {
      key: 'guidelines',
      title: 'Guidelines',
      dataIndex: 'guidelines',
      width: '31%',
      render: (text, row) => (
        <Flex vertical gap={5}>
          {row.guidelines.map((guideline, index) => (
            <Typography.Text key={index} type='secondary'>
              <CaretRightFilled /> {guideline}
            </Typography.Text>
          ))}
        </Flex>
      ),
    },
  ];

  const getRowKey = (row) => {
    return row.id;
  };

  return (
    <Table
      rowKey={getRowKey}
      columns={columns}
      dataSource={feddbackItems}
      pagination={{ pageSize: 5 }}
      locale={{ emptyText: <Empty description='Feedback not available at this time'></Empty> }}
      style={{ background: 'none' }}
    />
  );
};
export default DetailedFeedback;
