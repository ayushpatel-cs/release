import React from 'react';
import { Search, Menu, User } from 'lucide-react';
import './searchresult.css';

const ReLeasePage = () => {
  const listings = [
    { id: 1, name: 'The Hub Atlanta', details: '4 beds 2 bath · Apartment · Floor 2', amenities: 'Wifi · Kitchen · Pool · Study Areas', lease: 'Summer Lease May-August', price: 1070, image: 'hub.png' },
    { id: 2, name: 'University House Atlanta', details: '4 beds 4 baths · Apartment · Floor 8', amenities: 'Wifi · Kitchen · Free Parking · Pool · Gym', lease: 'Summer Lease May-August', price: 1000, image: 'uhouse.png' },
    { id: 3, name: 'The Standard', details: '4 beds 4 baths · Apartment · Floor 12', amenities: 'Wifi · Kitchen · Gym · In-unit laundry', lease: 'Fall Lease September-January', price: 1250, image: 'standard.png'},
  ];

  return (
    <div>
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="logo">ReLease</h1>
          <div className="search-bar">
            <input type="text" placeholder="Atlanta" className="search-input" />
            <span style={{ margin: '0 0.5rem' }}>Feb 19-26</span>
            <Search size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button>Price</button>
            <button>Filters</button>
            <Menu size={24} />
            <User size={24} />
          </div>
        </div>
      </header>

      <main className="main-container">
        <div className="map-container">
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            Map Placeholder
          </div>
        </div>
        <div className="listings-container">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>200+ stays in Atlanta</h2>
          {listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <div style={{ display: 'flex' }}>
                <div className="listing-image">
                  <div style={{ height: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                  <img
                src={`/images/${listing.image}`}
                alt={listing.name}
                style={{ height: '8rem', width: '12rem', objectFit: 'cover', borderRadius: '8px' }}
              />
                  </div>
                </div>
                <div className="listing-details">
                  <h3 style={{ fontWeight: '600' }}>{listing.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>{listing.details}</p>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>{listing.amenities}</p>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>{listing.lease}</p>
                  <p style={{ fontWeight: '600', marginTop: '0.5rem' }}>${listing.price} /month</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReLeasePage;