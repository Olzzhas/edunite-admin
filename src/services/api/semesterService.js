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
      const response = await apiClient.get('/semester');
      return response.data;
    }
  },

  getSemesterById: async (id) => {
    if (MOCK_API) {
      const semester = MOCK_SEMESTERS.find(s => s.id === parseInt(id));
      if (!semester) throw new Error('Semester not found');
      return semester;
    } else {
      const response = await apiClient.get(`/semester/${id}`);
      return response.data;
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
      const response = await apiClient.post('/semester', semesterData);
      return response.data;
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
      const response = await apiClient.post(`/semester/${semesterId}/breaks`, breakData);
      return response.data;
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
