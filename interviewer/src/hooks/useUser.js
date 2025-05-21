// import { useState } from 'react';

// const useUser = () => {
//   const [userName, setUserName] = useState('');
//   const [role, setRole] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const login = async (username, password) => {
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username: username,
//           password: password,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to login');
//       }
//       const data = await response.json();
//       setUserName(data.username);
//       setRole(data.role);
//       setIsLoggedIn(true);
//       return true;
//     } catch (err) {
//       console.error('Login error:', err);
//       return false;
//     }
//   };

//   const logout = async () => {
//     setUserName('');
//     setRole('');
//     setIsLoggedIn(false);
//   };

//   return { isLoggedIn, userName, role, login, logout };
// };

// export default useUser;
