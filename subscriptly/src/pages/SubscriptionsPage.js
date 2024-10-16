import React, { useState, useEffect } from 'react';
import Table from "../components/Table";
import "./HomePage.css";
import './SubscriptionPage.css';
import SubscriptionsForm from "../components/SubscriptionsForm";
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Filter from "../components/Filter";
import PaymentDateFilter from "../components/PaymentDateFilter";

//Page to display subscriptions.
const SubscriptionsPage = ({ user }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentId, setCurrentId] = useState(null);

  //Fetch the current user's subscriptions
  console.log(JSON.stringify(user))
  // const userid = user['id']
  // console.log(userid)
  useEffect(() => {
    if (user) {
      setCurrentId(parseInt(JSON.stringify(user.id)), 10)
    }
  }, [user])

  useEffect(() => {
    const fetchSubscriptions = () => {
      if (currentId) {
        fetch(`https://test-backend-e4ae.onrender.com/user/${currentId}/subscriptions`)
          .then(res => {
            if (!res.ok) {
              throw new Error('Network Response Was Not Ok');
            }
            return res.json();
          })
          .then(data => setSubscriptions(data))
          .catch(error => console.error('Error fetching subscriptions:', error));
      }
    };
    fetchSubscriptions();
  }, [currentId]);

  //Delete the current user's subscription by clicking cancel button and persist changes to server
const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to cancel this subscription?")) {
    fetch(`https://test-backend-e4ae.onrender.com/user/${currentId}/subscriptions/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to delete subscription');
          }
          return res.json()
        })
        .then(() => {
          setSubscriptions(prev => prev.filter(subscription => subscription.id !== id));
        })
      .catch(error => console.error('Error fetching user data:', error));
  }
};

  //Filter the subscriptions by name search, category and date range.
  const filteredSubscriptions = (subscriptions || []).filter(subscription => {
    const matchSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === '' || subscription.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchDateRange = (!startDate || new Date(subscription.date_of_payment) >= new Date(startDate)) &&
      (!endDate || new Date(subscription.date_of_payment) <= new Date(endDate));
    return matchSearch && matchCategory && matchDateRange;
  });

  //Function to add a new subscription and give a random id.Added subscription is persisted to server
  const handleAddSubscription = (newSubscription) => {
    fetch(`https://test-backend-e4ae.onrender.com/user/${currentId}/subscriptions`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newSubscription),
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to add  subscription');
      return res.json()
    })
    .then(addedSubscription => {
      setSubscriptions(prevSubs => [...prevSubs, addedSubscription]);
    })
      .catch(error => console.error('Error adding subscription:', error));
  };

  //Function to determine selected category for filtering
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  //Function to handle edited subscription cell in the table
  const handleUpdateSubscription = (id, updatedSubscription) => {
    setSubscriptions((prevSubscriptions) =>
      prevSubscriptions.map((subscription) =>
        subscription.id === id ? updatedSubscription : subscription
      )
    );
  };

  //Display this message if no user is logged in.
  if (!user) {
    return (
      <div className="sign-in-prompt" style={{ textAlign: 'center', marginTop: '20px', color: 'black !important' }}>
        <h1>Please Sign In or Register to use Subscriptly</h1>
      </div>
    );
  }

  return (
    <div className="myHomePage">
      <div className="topSection">
        <div className="leftColumn">
          <SubscriptionsForm userId={currentId} onAddSubscription={handleAddSubscription} />
        </div>
        <div className="rightColumn">
          <div className="rightColumnContainer">
            <SearchBar setSearchTerm={setSearchTerm} className="search" />
            <Filter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} className="filter" />
            <PaymentDateFilter startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} className="dates" />
          </div>
        </div>
      </div>
      <div className="tableContainer">
        <Table subscriptions={filteredSubscriptions} handleDelete={handleDelete} onUpdate={handleUpdateSubscription} />
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionsPage;
