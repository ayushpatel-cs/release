import React, { useEffect, useRef, useState } from 'react';
import { googleMapsLoader } from '../../utils/googleMaps';

const PropertyAddressAutocomplete = ({ onLocationSelect, className, placeholder }) => {
  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeAutocomplete = (google) => {
    try {
      autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry', 'place_id'],
        types: ['address']
      });

      autoCompleteRef.current.addListener('place_changed', handlePlaceSelect);
      setIsLoading(false);
    } catch (err) {
      console.error('Error initializing autocomplete:', err);
      setError('Failed to initialize location search');
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = () => {
    const place = autoCompleteRef.current.getPlace();
    
    if (!place.geometry) {
      console.error('No details available for input:', place);
      return;
    }

    const addressComponents = {};
    place.address_components.forEach(component => {
      component.types.forEach(type => {
        addressComponents[type] = component.long_name;
      });
    });

    const locationData = {
      formatted_address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      place_id: place.place_id,
      address_line1: `${addressComponents.street_number || ''} ${addressComponents.route || ''}`.trim(),
      address_line2: '',
      city: addressComponents.locality || addressComponents.administrative_area_level_2,
      state: addressComponents.administrative_area_level_1,
      zip_code: addressComponents.postal_code
    };

    setInputValue(place.formatted_address);
    onLocationSelect(locationData);
  };

  useEffect(() => {
    googleMapsLoader.load()
      .then((google) => {
        initializeAutocomplete(google);
      })
      .catch((err) => {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load location search');
        setIsLoading(false);
      });

    return () => {
      if (autoCompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`w-full p-2 border border-gray-300 rounded-md ${className}`}
        placeholder={placeholder || "Enter an address"}
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default PropertyAddressAutocomplete; 