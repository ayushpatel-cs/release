// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import navbarlogo from '../../images/logo.png';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  return (
    <div className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <div className="navbar-left">
            <img
            className="navbar-image"
            src={navbarlogo}  
            alt="Interior room"
          />
          <h1 className="navbar-title">ReLease</h1>
        </div>
        </Link>
        <div className="navbar-links">
          <Link className="navbar-link" to="/">Home</Link>
          {user ? (
            <>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <button 
                onClick={logout}
                className="navbar-link"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
