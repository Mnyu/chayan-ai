import { Flex, Typography } from 'antd';

const { Text } = Typography;

const ChatMessage = ({ name, message, isSelf, hideName }) => {
  return (
    <Flex vertical gap={5} className={`${hideName ? 'pt-0' : 'pt-6'}`}>
      {!hideName && (
        <Flex justify='flex-start'>
          <Text type='secondary' className='mt-3' style={isSelf ? { color: '#52c41a' } : { color: '#ff7a45' }}>
            {name}
          </Text>
        </Flex>
      )}
      <Flex>
        <Text type={isSelf ? '' : 'secondary'}>{message}</Text>
      </Flex>
    </Flex>
  );
};
export default ChatMessage;
