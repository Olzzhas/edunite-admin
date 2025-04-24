import apiClient from './apiClient';
import { MOCK_USERS } from './mockData';

// Mock data for development
const MOCK_THREADS = [
  {
    id: 1,
    courseId: 1,
    semesterId: 1,
    teacher: MOCK_USERS.find(u => u.role === 'teacher'),
    students: MOCK_USERS.filter(u => u.role === 'student').slice(0, 5),
    schedule: [
      {
        id: 1,
        dayOfWeek: 'MONDAY',
        startTime: '09:00:00',
        endTime: '10:30:00',
        location: 'Room 101',
      },
      {
        id: 2,
        dayOfWeek: 'WEDNESDAY',
        startTime: '09:00:00',
        endTime: '10:30:00',
        location: 'Room 101',
      },
    ],
  },
  {
    id: 2,
    courseId: 2,
    semesterId: 1,
    teacher: MOCK_USERS.find(u => u.role === 'teacher'),
    students: MOCK_USERS.filter(u => u.role === 'student').slice(0, 3),
    schedule: [
      {
        id: 3,
        dayOfWeek: 'TUESDAY',
        startTime: '13:00:00',
        endTime: '14:30:00',
        location: 'Room 202',
      },
      {
        id: 4,
        dayOfWeek: 'THURSDAY',
        startTime: '13:00:00',
        endTime: '14:30:00',
        location: 'Room 202',
      },
    ],
  },
];

// Use real API data
const MOCK_API = false;

