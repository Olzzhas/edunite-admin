import apiClient from './apiClient';

const studentDegreeService = {
  createStudentDegree: async (studentDegreeData) => {
    try {
      console.log('Creating student degree with data:', studentDegreeData);
      const response = await apiClient.post('/student-degrees', studentDegreeData);
      console.log('Create student degree response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating student degree:', error);
      throw error;
    }
  },

  getStudentDegrees: async (userId) => {
    try {
      const response = await apiClient.get(`/student-degrees/user/${userId}`);
      console.log(`Student ${userId} degrees response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching degrees for user ${userId}:`, error);
      throw error;
    }
  },

  getAllStudentDegrees: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      // Add filters if provided
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await apiClient.get(`/student-degrees?${params}`);
      console.log('All student degrees response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all student degrees:', error);
      throw error;
    }
  },

  updateStudentDegreeStatus: async (studentDegreeId, statusData) => {
    try {
      console.log(`Updating student degree ${studentDegreeId} status with data:`, statusData);
      const response = await apiClient.put(`/student-degrees/${studentDegreeId}/status`, statusData);
      console.log('Update student degree status response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating student degree ${studentDegreeId} status:`, error);
      throw error;
    }
  },

  updateStudentDegree: async (studentDegreeId, studentDegreeData) => {
    try {
      console.log(`Updating student degree ${studentDegreeId} with data:`, studentDegreeData);
      const response = await apiClient.put(`/student-degrees/${studentDegreeId}`, studentDegreeData);
      console.log('Update student degree response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating student degree ${studentDegreeId}:`, error);
      throw error;
    }
  },

  deleteStudentDegree: async (studentDegreeId) => {
    try {
      const response = await apiClient.delete(`/student-degrees/${studentDegreeId}`);
      console.log(`Delete student degree ${studentDegreeId} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting student degree ${studentDegreeId}:`, error);
      throw error;
    }
  },

  getStudentDegreeById: async (studentDegreeId) => {
    try {
      const response = await apiClient.get(`/student-degrees/${studentDegreeId}`);
      console.log(`Student degree ${studentDegreeId} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student degree ${studentDegreeId}:`, error);
      throw error;
    }
  },
};

export default studentDegreeService;
