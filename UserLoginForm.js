import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const UserLoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      navigate('UserProfilePage');
      console.log('Login successful:', response.data);
      // Redirect to profile page or perform other actions
    } catch (error) {
      console.error('Login failed:', error.response.data);
      // Display error message to the user
    }
  };


  return (
    <div className="login-container">
      <h2>Login</h2>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="login-input"/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="login-input"/>
      <button onClick={handleLogin} className="login-button">Login</button>
    </div>
  );
};

export default UserLoginForm;