const threadService = {
  getThreads: async (page = 0, size = 10) => {
    if (MOCK_API) {
      // Paginate
      const start = page * size;
      const end = start + size;
      const paginatedThreads = MOCK_THREADS.slice(start, end);

      return {
        content: paginatedThreads,
        totalElements: MOCK_THREADS.length,
        totalPages: Math.ceil(MOCK_THREADS.length / size),
        size,
        number: page,
      };
    } else {
      try {
        const response = await apiClient.get('/thread', { params: { page, size } });

        // Log the raw API response for debugging
        console.log('Raw API response for threads:', response.data);

        // Format the response to match the expected structure
        // The API returns an array of threads directly
        const threads = response.data;

        return {
          content: threads,
          totalElements: threads.length,
          totalPages: Math.ceil(threads.length / size),
          size,
          number: page,
        };
      } catch (error) {
        console.error('Error fetching threads:', error);
        throw error;
      }
    }
  },

  getThreadById: async (id) => {
    if (MOCK_API) {
      const thread = MOCK_THREADS.find(t => t.id === parseInt(id));
      if (!thread) throw new Error('Thread not found');
      return thread;
    } else {
      const response = await apiClient.get(`/thread/${id}`);
      return response.data;
    }
  },

  getThreadsByCourse: async (courseId) => {
    if (MOCK_API) {
      const threads = MOCK_THREADS.filter(t => t.courseId === parseInt(courseId));
      return threads;
    } else {
      const response = await apiClient.get(`/thread/course/${courseId}`);
      return response.data;
    }
  },

  createThread: async (threadData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_THREADS.map(t => t.id)) + 1;

      // Create new thread
      const newThread = {
        id: newId,
        students: [],
        schedule: [],
        ...threadData,
      };

      // Add to mock data
      MOCK_THREADS.push(newThread);

      return newThread;
    } else {
      const response = await apiClient.post('/thread', threadData);
      return response.data;
    }
  },

  updateThread: async (id, threadData) => {
    if (MOCK_API) {
      const threadIndex = MOCK_THREADS.findIndex((t) => t.id === parseInt(id));
      if (threadIndex === -1) throw new Error('Thread not found');

      // Update thread
      MOCK_THREADS[threadIndex] = {
        ...MOCK_THREADS[threadIndex],
        ...threadData,
        updatedAt: new Date().toISOString(),
      };

      return MOCK_THREADS[threadIndex];
    } else {
      try {
        console.log(`Updating thread ${id} with data:`, threadData);

        // Create FormData object for the API request
        const formData = new FormData();

        // Ensure all required fields are included
        formData.append('title', threadData.title || '');
        formData.append('description', threadData.description || ''); // Description is required according to the error
        formData.append('course_id', threadData.course_id || '');
        formData.append('semester_id', threadData.semester_id || '');
        formData.append('teacher_id', threadData.teacher_id || '');
        formData.append('max_students', threadData.max_students || '0');

        // Log the form data for debugging
        console.log('Form data for thread update:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        // Make the API request
        const response = await apiClient.put(`/thread/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Log the response for debugging
        console.log(`Update thread ${id} response:`, response.data);

        return response.data;
      } catch (error) {
        console.error(`Error updating thread ${id}:`, error);
        throw error;
      }
    }
  },

  deleteThread: async (id) => {
    if (MOCK_API) {
      const index = MOCK_THREADS.findIndex(t => t.id === parseInt(id));
      if (index === -1) throw new Error('Thread not found');

      // Remove from mock data
      MOCK_THREADS.splice(index, 1);

      return { success: true };
    } else {
      const response = await apiClient.delete(`/thread/${id}`);
      return response.data;
    }
  },

  addStudentToThread: async (threadId, studentId) => {
    if (MOCK_API) {
      const threadIndex = MOCK_THREADS.findIndex(t => t.id === parseInt(threadId));
      if (threadIndex === -1) throw new Error('Thread not found');

      const student = MOCK_USERS.find(u => u.id === parseInt(studentId) && u.role === 'student');
      if (!student) throw new Error('Student not found');

      // Check if student is already in the thread
      const isStudentInThread = MOCK_THREADS[threadIndex].students.some(s => s.id === student.id);
      if (isStudentInThread) throw new Error('Student already in thread');

      // Add student to thread
      MOCK_THREADS[threadIndex].students.push(student);

      return MOCK_THREADS[threadIndex];
    } else {
      const response = await apiClient.post(`/thread/${threadId}/students/${studentId}`);
      return response.data;
    }
  },

  removeStudentFromThread: async (threadId, studentId) => {
    if (MOCK_API) {
      const threadIndex = MOCK_THREADS.findIndex(t => t.id === parseInt(threadId));
      if (threadIndex === -1) throw new Error('Thread not found');

      // Remove student from thread
      MOCK_THREADS[threadIndex].students = MOCK_THREADS[threadIndex].students.filter(
        s => s.id !== parseInt(studentId)
      );

      return MOCK_THREADS[threadIndex];
    } else {
      const response = await apiClient.delete(`/thread/${threadId}/students/${studentId}`);
      return response.data;
    }
  },

  addScheduleToThread: async (threadId, scheduleData) => {
    if (MOCK_API) {
      const threadIndex = MOCK_THREADS.findIndex(t => t.id === parseInt(threadId));
      if (threadIndex === -1) throw new Error('Thread not found');

      // Generate a new ID for the schedule
      const scheduleIds = MOCK_THREADS.flatMap(t => t.schedule.map(s => s.id));
      const newScheduleId = scheduleIds.length > 0 ? Math.max(...scheduleIds) + 1 : 1;

      // Create new schedule
      const newSchedule = {
        id: newScheduleId,
        ...scheduleData,
      };

      // Add to thread
      MOCK_THREADS[threadIndex].schedule.push(newSchedule);

      return newSchedule;
    } else {
      const response = await apiClient.post(`/thread/${threadId}/schedule`, scheduleData);
      return response.data;
    }
  },

  removeScheduleFromThread: async (threadId, scheduleId) => {
    if (MOCK_API) {
      const threadIndex = MOCK_THREADS.findIndex(t => t.id === parseInt(threadId));
      if (threadIndex === -1) throw new Error('Thread not found');

      // Remove schedule from thread
      MOCK_THREADS[threadIndex].schedule = MOCK_THREADS[threadIndex].schedule.filter(
        s => s.id !== parseInt(scheduleId)
      );

      return MOCK_THREADS[threadIndex];
    } else {
      const response = await apiClient.delete(`/thread/${threadId}/schedule/${scheduleId}`);
      return response.data;
    }
  },
};

export default threadService;
