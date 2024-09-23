// components/Listing.js
import React from 'react';
import './listing.css';

function Listing() {
  return (
    <div className="listing-page">
      <div className="listing-details">
        <h3>The Mark Atlanta</h3>
        <div className="listing-images">
          <img src="image1.jpg" alt="Listing" />
          {/* Add more images as needed */}
        </div>
        <div className="location">
          <h4>Location</h4>
          {/* Map integration */}
        </div>
      </div>
    </div>
  );
}

export default Listing;
