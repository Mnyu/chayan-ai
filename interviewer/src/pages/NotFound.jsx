import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const backToHome = () => {
    navigate('/');
  };

  return (
    <Result
      status='403'
      title='403'
      subTitle='Sorry, you are not authorized to access this page.'
      extra={
        <Button type='primary' onClick={backToHome}>
          Back Home
        </Button>
      }
    />
  );
};
export default NotFound;
