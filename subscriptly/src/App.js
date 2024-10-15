import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import UserProfile from './components/UserProfile';
import HomePage from './pages/HomePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import NotificationsPage from './pages/NotificationsPage';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data exists in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set the entire user object
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever the user state changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user from local storage
    setUser(null);
  };

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {/* Redirect to the landing page by default */}
        <Route path="/" element={<Navigate to="/landing" />} />
        
        <Route path="/landing" element={<LandingPage user={user} />} />
        <Route path="/home" element={<HomePage user={user} />} />
        <Route path="/subscriptions" element={<SubscriptionsPage user={user} />} />
        <Route path="/notifications" element={<NotificationsPage user={user} />} />
        <Route path="/login" element={<AuthPage setUser={setUser} />} />
        {/* Route for User Profile - Pass the user ID correctly */}
        <Route 
          path="/profile" 
          element={<UserProfile userId={user ? user.id : null} setUser={setUser} />} 
        />
      </Routes>
    </div>
  );
}

export default App;
