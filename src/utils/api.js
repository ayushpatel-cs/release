import axios from 'axios';

// Add console log to debug
console.log('ENV API URL:', process.env.REACT_APP_API_URL);

// Check if we have an API URL from env
const apiUrl = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL 
  : 'http://localhost:3001/api';

console.log('Selected API URL:', apiUrl);

const baseURL = apiUrl.startsWith('http') 
  ? apiUrl 
  : `${window.location.protocol}//${apiUrl}`;

// Extract the base backend URL (without /api)
export const backendUrl = baseURL.replace(/\/api$/, '');

console.log('Final baseURL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Handle FormData specifically
  if (config.data instanceof FormData) {
    // Disable transformRequest for FormData
    config.transformRequest = [(data) => data];
    // Remove any content-type header to let the browser set it
    delete config.headers['Content-Type'];
  } else if (typeof config.data === 'object') {
    // For JSON data
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
