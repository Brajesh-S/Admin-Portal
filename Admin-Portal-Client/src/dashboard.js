// src/components/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBar";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <NavBar onLogout={handleLogout} />
      <div className="dashboard-content">
        <h1>Welcome to Admin Panel</h1>
        <p>Manage your business operations efficiently.</p>
      </div>
    </div>
  );
};

export default Dashboard;
