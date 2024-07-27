// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './navBar';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <NavBar onLogout={handleLogout} />
      <h1>Welcome Admin Panel</h1>
    </div>
  );
};

export default Dashboard;
