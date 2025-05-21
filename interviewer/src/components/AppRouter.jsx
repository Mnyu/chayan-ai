import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../pages/AppLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Interviews from '../pages/Interviews';
import Interview from '../pages/Interview';
import Playground from '../pages/Playground';
import Done from '../pages/Done';
import { useState } from 'react';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      const data = await response.json();
      setUserName(data.username);
      setRole(data.role);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = async () => {
    setUserName('');
    setRole('');
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppLayout isLoggedIn={isLoggedIn} />}>
          <Route index element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path='home' element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path='login' element={<Login login={login} />} />
          <Route path='interviews'>
            <Route index element={isLoggedIn ? <Interviews /> : <Navigate to='/login' />} />
            <Route path=':id' element={isLoggedIn ? <Interview /> : <Navigate to='/login' />} />
          </Route>
          <Route path='playground' element={isLoggedIn ? <Playground /> : <Navigate to='/login' />} />
          <Route path='done' element={isLoggedIn ? <Done /> : <Navigate to='/login' />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
