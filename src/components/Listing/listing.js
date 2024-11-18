// components/Listing.js
import React from 'react';
import './listing.css';
import { Link } from 'react-router-dom';

function Listing({ listing }) {
  const formatRemainingTime = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return 'Auction ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const remainingTime = listing.auction_end_date ? formatRemainingTime(listing.auction_end_date) : null;

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
          {remainingTime && (
            <p className="auction-time" style={{ 
              color: remainingTime === 'Auction ended' ? '#dc2626' : '#059669',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              marginTop: '0.5rem'
            }}>
              {remainingTime}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Listing;
