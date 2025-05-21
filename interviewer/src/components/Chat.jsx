import { Card, Flex, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatMessageInput from './ChatMessageInput';

const inputHeight = 48;

const Chat = ({ messages, onSend }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef, messages]);

  return (
    <Flex vertical className='w-full h-full'>
      <Card ref={containerRef} title='Chat' className='w-full h-full overflow-auto'>
        <Flex vertical justify={'center'} align={'flex-start'} className='w-full'>
          {messages.map((message, index, allMsg) => {
            const hideName = index >= 1 && allMsg[index - 1].name === message.name;

            return (
              <ChatMessage
                key={index}
                hideName={hideName}
                name={message.name}
                message={message.message}
                isSelf={message.isSelf}
              />
            );
          })}
        </Flex>
        {/* <ChatMessageInput height={inputHeight} placeholder='Type a message' onSend={onSend} /> */}
      </Card>
    </Flex>
  );
};
export default Chat;
