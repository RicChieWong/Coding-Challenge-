import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './register.css';


const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', {
        username,
        email,
        password
      });
      navigate('UserLoginForm');
      console.log('Registration successful:', response.data);
      // Redirect to login page or perform other actions
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      // Display error message to the user
    }
  };

  return (
    <div className="registration-container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="registration-input"
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="registration-input"
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="registration-input"
        />
        <button type="submit" className="registration-button">Register</button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
