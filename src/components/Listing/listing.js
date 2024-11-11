// components/Listing.js
import React from 'react';
import './listing.css';
import { Link } from 'react-router-dom';

function Listing({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`} className="listing-card">
      <div className="listing-details">
        <h3>{listing.title}</h3>
        <div className="listing-images">
          {listing.images?.[0] && (
            <img 
              src={listing.images[0].image_url} 
              alt={listing.title}
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
          )}
        </div>
        <div className="location">
          <p>{listing.address}</p>
          <p className="price">${listing.min_price?.toLocaleString()}/month</p>
        </div>
      </div>
    </Link>
  );
}

export default Listing;
