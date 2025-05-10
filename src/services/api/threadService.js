import axios from 'axios';
import apiClient from './apiClient';
import { MOCK_USERS } from './mockData';

// Get the API URL from the apiClient
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

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
  getThreads: async (page = 1, size = 10) => {
    if (MOCK_API) {
      // Paginate (adjust for 1-based indexing)
      const start = (page - 1) * size;
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

  createThreadWithSchedule: async (threadData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_THREADS.map(t => t.id)) + 1;

      // Extract schedules from the data
      const { schedules, ...threadDetails } = threadData;

      // Create new thread
      const newThread = {
        id: newId,
        students: [],
        schedule: schedules.map((schedule, index) => ({
          id: index + 1,
          dayOfWeek: schedule.day_of_week === 1 ? 'MONDAY' :
                    schedule.day_of_week === 2 ? 'TUESDAY' :
                    schedule.day_of_week === 3 ? 'WEDNESDAY' :
                    schedule.day_of_week === 4 ? 'THURSDAY' :
                    schedule.day_of_week === 5 ? 'FRIDAY' :
                    schedule.day_of_week === 6 ? 'SATURDAY' : 'SUNDAY',
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          location: schedule.location
        })),
        ...threadDetails,
      };

      // Add to mock data
      MOCK_THREADS.push(newThread);

      return newThread;
    } else {
      try {
        // Create a clean object with exactly the structure needed
        const cleanData = {
          title: String(threadData.title || ''),
          course_id: Number(threadData.course_id),
          semester_id: Number(threadData.semester_id),
          teacher_id: Number(threadData.teacher_id),
          max_students: Number(threadData.max_students || 30),
          schedules: (threadData.schedules || []).map(schedule => ({
            day_of_week: Number(schedule.day_of_week),
            start_time: String(schedule.start_time || ''),
            end_time: String(schedule.end_time || ''),
            location: String(schedule.location || '')
          }))
        };

        // Log the exact data being sent
        console.log('Sending thread data:', JSON.stringify(cleanData, null, 2));

        // Create a hardcoded JSON string that matches exactly what the server expects
        // This is a last resort approach to avoid any potential JSON formatting issues
        const jsonString = `{
  "title": "${cleanData.title.replace(/"/g, '\\"')}",
  "course_id": ${cleanData.course_id},
  "semester_id": ${cleanData.semester_id},
  "teacher_id": ${cleanData.teacher_id},
  "max_students": ${cleanData.max_students},
  "schedules": [
    ${cleanData.schedules.map(s => `{
      "day_of_week": ${s.day_of_week},
      "start_time": "${s.start_time}",
      "end_time": "${s.end_time}",
      "location": "${s.location.replace(/"/g, '\\"')}"
    }`).join(',\n    ')}
  ]
}`;

        console.log('Using hardcoded JSON string:', jsonString);

        // Get the auth token
        const token = localStorage.getItem('accessToken');
        const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

        // Try fetch with the hardcoded JSON string
        const fetchResponse = await fetch(`${API_URL}/thread/with-schedule`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...authHeader
          },
          body: jsonString
        });

        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          throw new Error(`Request failed: ${fetchResponse.status} ${fetchResponse.statusText} - ${errorText}`);
        }

        const data = await fetchResponse.json();
        console.log('Create thread response:', data);
        return data;
      } catch (error) {
        console.error('Error creating thread with schedule:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        }
        throw error;
      }
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
