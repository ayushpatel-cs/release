// components/Search.js
import React from 'react';
import './search.css';

function Search() {
  return (
    <div className="search-page">
      <div className="map-container">
        {/* Map Integration Goes Here */}
      </div>
      <div className="listing-results">
        <h3>200+ stays in Atlanta</h3>
        <div className="listing-item">
          <img src="image1.jpg" alt="Listing" />
          <div>
            <h4>The Hub Atlanta</h4>
            <p>2 bed 2 bath</p>
            <p>$1070/month</p>
          </div>
        </div>
        {/* Add more listings as needed */}
      </div>
    </div>
  );
}

export default Search;
