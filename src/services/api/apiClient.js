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

// Request interceptor for adding auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for handling token refresh and connection errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Handle connection errors (no response from server)
//     if (!error.response) {
//       console.error('API server connection error:', error.message);
//       // Fall back to mock data if API server is not available
//       return Promise.reject({
//         message: 'Unable to connect to API server. Please check if the server is running.',
//         isConnectionError: true
//       });
//     }

//     const originalRequest = error.config;

//     // If error is 401 and we haven't tried to refresh the token yet
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Try to refresh the token
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (!refreshToken) {
//           // No refresh token, redirect to login
//           window.location.href = '/login';
//           return Promise.reject(error);
//         }

//         const response = await axios.post(`${API_URL}/auth/refresh`, {
//           refreshToken,
//         });

//         // Save the new tokens
//         const { accessToken, refreshToken: newRefreshToken } = response.data;
//         localStorage.setItem('accessToken', accessToken);
//         localStorage.setItem('refreshToken', newRefreshToken);

//         // Update the original request with the new token
//         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

//         // Retry the original request
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, redirect to login
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     // Handle 404 errors for API endpoints
//     if (error.response.status === 404) {
//       console.error('API endpoint not found:', originalRequest.url);
//     }

//     return Promise.reject(error);
//   }
// );

export default apiClient;
