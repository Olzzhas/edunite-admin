import apiClient from './apiClient';

// Authentication service for the admin panel

const authService = {
  login: async (email, password) => {
    try {
      console.log('Logging in with credentials:', { username: email, password: '********' });

      // Format credentials for the API
      const loginData = {
        username: email,
        password: password
      };

      // API call
      const response = await apiClient.post('/auth/login', loginData);
      console.log('Login response:', response.data);

      // Check if we have the expected data
      if (!response.data || !response.data.access_token || !response.data.user) {
        // Clear any existing tokens to ensure we're not in a half-authenticated state
        authService.logout();
        throw new Error('Invalid response from server');
      }

      const { access_token, refresh_token, user } = response.data;

      // Check if user has admin or moderator role
      if (user.role !== 'admin' && user.role !== 'moderator') {
        // Don't store tokens for non-admin users
        console.warn('User does not have admin or moderator role:', user.role);
        throw new Error('Access denied: Admin or moderator role required');
      }

      // Store tokens and user data only if everything is valid
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (error) {
      // Log the error for debugging
      console.error('Login error:', error);

      // Check if it's an API error with a response
      if (error.response && error.response.data) {
        // Use the error message from the API if available
        throw new Error(error.response.data.error || 'Invalid credentials');
      }

      // Re-throw other errors with a more user-friendly message
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Refreshing token...');

      const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
      console.log('Refresh token response:', response.data);

      const { access_token, refresh_token } = response.data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, log out the user
      authService.logout();
      throw error;
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.role === role;
  },

  // Check if user has admin or moderator role
  hasAdminAccess: () => {
    const user = authService.getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'moderator');
  },
};

export default authService;
