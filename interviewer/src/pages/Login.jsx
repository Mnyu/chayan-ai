import { Form, Input, Button, Checkbox, Flex, Typography, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';

const Login = ({ login }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const isLoggedIn = await login(values.username, values.password);
    if (isLoggedIn) {
      navigate('/interviews');
    }
    setLoading(false);
  };

  return (
    <Flex justify='center' align='center' style={{ height: '100%' }}>
      <Spin size='large' spinning={loading}>
        <Flex vertical className='min-w-md'>
          <Typography.Title style={{ marginBottom: 10 }}>Log In</Typography.Title>
          <Typography.Text type='secondary' style={{ marginBottom: 20 }}>
            Sign in to get started.
          </Typography.Text>
          <Form name='login' className='' initialValues={{ remember: true }} onFinish={onFinish}>
            <Form.Item name='username' rules={[{ required: true, message: 'Please input your username.' }]}>
              <Input size='large' prefix={<UserOutlined className='' />} placeholder='Username' />
            </Form.Item>
            <Form.Item name='password' rules={[{ required: true, message: 'Please input your password.' }]}>
              <Input size='large' prefix={<LockOutlined className='' />} type='password' placeholder='Password' />
            </Form.Item>
            <Form.Item name='remember'>
              <Flex justify='space-between'>
                <Checkbox checked>Remember me</Checkbox>
                <Typography.Link href='javascript:void(0)'>Forgot password</Typography.Link>
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Spin>
    </Flex>
  );
};
export default Login;
