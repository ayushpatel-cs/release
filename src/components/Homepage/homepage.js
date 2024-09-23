// Homescreen.js
import React from 'react';
import './homepage.css';
import homescreenimage from '../../images/homescreen.png'

function Homepage() {
  return (
    <div className="homepage">
      
      <div className="hero">
        <h1 className="hero-title">ReLease</h1>
        <img
          className="hero-image"
          src={homescreenimage}  
          alt="Interior room"
        />
        <h2 className="hero-subtitle">
          Looking for a place to stay? We've got you covered!
        </h2>
        <button className="cta-button">Explore Now</button>
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