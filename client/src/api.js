import axios from 'axios';

// Base configuration for your API
const api = axios.create({
  baseURL: 'https://roxiler-assignment-2-hcf2.onrender.com/api', // Adjust to your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;