// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

function Header() {
  return (
    <div className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">ReLease</h1>
        <div className="navbar-links">
          <Link className="navbar-link" to="/">Home</Link>
          <Link className="navbar-link" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
