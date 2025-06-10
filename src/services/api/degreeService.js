import apiClient from './apiClient';

const degreeService = {
  getDegrees: async (page = 1, pageSize = 10, level = '') => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      
      if (level) {
        params.append('level', level);
      }

      const response = await apiClient.get(`/degrees?${params}`);
      console.log('Degrees response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching degrees:', error);
      throw error;
    }
  },

  getDegreeById: async (id) => {
    try {
      const response = await apiClient.get(`/degrees/${id}`);
      console.log(`Degree ${id} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching degree ${id}:`, error);
      throw error;
    }
  },

  createDegree: async (degreeData) => {
    try {
      console.log('Creating degree with data:', degreeData);
      const response = await apiClient.post('/degrees', degreeData);
      console.log('Create degree response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating degree:', error);
      throw error;
    }
  },

  updateDegree: async (id, degreeData) => {
    try {
      console.log(`Updating degree ${id} with data:`, degreeData);
      const response = await apiClient.put(`/degrees/${id}`, degreeData);
      console.log('Update degree response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating degree ${id}:`, error);
      throw error;
    }
  },

  deleteDegree: async (id) => {
    try {
      const response = await apiClient.delete(`/degrees/${id}`);
      console.log(`Delete degree ${id} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting degree ${id}:`, error);
      throw error;
    }
  },
};

export default degreeService;
