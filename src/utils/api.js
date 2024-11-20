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

console.log('Final baseURL:', baseURL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If the request contains FormData, remove the Content-Type header
  // to let the browser set it automatically with the boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

export default api;
