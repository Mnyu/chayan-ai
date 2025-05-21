import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './pages/AppLayout.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Playground from './pages/Playground.jsx';
import Done from './pages/Done.jsx';
import Login from './pages/Login.jsx';
import Interviews from './pages/Interviews.jsx';
import Interview from './pages/Interview.jsx';
import AppRouter from './components/AppRouter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
    {/* <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='home' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='interviews'>
            <Route index element={<Interviews />} />
            <Route path=':id' element={<Interview />} />
          </Route>
          <Route path='playground' element={<Playground />} />
          <Route path='done' element={<Done />} />
        </Route>
      </Routes>
    </BrowserRouter> */}
  </StrictMode>,
);
