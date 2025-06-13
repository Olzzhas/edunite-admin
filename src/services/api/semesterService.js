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

        // Add registration dates only if they are provided
        if (semesterData.registration_start_date) {
          apiSemesterData.registration_start_date = semesterData.registration_start_date;
        }
        if (semesterData.registration_end_date) {
          apiSemesterData.registration_end_date = semesterData.registration_end_date;
        }

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
      // Format the data similar to createSemester
      const apiSemesterData = {
        name: semesterData.name,
        start_date: semesterData.start_date,
        end_date: semesterData.end_date
      };

      // Add registration dates only if they are provided
      if (semesterData.registration_start_date) {
        apiSemesterData.registration_start_date = semesterData.registration_start_date;
      }
      if (semesterData.registration_end_date) {
        apiSemesterData.registration_end_date = semesterData.registration_end_date;
      }

      const response = await apiClient.put(`/semester/${id}`, apiSemesterData);
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

  // Check registration status for a semester
  getRegistrationStatus: async (semesterId) => {
    if (MOCK_API) {
      // Mock implementation - assume registration is always open for mock data
      return {
        is_open: true,
        registration_start_date: null,
        registration_end_date: null
      };
    } else {
      try {
        // Use the actual registration-status endpoint
        const response = await apiClient.get(`/semester/${semesterId}/registration-status`);
        console.log(`Registration status for semester ${semesterId}:`, response.data);

        // The backend returns the status directly in the new format
        return {
          is_open: response.data.is_open,
          registration_start_date: response.data.registration_start_date,
          registration_end_date: response.data.registration_end_date
        };
      } catch (error) {
        console.error(`Error fetching registration status for semester ${semesterId}:`, error);

        // Fallback: try to get semester data and calculate client-side
        try {
          const semesterResponse = await apiClient.get(`/semester/${semesterId}`);
          const semester = semesterResponse.data.semester || semesterResponse.data;

          if (!semester) {
            throw new Error('Semester not found');
          }

          // Extract registration dates from semester data
          const registrationStartDate = semester.registration_start_date;
          const registrationEndDate = semester.registration_end_date;

          // If no registration dates are set, registration is always open
          if (!registrationStartDate && !registrationEndDate) {
            return {
              is_open: true,
              registration_start_date: null,
              registration_end_date: null
            };
          }

          // Calculate if registration is currently open
          const now = new Date();
          let isOpen = true;

          if (registrationStartDate) {
            // Handle Firebase timestamp format
            const startDate = registrationStartDate.seconds
              ? new Date(registrationStartDate.seconds * 1000)
              : new Date(registrationStartDate);
            if (now < startDate) {
              isOpen = false; // Registration hasn't started yet
            }
          }

          if (registrationEndDate) {
            // Handle Firebase timestamp format
            const endDate = registrationEndDate.seconds
              ? new Date(registrationEndDate.seconds * 1000)
              : new Date(registrationEndDate);
            if (now > endDate) {
              isOpen = false; // Registration has ended
            }
          }

          return {
            is_open: isOpen,
            registration_start_date: registrationStartDate,
            registration_end_date: registrationEndDate
          };
        } catch (fallbackError) {
          console.error(`Fallback error for semester ${semesterId}:`, fallbackError);

          // If we can't determine the status, assume registration is open to be safe
          return {
            is_open: true,
            registration_start_date: null,
            registration_end_date: null
          };
        }
      }
    }
  },

  // Register student to thread with registration time validation
  registerStudentToThread: async (userId, threadId) => {
    if (MOCK_API) {
      // Mock implementation - always succeed
      return {
        message: "Student registered successfully",
        user_id: userId,
        thread_id: threadId
      };
    } else {
      try {
        // For now, we'll use the existing thread service method
        // The backend validation for registration time frames will be added later
        const response = await apiClient.post(`/thread/${threadId}/students/${userId}`);
        console.log(`Student ${userId} registered to thread ${threadId}:`, response.data);
        return {
          message: "Student registered successfully",
          user_id: userId,
          thread_id: threadId,
          data: response.data
        };
      } catch (error) {
        console.error(`Error registering student ${userId} to thread ${threadId}:`, error);

        // Handle specific registration errors
        if (error.response && error.response.status === 412) {
          throw new Error('Registration is closed for this semester');
        } else if (error.response && error.response.status === 409) {
          throw new Error('Student is already registered for this thread');
        } else if (error.response && error.response.status === 429) {
          throw new Error('Thread is full - maximum number of students reached');
        } else if (error.response && error.response.status === 404) {
          throw new Error('Student or thread not found');
        }

        throw new Error(error.response?.data?.message || error.message || 'Registration failed');
      }
    }
  },

  // Register multiple students to thread
  registerManyStudentsToThread: async (userIds, threadId) => {
    if (MOCK_API) {
      // Mock implementation - always succeed
      return {
        message: "Students registered successfully",
        user_ids: userIds,
        thread_id: threadId,
        successful_registrations: userIds.length,
        failed_registrations: 0
      };
    } else {
      try {
        // Since bulk registration endpoint doesn't exist yet,
        // we'll register students one by one using the existing endpoint
        let successfulRegistrations = 0;
        let failedRegistrations = 0;
        const results = [];

        for (const userId of userIds) {
          try {
            await apiClient.post(`/thread/${threadId}/students/${userId}`);
            successfulRegistrations++;
            results.push({ user_id: userId, status: 'success' });
          } catch (error) {
            failedRegistrations++;
            results.push({
              user_id: userId,
              status: 'failed',
              error: error.response?.data?.message || error.message
            });
          }
        }

        return {
          message: `Registered ${successfulRegistrations} of ${userIds.length} students`,
          user_ids: userIds,
          thread_id: threadId,
          successful_registrations: successfulRegistrations,
          failed_registrations: failedRegistrations,
          results: results
        };
      } catch (error) {
        console.error(`Error in bulk registration for thread ${threadId}:`, error);
        throw new Error('Bulk registration failed');
      }
    }
  },
};

export default semesterService;
