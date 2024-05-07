import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './userprofile.css';

const UserProfilePage = ({ userData }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(userData.username);
    const [email, setEmail] = useState(userData.email);
    const [password, setPassword] = useState(userData.password);
    const [aboutMe, setAboutMe] = useState(userData.aboutMe);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    


    useEffect(() => {
        setUsername(userData.username);
        setEmail(userData.email);
        setPassword(userData.password);
        setAboutMe(userData.aboutMe);
    }, [userData]);

    const handleEdit = () => {
        setIsEditing(true);
        setSuccess(false);
        setError(null);
    };

    const handleSave = async () => {
        setSuccess(false);
        setError(null);
        try {
            const response = await axios.post('/api/profile/update', {
                username,
                email,
                password,
                aboutMe,
            });
            setIsEditing(false);
            setSuccess(true);
            console.log('update successful:', response.data);
        } catch (error) {
            setError("Failed to update profile. Please try again.");
        }
    };
    const handleLogout = () => {
        // You can implement the logout logic here, for example, clearing user session or token
        // Clear tokens or user data from local storage or session storage
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        // Redirect to login page or homepage
        navigate("UserLoginForm");
        console.log("User logged out");
        
    };


    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {success && <p className="success-message">Profile updated successfully!</p>}
            {error && <p className="error-message">{error}</p>}
            {isEditing ? (
                <div className="profile-form">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="profile-input"
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="profile-input"
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="profile-input"
                    />
                    <label>About Me:</label>
                    <textarea
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        className="profile-input"
                    />
                    <button onClick={handleSave} className="profile-button">Save</button>
                    <button onClick={handleLogout} className="profile-button logout-button">Logout</button>
                </div>
            ) : (
                <div className="profile-details">
                    <p>Username: {username}</p>
                    <p>Email: {email}</p>
                    <p>Password: ********</p>
                    <p>About Me: {aboutMe}</p>
                    <button onClick={handleEdit} className="profile-button">Edit</button>
                    <button onClick={handleLogout} className="profile-button logout-button">Logout</button>
                </div>
            )}
        </div>
    );
};
UserProfilePage.propTypes = {
    userData: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      aboutMe: PropTypes.string,
    }),
    onLogout: PropTypes.func.isRequired,
  };

export default UserProfilePage;

