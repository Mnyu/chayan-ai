import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Modal, Result, Spin, Typography, Upload } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInterviews from '../hooks/useInterviews';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const RegisterPopup = ({ isModalOpen, setIsModalOpen, setInterviews }) => {
  const navigate = useNavigate();
  const { getAllInterviews } = useInterviews();
  const [interviewId, setInterviewId] = useState(null);
  const [username, setUserName] = useState(null);
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [errMessage, setErrMessage] = useState('');

  const handleUpload = async (options) => {
    setLoading(true);
    setErrMessage('');
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!resp.ok) {
        const data = await resp.json();
        if (data && data.error) {
          throw new Error(data.error);
        }
        throw new Error('Resume upload failed');
      }
      const data = await resp.json();
      setFileName(data.fileName);
      setFilePath(data.filePath);
      onSuccess?.(data, new XMLHttpRequest());
    } catch (err) {
      console.log(err);
      setErrMessage(err.message);
      onError?.(err);
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    if (fileName) {
      try {
        setLoading(true);
        const res = await fetch(`/api/delete/?fileName=${encodeURIComponent(fileName)}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Delete failed');
        }
        const data = await res.json();
        setFileName('');
        setFilePath('');
        setLoading(false);
        return true;
      } catch (err) {
        console.error(err);
        setLoading(false);
        return false;
      }
    }
  };

  const handleCancel = async () => {
    setIsModalOpen(false);
    if (interviewId) {
      const allInterviews = await getAllInterviews();
      setInterviews(allInterviews);
    }
    navigate('/interviews');
  };

  const cleanup = () => {
    setUserName(null);
    setFileName('');
    setFilePath('');
    setInterviewId(null);
    setErrMessage('');
    form.resetFields();
    setLoading(false);
  };

  const register = async () => {
    try {
      await form.validateFields();
      if (fileName && filePath) {
        setLoading(true);
        const name = form.getFieldValue('name');
        const registerReq = {
          name: name,
          fileName: fileName,
          filePath: filePath,
        };
        const response = await fetch('/api/interviews/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerReq),
        });
        if (!response.ok) {
          throw new Error('Failed to regsiter for interview');
        }
        const data = await response.json();
        setInterviewId(data.id);
        setUserName(data.userName);
      }
    } catch (err) {
      console.error('register error:', err);
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
          {interviewId ? (
            <Button type='primary' onClick={handleCancel}>
              Back To Interviews
            </Button>
          ) : (
            <Button type='primary' onClick={register} disabled={username && filePath}>
              Register
            </Button>
          )}
        </Flex>,
      ]}
    >
      <Spin size='large' spinning={loading}>
        <Flex vertical gap={30}>
          <Flex justify='center'>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              New Interview
            </Typography.Title>
          </Flex>
          <Form {...formItemLayout} form={form} variant={'outlined'} size='' style={{ maxWidth: 600 }}>
            <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please enter name!' }]}>
              {interviewId ? <Typography.Text>{username}</Typography.Text> : <Input />}
            </Form.Item>
            <Form.Item label='Resume' valuePropName='fileList' required={true}>
              {interviewId ? (
                <Typography.Link href='javascript:void(0)'>{fileName}</Typography.Link>
              ) : (
                <Upload
                  name='resume'
                  customRequest={handleUpload}
                  accept='.pdf'
                  listType='picture'
                  showUploadList={true}
                  multiple={false}
                  maxCount={1}
                  onRemove={handleRemove}
                >
                  <Button icon={<UploadOutlined />} disabled={fileName}>
                    Click to upload
                  </Button>
                </Upload>
              )}
            </Form.Item>
            {errMessage && (
              <Form.Item label=' ' name='btn' colon={false}>
                <Typography.Text type='danger'>{errMessage}</Typography.Text>
              </Form.Item>
            )}
          </Form>
          {interviewId && (
            <Result
              icon={<CheckCircleOutlined style={{ color: 'green' }} />}
              title={'Thank you for registering!'}
              subTitle='Your interview will be scheduled shortly. You can track the status in interviews section.'
              style={{ paddingTop: 0 }}
            />
          )}
        </Flex>
      </Spin>
    </Modal>
  );
};
export default RegisterPopup;
