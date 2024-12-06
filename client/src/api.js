import axios from 'axios';

// Base configuration for your API
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust to your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;