import { SmileOutlined } from '@ant-design/icons';
import { Button, Result, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Done = () => {
  const navigate = useNavigate();
  const backToInterviews = () => {
    navigate('/interviews');
  };
  return (
    <Result
      icon={<SmileOutlined style={{ color: '#ff7a45' }} />}
      title='Thank you for interviewing!'
      subTitle={
        <Typography.Text type='secondary' style={{ fontSize: 16 }}>
          Your interview will be evaluated shortly. You can track the status in interviews section.
        </Typography.Text>
      }
      extra={
        <Button type='primary' onClick={backToInterviews}>
          Back To Interviews
        </Button>
      }
    />
  );
};
export default Done;
