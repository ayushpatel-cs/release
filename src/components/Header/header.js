// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import navbarlogo from '../../images/logo.png';

function Header() {
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <img
            className="navbar-image"
            src={navbarlogo}  
            alt="Interior room"
          />
          <h1 className="navbar-title">ReLease</h1>
        </div>
        <div className="navbar-links">
          <Link className="navbar-link" to="/">Home</Link>
          <Link className="navbar-link" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
