import axios from 'axios';

// Sport Service API URL
const SPORT_API_URL = 'http://localhost:8080';

// Create axios instance for sport service
const sportApiClient = axios.create({
  baseURL: SPORT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
sportApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling connection errors
sportApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle connection errors (no response from server)
    if (!error.response) {
      console.error('Sport API server connection error:', error.message);
      return Promise.reject({
        message: 'Unable to connect to Sport API server. Please check if the server is running.'
      });
    }

    return Promise.reject(error);
  }
);

export default sportApiClient;
