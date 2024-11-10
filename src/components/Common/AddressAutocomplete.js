import React, { useEffect, useRef, useState } from 'react';

const AddressAutocomplete = ({ onAddressSelect, className, placeholder }) => {
  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Load Google Maps JavaScript API
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = initializeAutocomplete;
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeAutocomplete();
    }

    return () => {
      // Cleanup if component unmounts
      if (autoCompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry', 'place_id'],
        types: ['address']
      }
    );

    autoCompleteRef.current.addListener('place_changed', handlePlaceSelect);
  };

  const handlePlaceSelect = () => {
    const place = autoCompleteRef.current.getPlace();
    
    if (!place.geometry) {
      console.error('No details available for input:', place);
      return;
    }

    // Parse address components
    const addressComponents = {};
    place.address_components.forEach(component => {
      component.types.forEach(type => {
        addressComponents[type] = component.long_name;
      });
    });

    const addressDetails = {
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
    onAddressSelect(addressDetails);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`w-full p-2 border border-gray-300 rounded-md ${className}`}
        placeholder={placeholder || "Enter an address"}
      />
    </div>
  );
};

export default AddressAutocomplete; 