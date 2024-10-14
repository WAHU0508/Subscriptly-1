import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = ({ setUser }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        // Signup Logic
        const newUser = { name, email, password };
        const response = await axios.post('http://127.0.0.1:5000/sign_up', newUser);

        if (response.status === 201) {
          alert('Signup successful!');
          const userData = response.data.user;
          
          if (userData && userData.name) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData.name);
            navigate('/home');
          } else {
            alert('Error: Invalid signup response from server.');
          }
        }
      } else {
        // Signin Logic
        const credentials = { name, password };
        const response = await axios.post('http://127.0.0.1:5000/login', credentials);

        if (response.status === 200) {
          alert('Signin successful!');
          const userData = response.data;
          
          if (userData && userData.name) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData.name);
            navigate('/home');
          } else {
            alert('Error: Invalid signin response from server.');
          }
        }
      }

      // Clear form
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      // Handle errors and display appropriate messages
      if (error.response) {
        // Server responded with a status other than 200 range
        if (error.response.status === 401) {
          alert('Wrong name or password. Please try again.');
        } else if (error.response.status === 409) {
          alert('User already exists. Please try signing in.');
        } else {
          alert('An error occurred: ' + (error.response.data.message || 'Unexpected error.'));
        }
      } else if (error.request) {
        // Request was made but no response was received
        alert('Unable to connect to the server. Please check your network.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h2 id="loginHeader">{isSignup ? 'Subscriptly' : 'Welcome'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {isSignup && (
          <div>
            <input
              type="email"
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <input
            type="password"
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isSignup ? 'Signup' : 'Signin'}</button>
      </form>
      <p>
        {isSignup ? 'Already have an account?' : 'New here?'}
        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Signin' : 'Signup'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
