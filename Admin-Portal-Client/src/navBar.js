// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css';

const NavBar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">AdminPanel</Link>
        <ul className="navbar-menu">
          <li className="navbar-item"><Link to="/dashboard" className="navbar-link">Home</Link></li>
          <li className="navbar-item"><Link to="/employees" className="navbar-link">Employee List</Link></li>
          <li className="navbar-item"><button onClick={onLogout} className="navbar-button">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;