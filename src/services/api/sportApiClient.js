import axios from 'axios';

// Sport Service API URL
const SPORT_API_URL = 'http://localhost:8081';

// Add a timeout to prevent long waiting times
const TIMEOUT = 10000; // 10 seconds

// Create axios instance for sport service
const sportApiClient = axios.create({
  baseURL: SPORT_API_URL,
  timeout: TIMEOUT,
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

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Sport API request timeout:', error.message);
      return Promise.reject({
        message: 'Request to Sport API server timed out. The server might be overloaded or unreachable.'
      });
    }

    // Handle other HTTP errors
    if (error.response) {
      console.error('Sport API HTTP error:', error.response.status, error.response.data);
      return Promise.reject({
        message: `Sport API server returned an error: ${error.response.status} ${error.response.statusText}`,
        status: error.response.status,
        data: error.response.data
      });
    }

    return Promise.reject(error);
  }
);

export default sportApiClient;
