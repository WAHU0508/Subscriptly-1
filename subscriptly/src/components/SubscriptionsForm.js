import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubscriptionsForm.css";

function SubscriptionsForm({ userId, onAddSubscription }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost: '',
    billing_cycle: 'monthly',
    date_of_payment: '',
  });

  useEffect(() => {
    console.log("User ID:", userId); // Log the user ID
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    // Send new subscription data to the API
    axios.post(`https://test-backend-e4ae.onrender.com/user/${userId}/subscriptions`, formData)
      .then((response) => {
        onAddSubscription(response.data); // Update parent component with the new subscription
        setFormData({
          name: '',
          category: '',
          cost: '',
          billing_cycle: 'monthly',
          date_of_payment: ''
        });
      })
      .catch((error) => console.error('Error adding subscription:', error));
  };

  return (
    <form className="myForm" onSubmit={handleSubmit}>
      <h3>Add Subscription</h3>
      <input
        type="text"
        name="name"
        placeholder="subscription name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="streaming">Streaming</option>
        <option value="music">Music</option>
        <option value="software">Software</option>
        <option value="shopping">Shopping</option>
        <option value="gaming">Gaming</option>
        <option value="education">Education</option>
        <option value="cloud storage">Cloud Storage</option>
        <option value="other">Other</option>
      </select>
      <input
        type="number"
        name="cost"
        placeholder="subscription cost"
        value={formData.cost}
        onChange={handleChange}
        required
      />
      <select
        name="billing_cycle"
        value={formData.billing_cycle}
        onChange={handleChange}
        required
      >
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
        <option value="weekly">Weekly</option>
      </select>
      <input
        type="date"
        name="date_of_payment"
        placeholder="Date Paid"
        value={formData.date_of_payment}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Subscription</button>
    </form>
  );
}

export default SubscriptionsForm;