import axios from 'axios';

const api = axios.create({
  baseURL: 'https://roxiler-assignment-2-hcf2.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;