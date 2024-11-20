import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const baseURL = apiUrl.startsWith('http') ? apiUrl : `${window.location.protocol}//${apiUrl}`;
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
  return config;
});

export default api;