import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoBox } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const GoogleMapComponent = ({ listings, center, zoom = 13, radius = 10 }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const createCustomMarkerIcon = (price) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="50" style="transition: transform 0.2s ease;">
        <!-- Outer Shadow for Depth -->
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset result="offOut" in="SourceAlpha" dx="0" dy="3" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>

        <!-- Main Rounded Background with Purple Color -->
        <rect x="5" y="5" width="70" height="40" rx="20" ry="20" fill="#6B7FF0" filter="url(#shadow)" />

        <!-- White Inner Ellipse for Border Effect -->
        <rect x="8" y="8" width="64" height="34" rx="17" ry="17" fill="white" />

        <!-- Price Text in the Center -->
        <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="18" fill="#6B7FF0" font-weight="bold" font-family="Arial, sans-serif">
          $${parseInt(price)}
        </text>
      </svg>
    `;
    const encoded = encodeURIComponent(svg);
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encoded}`,
      scaledSize: new window.google.maps.Size(50, 30),
    };
  };

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
    ],
    disableDefaultUI: true,
    zoomControl: true,
  };

  if (loadError) {
    return (
      <div className="w-full h-full rounded-2xl flex items-center justify-center bg-gray-100">
        <div className="text-red-500">Failed to load map</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full rounded-2xl flex items-center justify-center bg-gray-100">
        Loading Map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '100%',
      }}
      zoom={zoom}
      center={center || { lat: 39.8283, lng: -98.5795 }} // Default to US center
      options={mapOptions}
    >
      <Circle
        center={center}
        radius={radius * 1609.34} // Convert miles to meters
        options={{
          strokeColor: '#6B7FF0',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#6B7FF0',
          fillOpacity: 0.1,
        }}
      />

      {listings.map((listing) => {
        if (!listing.latitude || !listing.longitude) return null;
        return (
          <Marker
            key={listing.id}
            position={{
              lat: parseFloat(listing.latitude),
              lng: parseFloat(listing.longitude),
            }}
            icon={createCustomMarkerIcon(listing.min_price)}
            onClick={() => setSelectedListing(listing)}
          />
        );
      })}

      {selectedListing && (
        <InfoBox
          position={{
            lat: parseFloat(selectedListing.latitude) + 0.002, // Offset to move it above the marker
            lng: parseFloat(selectedListing.longitude),
          }}
          onCloseClick={() => setSelectedListing(null)}
          options={{
            closeBoxURL: "", // Hide default close box
            enableEventPropagation: true,
          }}
        >
          <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 w-60 cursor-pointer">
            {/* Custom Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click from propagating to the InfoBox
                setSelectedListing(null);
              }}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}
              aria-label="Close InfoWindow"
            >
              &#10005; {/* Unicode for 'x' */}
            </button>
            {/* Listing Image */}
            <img
              src={selectedListing.images && selectedListing.images.length > 0 ? selectedListing.images[0].image_url : '/placeholder.jpg'}
              alt={selectedListing.title}
              className="w-full h-32 object-cover rounded-t-lg"
              style={{ width: '240px', height: '160px' }} // Fixed size
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }} // Fallback on error
            />
            {/* Listing Details */}
            <div
              className="p-2"
              onClick={() => navigate(`/listings/${selectedListing.id}`)} // Navigate on InfoBox content click
            >
              <h2 className="text-[#6B7FF0] font-semibold text-sm">${selectedListing.min_price.toLocaleString()}</h2>
              <p className="text-gray-700 text-xs font-medium truncate">{selectedListing.title}</p>
              {selectedListing.rating && (
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500 text-xs mr-1">⭐</span>
                  <span className="text-gray-500 text-xs">{selectedListing.rating}</span>
                </div>
              )}
              {/* Optional: Add a "View Listing" Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from propagating to the parent div
                  navigate(`/listings/${selectedListing.id}`);
                }}
                className="mt-2 px-2 py-1 bg-[#6B7FF0] text-white text-xs rounded hover:bg-[#5A6FE0] transition-colors"
              >
                View Listing
              </button>
            </div>
          </div>
        </InfoBox>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
