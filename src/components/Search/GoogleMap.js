import React, { useEffect, useRef, useState } from 'react';
import { googleMapsLoader } from '../../utils/googleMaps';

const GoogleMap = ({ listings, center, zoom = 13, radius = 10 }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    googleMapsLoader.load()
      .then((google) => {
        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: zoom,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          center: center || { lat: 39.8283, lng: -98.5795 }, // Default to US center
        });

        setMap(mapInstance);

        if (center?.lat && center?.lng) {
          createCircle(mapInstance, center, radius);
          updateMarkers(mapInstance);
        }
      })
      .catch((err) => {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map');
      });

    return () => {
      cleanupMap();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    if (center && typeof center === 'object' && center.lat && center.lng) {
      map.setCenter(center);
      map.setZoom(zoom);
      createCircle(map, center, radius);
      updateMarkers(map);
    }
  }, [center, zoom, radius, map]);

  useEffect(() => {
    if (map && listings) {
      updateMarkers(map);
    }
  }, [listings, map]);

  const cleanupMap = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
        if (marker.marker) {
          marker.marker.setMap(null);
        }
        if (marker.priceTag && marker.priceTag.parentNode) {
          marker.priceTag.parentNode.removeChild(marker.priceTag);
        }
      });
      markersRef.current = [];
    }

    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
  };

  const createCircle = (mapInstance, center, radius) => {
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    circleRef.current = new window.google.maps.Circle({
      strokeColor: '#6B7FF0',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#6B7FF0',
      fillOpacity: 0.1,
      map: mapInstance,
      center: center,
      radius: radius * 1609.34
    });

    const bounds = circleRef.current.getBounds();
    if (bounds) {
      mapInstance.fitBounds(bounds);
    }
  };

  const updateMarkers = (mapInstance) => {
    markersRef.current.forEach(marker => {
      if (marker.marker) {
        marker.marker.setMap(null);
      }
      if (marker.priceTag && marker.priceTag.parentNode) {
        marker.priceTag.parentNode.removeChild(marker.priceTag);
      }
    });
    markersRef.current = [];

    listings.forEach(listing => {
      if (!listing.latitude || !listing.longitude) return;

      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(listing.latitude), lng: parseFloat(listing.longitude) },
        map: mapInstance
      });

      const priceTag = document.createElement('div');
      priceTag.className = 'price-tag';
      priceTag.innerHTML = `
        <div class="bg-white rounded-full px-3 py-1 shadow-lg flex items-center space-x-1 cursor-pointer hover:scale-105 transition-transform">
          <span class="text-[#6B7FF0] font-semibold text-sm">$${listing.min_price}</span>
        </div>
      `;

      const overlay = new window.google.maps.OverlayView();
      overlay.onAdd = function() {
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(priceTag);
      };

      overlay.draw = function() {
        const projection = this.getProjection();
        if (projection) {
          const position = projection.fromLatLngToDivPixel(marker.getPosition());
          if (position) {
            priceTag.style.left = (position.x - 30) + 'px';
            priceTag.style.top = (position.y - 10) + 'px';
          }
        }
      };

      overlay.setMap(mapInstance);
      markersRef.current.push({ marker, priceTag, overlay });

      priceTag.addEventListener('click', () => {
        window.location.href = `/listings/${listing.id}`;
      });
    });
  };

  if (error) {
    return (
      <div className="w-full h-full rounded-2xl flex items-center justify-center bg-gray-100">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full rounded-2xl" />;
};

export default GoogleMap; 