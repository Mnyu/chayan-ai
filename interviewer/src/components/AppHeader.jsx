import { FireFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Image, Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <Header style={{ padding: '0px 2px 2px 2px' }}>
      <Flex justify='space-between' align='center' style={{ padding: 12 }}>
        <Flex>
          {/* <Image src='/img2.png' width={40} height={40} /> */}
          <FireFilled onClick={navigateToHome} style={{ color: '#ff9c6e', fontSize: 40 }} />
        </Flex>
        <Flex>
          <Typography.Title level={2} style={{ fontWeight: 'normal', margin: 2 }}>
            Chayan AI - चयन AI
          </Typography.Title>
        </Flex>
        <Flex gap={5}>
          {isLoggedIn ? (
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#ff9c6e' }} />
          ) : (
            <Button type='primary' onClick={navigateToLogin}>
              Login
            </Button>
          )}
        </Flex>
      </Flex>
    </Header>
  );
};
export default AppHeader;
