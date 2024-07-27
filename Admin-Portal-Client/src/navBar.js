// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ onLogout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Home</Link></li>
        <li><Link to="/employees">Employee List</Link></li>
        <li><button onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default NavBar;
