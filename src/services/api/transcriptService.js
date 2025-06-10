import apiClient from './apiClient';

const transcriptService = {
  createTranscript: async (transcriptData) => {
    try {
      console.log('Creating transcript with data:', transcriptData);
      const response = await apiClient.post('/transcripts', transcriptData);
      console.log('Create transcript response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating transcript:', error);
      throw error;
    }
  },

  getStudentTranscript: async (userId, degreeId) => {
    try {
      const params = degreeId ? `?degree_id=${degreeId}` : '';
      const response = await apiClient.get(`/transcripts/user/${userId}${params}`);
      console.log(`Student ${userId} transcript response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transcript for user ${userId}:`, error);
      throw error;
    }
  },

  addTranscriptEntry: async (entryData) => {
    try {
      console.log('Adding transcript entry with data:', entryData);
      const response = await apiClient.post('/transcripts/entries', entryData);
      console.log('Add transcript entry response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding transcript entry:', error);
      throw error;
    }
  },

  getTranscriptEntries: async (transcriptId, semesterId = '') => {
    try {
      const params = semesterId ? `?semester_id=${semesterId}` : '';
      const response = await apiClient.get(`/transcripts/${transcriptId}/entries${params}`);
      console.log(`Transcript ${transcriptId} entries response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching entries for transcript ${transcriptId}:`, error);
      throw error;
    }
  },

  updateGPA: async (transcriptId) => {
    try {
      const response = await apiClient.put(`/transcripts/${transcriptId}/gpa`);
      console.log(`Update GPA for transcript ${transcriptId} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating GPA for transcript ${transcriptId}:`, error);
      throw error;
    }
  },

  generateTranscriptReport: async (userId, degreeId, options = {}) => {
    try {
      const params = new URLSearchParams({
        degree_id: degreeId.toString(),
        include_transfer_credits: (options.includeTransferCredits || false).toString(),
        include_repeated_courses: (options.includeRepeatedCourses || false).toString(),
      });

      const response = await apiClient.get(`/transcripts/user/${userId}/report?${params}`);
      console.log(`Transcript report for user ${userId} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error generating transcript report for user ${userId}:`, error);
      throw error;
    }
  },

  updateTranscriptEntry: async (entryId, entryData) => {
    try {
      console.log(`Updating transcript entry ${entryId} with data:`, entryData);
      const response = await apiClient.put(`/transcripts/entries/${entryId}`, entryData);
      console.log('Update transcript entry response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating transcript entry ${entryId}:`, error);
      throw error;
    }
  },

  deleteTranscriptEntry: async (entryId) => {
    try {
      const response = await apiClient.delete(`/transcripts/entries/${entryId}`);
      console.log(`Delete transcript entry ${entryId} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting transcript entry ${entryId}:`, error);
      throw error;
    }
  },
};

export default transcriptService;
