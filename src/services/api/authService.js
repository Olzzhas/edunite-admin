import apiClient from './apiClient';

// Use mock authentication
const MOCK_AUTH = true;
const MOCK_ADMIN_USER = {
  id: 1,
  keycloakID: 'admin-123',
  name: 'Admin',
  surname: 'User',
  email: 'admin@edunite.com',
  role: 'admin',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  version: 1,
};

const MOCK_TOKENS = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

const authService = {
  login: async (email, password) => {
    if (MOCK_AUTH) {
      // Mock login for development
      if (email === 'admin@edunite.com' && password === 'admin') {
        localStorage.setItem('accessToken', MOCK_TOKENS.accessToken);
        localStorage.setItem('refreshToken', MOCK_TOKENS.refreshToken);
        localStorage.setItem('user', JSON.stringify(MOCK_ADMIN_USER));
        return { user: MOCK_ADMIN_USER, ...MOCK_TOKENS };
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      try {
        // Real API call
        const response = await apiClient.post('/auth/login', { email, password });
        const { user, accessToken, refreshToken } = response.data;

        // Store tokens and user data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
      } catch (error) {
        // If there's a connection error, fall back to mock auth
        if (error.isConnectionError) {
          console.warn('API connection error, falling back to mock authentication');

          // Use mock authentication as fallback
          if (email === 'admin@edunite.com' && password === 'admin') {
            localStorage.setItem('accessToken', MOCK_TOKENS.accessToken);
            localStorage.setItem('refreshToken', MOCK_TOKENS.refreshToken);
            localStorage.setItem('user', JSON.stringify(MOCK_ADMIN_USER));
            return { user: MOCK_ADMIN_USER, ...MOCK_TOKENS };
          } else {
            throw new Error('Invalid credentials');
          }
        }

        // Re-throw other errors
        throw error;
      }
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  refreshToken: async () => {
    if (MOCK_AUTH) {
      // Mock token refresh
      return MOCK_TOKENS;
    } else {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post('/auth/refresh', { refreshToken });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      return response.data;
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
};

export default authService;
