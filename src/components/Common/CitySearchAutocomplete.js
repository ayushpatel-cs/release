import React, { useEffect, useRef, useState } from 'react';
import { googleMapsLoader } from '../../utils/googleMaps';

const CitySearchAutocomplete = ({
  onLocationSelect,
  placeholder,
  initialValue = '',
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    googleMapsLoader
      .load()
      .then(() => {
        const google = window.google;
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['(cities)'],
            componentRestrictions: { country: 'us' },
          }
        );

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();

          if (place && place.geometry) {
            const locationData = {
              address: place.formatted_address,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              placeId: place.place_id,
              viewport: place.geometry.viewport,
            };

            setValue(place.formatted_address);
            onLocationSelect(locationData);
          } else {
            // Clear the input and notify parent component
            setValue('');
            onLocationSelect(null);
            console.warn('No details available for the selected location.');
          }
        });

        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
        setError('Failed to load location search');
        setIsLoading(false);
      });

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [onLocationSelect]);

  // Handle form submission to prevent errors when pressing Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission

      const google = window.google;
      if (autocompleteRef.current && google) {
        const place = autocompleteRef.current.getPlace();

        if (place && place.geometry) {
          // Valid place selected
          const locationData = {
            address: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            placeId: place.place_id,
            viewport: place.geometry.viewport,
          };

          setValue(place.formatted_address);
          onLocationSelect(locationData);
        } else {
          // Invalid input
          setValue('');
          onLocationSelect(null);
          console.warn('Please select a valid city from the suggestions.');
        }
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 text-sm text-center"
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default CitySearchAutocomplete;
