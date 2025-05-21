import { ConfigProvider, Layout, theme } from 'antd';
import AppHeader from './components/AppHeader';
import { Content } from 'antd/es/layout/layout';
import ConnectionForm from './components/ConnectionForm';
import useConnection from './hooks/useConnection';
import Playground from './components/Playground';
import { useState } from 'react';
import { Room } from 'livekit-client';
import { RoomAudioRenderer, RoomContext } from '@livekit/components-react';
import '@livekit/components-styles/components/participant';

function App() {
  const [participantName, setParticipantName] = useState('');
  const [room] = useState(() => new Room({}));
  const { isConnected, connect, disconnect } = useConnection();

  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.darkAlgorithm],
        token: {
          // colorBgContainer: 'rgba(255, 255, 255, 0.055)',
          colorPrimary: '#ff7a45',
          fontFamily:
            'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
        },
        components: {
          Layout: {
            bodyBg: 'rgb(25, 25, 25)',
            headerBg: 'rgb(25, 25, 25)',
            siderBg: 'rgba(255, 255, 255, 0.055)',
            triggerBg: 'none',
          },
          Menu: {
            itemBg: 'none',
            darkItemBg: 'none',
            itemSelectedColor: '#fffff',
            itemSelectedBg: 'rgba(255, 255, 255, 0.055)',
            darkItemSelectedBg: 'rgba(255, 255, 255, 0.055)',
            subMenuItemSelectedColor: '#fffff',
          },
          Button: {
            defaultBg: 'rgba(255, 255, 255, 0.055)',
            defaultHoverBg: 'rgb(25, 25, 25)',
            defaultHoverColor: '#fffff',
            defaultActiveColor: '#fffff',
          },
          Card: {
            // headerBg: 'rgba(255, 255, 255, 0.055)',
          },
        },
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <AppHeader />
        <Content className='h-full'>
          <RoomContext.Provider value={room}>
            {/* <Playground participantName={participantName} disconnect={disconnect} /> */}
            {isConnected ? (
              <Playground participantName={participantName} disconnect={disconnect} />
            ) : (
              <ConnectionForm connect={connect} room={room} setParticipantName={setParticipantName} />
            )}
            <RoomAudioRenderer />
          </RoomContext.Provider>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
