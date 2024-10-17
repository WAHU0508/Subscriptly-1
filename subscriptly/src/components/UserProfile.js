import React, { useState, useEffect } from "react";
import axios from "axios";
import "./userprofile.css";

function UserProfile({ userId, setUser }) {
  const [userData, setUserData] = useState(null); // Holds user data from the backend
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState(null); // Success message state

  useEffect(() => {
    if (userId) {
      setLoading(true); // Start loading
      axios.get(`https://test-backend-e4ae.onrender.com/user/${userId}`)
        .then(response => {
          setUserData(response.data); // Set user data from API response
          setFormData({
            name: response.data.name || '', // Set form data with current user info
            email: response.data.email || '',
            password: '', // Password should not be filled for security
          });
          setLoading(false); // Stop loading
        })
        .catch(error => {
          setError("Failed to load user data.");
          setLoading(false); // Stop loading even if error
        });
    }
  }, [userId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for updating profile data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId) {
      axios.put(`https://test-backend-e4ae.onrender.com/user/${userId}`, formData)
        .then(response => {
          setUserData(response.data); // Update local user data
          setUser(response.data)
          setSuccessMessage("Profile updated successfully!"); // Set success message
          setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
        })
        .catch(error => {
          console.error('Error updating profile:', error);
          alert("Failed to update profile. Please try again.");
        });
    }
  };

  // Simple loading state
  if (loading) return <p>Loading...</p>;

  // Simple error state
  if (error) return <p>{error}</p>;

  // Basic display of user data
  return (
<div className="user-profile">
  <h2>User Profile</h2>
  {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
  {userData ? (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password (leave blank to keep current password):</label>
          <input
            type="password"
            name="password"
            placeholder="New password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <h3>Subscriptions</h3>
      {userData.subscriptions && userData.subscriptions.length > 0 ? (
        <ul>
          {userData.subscriptions.map((sub) => (
            <li key={sub.id}>
              {sub.name} - {sub.category} - ${sub.cost} ({sub.billing_cycle})
            </li>
          ))}
        </ul>
      ) : (
        <p>No subscriptions found.</p>
      )}
    </div>
  ) : (
    <p>No user data available.</p>
  )}
</div>

  );
}

export default UserProfile;
