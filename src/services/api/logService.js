import apiClient from './apiClient';

const logService = {
  /**
   * Get logs with optional filters
   * @param {Object} params - Query parameters
   * @param {string} params.level - Filter by log level (e.g., 'error', 'info')
   * @param {string} params.service - Filter by service name
   * @param {string} params.start_date - Start date in ISO format
   * @param {string} params.end_date - End date in ISO format
   * @param {number} params.limit - Number of logs to return
   * @param {number} params.skip - Number of logs to skip
   * @returns {Promise<Array>} - Array of log objects
   */
  getLogs: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/logs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },

  /**
   * Get a specific log by ID
   * @param {string} id - Log ID
   * @returns {Promise<Object>} - Log object
   */
  getLogById: async (id) => {
    try {
      const response = await apiClient.get(`/api/logs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching log with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Count logs with optional filters
   * @param {Object} params - Query parameters
   * @param {string} params.level - Filter by log level
   * @param {string} params.service - Filter by service name
   * @param {string} params.start_date - Start date in ISO format
   * @param {string} params.end_date - End date in ISO format
   * @returns {Promise<number>} - Count of logs matching the filters
   */
  countLogs: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/logs/count', { params });
      return response.data;
    } catch (error) {
      console.error('Error counting logs:', error);
      throw error;
    }
  },

  /**
   * Get available log levels
   * @returns {Promise<Array<string>>} - Array of log levels
   */
  getLogLevels: async () => {
    try {
      const response = await apiClient.get('/api/logs/levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching log levels:', error);
      throw error;
    }
  },

  /**
   * Get available services
   * @returns {Promise<Array<string>>} - Array of service names
   */
  getLogServices: async () => {
    try {
      const response = await apiClient.get('/api/logs/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching log services:', error);
      throw error;
    }
  }
};

export default logService;
