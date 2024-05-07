
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserRegistrationForm from './UserRegistrationForm';
import UserLoginForm from './UserLoginForm';
import UserProfilePage from './UserProfilePage';
import './App.css';

const user = {
  username: 'user123',
  email: 'user@example.com',
  aboutMe: 'This is my about me section',
};
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/UserLoginForm">Login</Link>
              </li>
              <li>
                <Link to="/UserRegistrationForm">Register</Link>
              </li>
              <li>
                <Link to="/UserProfilePage">Profile</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<UserRegistrationForm />} />
            <Route path="/UserLoginForm" element={<UserLoginForm />} />
            <Route path="/UserRegistrationForm" element={<UserRegistrationForm />} />
            <Route path="/UserProfilePage" element={<UserProfilePage userData={user}/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

