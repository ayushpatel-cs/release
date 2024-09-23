// components/Homepage.js
import React from 'react';
import './homepage.css';
import '../../images/homescreen.png'
function Homepage() {
  return (
    <div className="homepage">
      <header className="header">
        <div className="header-icons">
          <div className="icon-grid" />
          <div className="icon-user" />
        </div>
      </header>
      
      <div className="hero">
        <img
          className="hero-image"
          src="/images/homescreen.png"  // Add the correct path to your image
          alt="Interior room"
        />
        <h1 className="hero-title">ReLease</h1>
        <h2 className="hero-subtitle">
          Looking for a place to stay? We've got you covered!
        </h2>
        <div className="search-bar">
          <div className="search-input">
            <label>Location</label>
            <input type="text" placeholder="Where do you want to stay?" />
          </div>
          <div className="search-input">
            <label>From</label>
            <input type="date" />
          </div>
          <div className="search-input">
            <label>To</label>
            <input type="date" />
          </div>
          <button className="search-button">
            <span role="img" aria-label="search icon">🔍</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
