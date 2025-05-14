import apiClient from './apiClient';

/**
 * Service for user registration
 */
const registerService = {
  /**
   * Register a new user
   * @param {Object} userData - User data for registration
   * @param {string} userData.username - Username (same as email)
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.name - First name
   * @param {string} userData.surname - Last name
   * @param {string} userData.role - User role (admin, moderator, teacher, student)
   * @returns {Promise<Object>} - Registered user data
   */
  registerUser: async (userData) => {
    try {
      console.log('Registering user with data:', {
        ...userData,
        password: '********' // Hide password in logs
      });

      // API call to register endpoint
      const response = await apiClient.post('/auth/register', userData);
      console.log('Registration response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);

      // Check if it's an API error with a response
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Registration failed');
      }

      // Re-throw other errors with a more user-friendly message
      throw new Error('Registration failed. Please check the data and try again.');
    }
  }
};

export default registerService;
