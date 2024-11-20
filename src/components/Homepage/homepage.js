import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import homescreenimage from '../../images/homepage.png';
import CitySearchAutocomplete from '../Common/CitySearchAutocomplete';


function Homepage() {
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleLocationSelect = (data) => {
    setLocationData(data);
  };

  const handleSearch = () => {
    if (!locationData) return;
  
    const queryParams = new URLSearchParams({
      lat: locationData.latitude,
      lng: locationData.longitude,
      address: locationData.address
    });
    
    if (fromDate) queryParams.set('start_date', fromDate);
    if (toDate) queryParams.set('end_date', toDate);
    
    navigate(`/search?${queryParams.toString()}`);
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
          <div className="search-input flex-grow">
            <label>Location</label>
            <CitySearchAutocomplete
              placeholder="Where do you want to stay?"
              onLocationSelect={handleLocationSelect}
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
          <button 
            className="search-button" 
            onClick={handleSearch}
            disabled={!locationData}
          >
            <span role="img" aria-label="search icon">🔍</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;