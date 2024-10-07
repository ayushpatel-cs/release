import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import homescreenimage from '../../images/homepage.png';

function Homepage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSearch = () => {
    // Navigate to the search page with query parameters
    navigate(`/search?location=${encodeURIComponent(location)}&from=${fromDate}&to=${toDate}`);
  };

  return (
    <div className="homepage">
      <div className="hero">
        <img
          className="hero-image"
          src={homescreenimage}
          alt="Interior room"
        />
        <h2 className="hero-subtitle">
          Looking for a place to stay? We've got you covered!
        </h2>
        <div className="search-bar">
          <div className="search-input">
            <label>Location</label>
            <input 
              type="text" 
              placeholder="Where do you want to stay?" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="search-input">
            <label>From</label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="search-input">
            <label>To</label>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button className="search-button" onClick={handleSearch}>
            <span role="img" aria-label="search icon">🔍</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;