import axios from 'axios';

// Base API URL - using the real API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global error handler for navigation
let errorHandler = null;

// Set the error handler
export const setErrorHandler = (handler) => {
  errorHandler = handler;
};

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
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

// Response interceptor for handling token refresh and connection errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle connection errors (no response from server)
    if (!error.response) {
      console.error('API server connection error:', error.message);
      return Promise.reject({
        message: 'Unable to connect to API server. Please check if the server is running.'
      });
    }

    // Handle JSON parsing errors
    if (error.response && error.response.data && error.response.data.error === 'failed to parse JSON request') {
      console.error('JSON parsing error:', error.response.data);
      return Promise.reject({
        message: 'Invalid JSON format. Please check your request data.',
        response: error.response
      });
    }

    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        // Save the new tokens
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);

        // Update the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 404 errors for API endpoints
    if (error.response.status === 404) {
      console.error('API endpoint not found:', originalRequest.url);

      // Don't use global error handler for transcript-related 404s
      // These should be handled by the component/service level
      if (originalRequest.url && originalRequest.url.includes('/transcripts/user/')) {
        return Promise.reject(error);
      }
    }

    // Use the global error handler if available
    if (errorHandler) {
      errorHandler(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
