import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';

const InterviewStatus = ({ status }) => {
  {
    switch (status) {
      case 'REGISTERED':
        return (
          <Tag icon={<ClockCircleOutlined />} color='#ad4e00'>
            REGISTERED
          </Tag>
        );
      case 'SCHEDULED':
        return (
          <Tag icon={<ClockCircleOutlined />} color='#2f54eb'>
            SCHEDULED
          </Tag>
        );
      case 'ERROR':
        return (
          <Tag icon={<CloseCircleOutlined />} color='#820014'>
            ERROR
          </Tag>
        );
      case 'EVALUATED':
        return (
          <Tag icon={<CheckCircleOutlined />} color='#237804'>
            EVALUATED
          </Tag>
        );
      case 'PENDING_EVALUATION':
        return (
          <Tag icon={<ExclamationCircleOutlined />} color='#ad6800'>
            PENDING EVALUATION
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  }
};
export default InterviewStatus;
