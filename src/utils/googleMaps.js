import { Loader } from '@googlemaps/js-api-loader';

export const googleMapsLoader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry'],
  authReferrerPolicy: 'origin',
}); 