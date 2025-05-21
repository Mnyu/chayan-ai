import { Card, Flex, Button, Form, Input, Upload, message, Spin, Typography, Modal, List, Result } from 'antd';
import { CarryOutOutlined, CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const instructions = [
  'Make sure you are using a stable internet connection to avoid disruptions.',
  'Find a quiet, well-lit location with minimal background noise.',
  'Grant camera and microphone permissions in your browser.',
  'Ensure you are using a modern browser (Chrome or Firefox).',
];

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

const ConnectionForm = ({ connect, room, setParticipantName }) => {
  const [interview, setInterview] = useState({
    id: '',
    name: '',
    resumeSummary: '',
  });
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [form] = Form.useForm();

  const handleUpload = async (options) => {
    setLoading(true);
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!resp.ok) {
        throw new Error('Resume upload failed');
      }
      const data = await resp.json();
      setFileName(data.fileName);
      setFilePath(data.filePath);
      onSuccess?.(data, new XMLHttpRequest());
    } catch (err) {
      console.error(err);
      onError?.(err);
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    if (fileName) {
      try {
        const res = await fetch(`/api/delete/?fileName=${encodeURIComponent(fileName)}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Delete failed');
        }
        const data = await res.json();
        setFileName('');
        setFilePath('');
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    setLoading(false);
  };

  const startInterview = async () => {
    setIsModalOpen(false);
    const name = form.getFieldValue('name');
    if (interview.id) {
      await connect(room, name, interview);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  form.submit = async () => {
    setLoading(true);
    setIsModalOpen(true);
    const name = form.getFieldValue('name');
    setParticipantName(name);
    const registerReq = {
      name: name,
      fileName: fileName,
      filePath: filePath,
    };
    try {
      const response = await fetch('/api/interviews/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerReq),
      });
      if (!response.ok) {
        throw new Error('Failed to regsiter for interview');
      }
      const data = await response.json();
      setInterview({
        id: data.id,
        name: data.name,
        resumeSummary: data.resumeSummary,
      });
    } catch (err) {
      console.error('Connect error:', err);
    }
    setLoading(false);
  };

  return (
    <Flex justify='center' align='center' className='h-full'>
      <Spin size='large' spinning={loading}>
        <Card title='Interview' variant='borderless' style={{ width: 600 }}>
          <Form {...formItemLayout} form={form} variant={'outlined'} size='' style={{ maxWidth: 600 }}>
            <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please enter name!' }]}>
              {dataLoaded ? <Typography.Text>{interview.name}</Typography.Text> : <Input />}
            </Form.Item>
            <Form.Item label='Resume' valuePropName='fileList'>
              {dataLoaded ? (
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
            <Form.Item label=' ' name='btn' colon={false}>
              <Button type='primary' htmlType='submit'>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
      <Modal
        centered
        open={isModalOpen}
        footer={[
          <Flex justify='center'>
            <Button type='primary' onClick={startInterview} disabled={loading}>
              Start Interview
            </Button>
          </Flex>,
        ]}
        onCancel={handleCancel}
      >
        <Result
          icon={
            loading ? <Spin size='large' spinning={loading}></Spin> : <CheckCircleOutlined style={{ color: 'green' }} />
          }
          title={loading ? 'Setting up your Interview!' : 'Setup Complete! Please click Start Interview'}
          subTitle='Meanwhile, please read the below instructions carefully.'
          extra={
            <List
              bordered
              dataSource={instructions}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>
                    <CarryOutOutlined style={{ marginRight: 10 }} />
                    <i>{item}</i>
                  </Typography.Text>
                </List.Item>
              )}
            />
          }
        />
      </Modal>
    </Flex>
  );
};
export default ConnectionForm;
