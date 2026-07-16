import axios from 'axios';

// Agar variable load nahi hua toh fallback me localhost use karega
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor (agar tum future me JWT tokens/headers bhejna chaho)
API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;