import apiClient from './apiClient';

// Mock data for development
const MOCK_SEMESTERS = [
  {
    id: 1,
    name: 'Spring 2023',
    startDate: '2023-01-15T00:00:00Z',
    endDate: '2023-05-15T00:00:00Z',
    breaks: [
      {
        id: 1,
        name: 'Spring Break',
        startDate: '2023-03-10T00:00:00Z',
        endDate: '2023-03-20T00:00:00Z',
      }
    ],
  },
  {
    id: 2,
    name: 'Fall 2023',
    startDate: '2023-08-15T00:00:00Z',
    endDate: '2023-12-15T00:00:00Z',
    breaks: [
      {
        id: 2,
        name: 'Thanksgiving Break',
        startDate: '2023-11-22T00:00:00Z',
        endDate: '2023-11-26T00:00:00Z',
      }
    ],
  },
  {
    id: 3,
    name: 'Spring 2024',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-05-15T00:00:00Z',
    breaks: [
      {
        id: 3,
        name: 'Spring Break',
        startDate: '2024-03-10T00:00:00Z',
        endDate: '2024-03-20T00:00:00Z',
      }
    ],
  },
];

// Use real API data
const MOCK_API = false;

const semesterService = {
  getSemesters: async () => {
    if (MOCK_API) {
      return MOCK_SEMESTERS;
    } else {
      try {
        // Use the new endpoint that includes breaks
        const response = await apiClient.get('/semester/with-breaks');

        // Log the raw API response for debugging
        console.log('Raw API response for semesters with breaks:', response.data);

        // Check if the response has the expected format with a semesters array
        if (response.data && response.data.semesters) {
          // Process the semesters to ensure breaks are properly formatted
          const processedSemesters = response.data.semesters.map(semester => {
            // Process breaks if they exist
            if (semester.breaks && Array.isArray(semester.breaks)) {
              // Format each break to ensure consistent data structure
              semester.breaks = semester.breaks.map(breakItem => {
                return {
                  ...breakItem,
                  // Ensure break_date is accessible for UI display
                  break_date: breakItem.break_date || null
                };
              });
            } else {
              semester.breaks = [];
            }

            return semester;
          });

          return processedSemesters;
        }

        // If the response doesn't have a semesters array, return the data as is
        return response.data;
      } catch (error) {
        console.error('Error fetching semesters:', error);
        throw error;
      }
    }
  },

  getSemesterById: async (id) => {
    if (MOCK_API) {
      const semester = MOCK_SEMESTERS.find(s => s.id === parseInt(id));
      if (!semester) throw new Error('Semester not found');
      return semester;
    } else {
      try {
        const response = await apiClient.get(`/semester/${id}`);

        // Log the raw API response for debugging
        console.log(`Raw API response for semester ${id}:`, response.data);

        // Check if the response has the expected format
        if (response.data && response.data.semester) {
          return response.data.semester;
        }

        // If the response doesn't have a semester object, return the data as is
        return response.data;
      } catch (error) {
        console.error(`Error fetching semester ${id}:`, error);
        throw error;
      }
    }
  },

  createSemester: async (semesterData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_SEMESTERS.map(s => s.id)) + 1;

      // Create new semester
      const newSemester = {
        id: newId,
        breaks: [],
        ...semesterData,
      };

      // Add to mock data
      MOCK_SEMESTERS.push(newSemester);

      return newSemester;
    } else {
      try {
        console.log('Creating semester with data:', semesterData);

        // Ensure the data is in the correct format for the API
        const apiSemesterData = {
          name: semesterData.name,
          start_date: semesterData.start_date,
          end_date: semesterData.end_date
        };

        console.log('Formatted semester data for API:', apiSemesterData);

        const response = await apiClient.post('/semester', apiSemesterData);

        // Log the raw API response for debugging
        console.log('Raw API response for creating semester:', response.data);

        // Return a standardized semester object for the UI
        const standardizedSemester = {
          id: response.data.id,
          name: apiSemesterData.name,
          start_date: {
            seconds: Math.floor(new Date(apiSemesterData.start_date).getTime() / 1000)
          },
          end_date: {
            seconds: Math.floor(new Date(apiSemesterData.end_date).getTime() / 1000)
          },
          breaks: []
        };

        return standardizedSemester;
      } catch (error) {
        console.error('Error creating semester:', error);
        throw error;
      }
    }
  },

  updateSemester: async (id, semesterData) => {
    if (MOCK_API) {
      const index = MOCK_SEMESTERS.findIndex(s => s.id === parseInt(id));
      if (index === -1) throw new Error('Semester not found');

      // Update semester
      const updatedSemester = {
        ...MOCK_SEMESTERS[index],
        ...semesterData,
      };

      // Replace in mock data
      MOCK_SEMESTERS[index] = updatedSemester;

      return updatedSemester;
    } else {
      const response = await apiClient.put(`/semester/${id}`, semesterData);
      return response.data;
    }
  },

  deleteSemester: async (id) => {
    if (MOCK_API) {
      const index = MOCK_SEMESTERS.findIndex(s => s.id === parseInt(id));
      if (index === -1) throw new Error('Semester not found');

      // Remove from mock data
      MOCK_SEMESTERS.splice(index, 1);

      return { success: true };
    } else {
      const response = await apiClient.delete(`/semester/${id}`);
      return response.data;
    }
  },

  addBreak: async (semesterId, breakData) => {
    if (MOCK_API) {
      const semesterIndex = MOCK_SEMESTERS.findIndex(s => s.id === parseInt(semesterId));
      if (semesterIndex === -1) throw new Error('Semester not found');

      // Generate a new ID for the break
      const breakIds = MOCK_SEMESTERS.flatMap(s => s.breaks.map(b => b.id));
      const newBreakId = breakIds.length > 0 ? Math.max(...breakIds) + 1 : 1;

      // Create new break
      const newBreak = {
        id: newBreakId,
        ...breakData,
      };

      // Add to semester
      MOCK_SEMESTERS[semesterIndex].breaks.push(newBreak);

      return newBreak;
    } else {
      try {
        console.log(`Adding break to semester ${semesterId}:`, breakData);

        // Format the request payload according to the API requirements
        const apiBreakData = {
          break_date: breakData.breakDate || breakData.break_date,
          description: breakData.description
        };

        console.log(`Formatted break data for API:`, apiBreakData);

        // Use the correct endpoint format
        const response = await apiClient.post(`/semester/breaks/${semesterId}`, apiBreakData);

        // Log the raw API response for debugging
        console.log(`Raw API response for adding break to semester ${semesterId}:`, response.data);

        // Return a standardized break object for the UI
        const standardizedBreak = {
          id: response.data.id || Date.now(), // Use the ID from response or generate one
          name: apiBreakData.description,
          start_date: apiBreakData.break_date,
          end_date: apiBreakData.break_date, // Since we only have one date, use it for both
          description: apiBreakData.description,
          break_date: apiBreakData.break_date
        };

        return standardizedBreak;
      } catch (error) {
        console.error(`Error adding break to semester ${semesterId}:`, error);
        throw error;
      }
    }
  },

  updateBreak: async (semesterId, breakId, breakData) => {
    if (MOCK_API) {
      const semesterIndex = MOCK_SEMESTERS.findIndex(s => s.id === parseInt(semesterId));
      if (semesterIndex === -1) throw new Error('Semester not found');

      const breakIndex = MOCK_SEMESTERS[semesterIndex].breaks.findIndex(b => b.id === parseInt(breakId));
      if (breakIndex === -1) throw new Error('Break not found');

      // Update break
      const updatedBreak = {
        ...MOCK_SEMESTERS[semesterIndex].breaks[breakIndex],
        ...breakData,
      };

      // Replace in mock data
      MOCK_SEMESTERS[semesterIndex].breaks[breakIndex] = updatedBreak;

      return updatedBreak;
    } else {
      const response = await apiClient.put(`/semester/${semesterId}/breaks/${breakId}`, breakData);
      return response.data;
    }
  },

  deleteBreak: async (semesterId, breakId) => {
    if (MOCK_API) {
      const semesterIndex = MOCK_SEMESTERS.findIndex(s => s.id === parseInt(semesterId));
      if (semesterIndex === -1) throw new Error('Semester not found');

      const breakIndex = MOCK_SEMESTERS[semesterIndex].breaks.findIndex(b => b.id === parseInt(breakId));
      if (breakIndex === -1) throw new Error('Break not found');

      // Remove from mock data
      MOCK_SEMESTERS[semesterIndex].breaks.splice(breakIndex, 1);

      return { success: true };
    } else {
      const response = await apiClient.delete(`/semester/${semesterId}/breaks/${breakId}`);
      return response.data;
    }
  },
};

export default semesterService;
