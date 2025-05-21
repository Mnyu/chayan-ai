import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { ConfigProvider, Layout, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Room } from 'livekit-client';
import { useState } from 'react';
import { RoomAudioRenderer, RoomContext } from '@livekit/components-react';
import '@livekit/components-styles/components/participant';

const AppLayout = ({ isLoggedIn }) => {
  const [room] = useState(() => new Room({}));
  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.darkAlgorithm],
        token: {
          // colorBgContainer: 'rgba(255, 255, 255, 0.055)',
          colorBgContainer: 'none',
          colorPrimary: '#ff7a45',
          fontFamily:
            'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
          colorLink: '#69b1ff',
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
            headerBg: 'none',
          },
          Table: {
            headerBg: 'none',
            headerColor: 'rgba(255, 255, 255, 0.46)',
            rowHoverBg: 'rgba(255, 255, 255, 0.055)',
          },
        },
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <AppHeader isLoggedIn={isLoggedIn} />
        <Content className='h-full'>
          <RoomContext.Provider value={room}>
            <Outlet />
            <RoomAudioRenderer />
          </RoomContext.Provider>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
export default AppLayout;
