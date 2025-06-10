import apiClient from './apiClient';

// Mock data for development
const MOCK_COURSES = [
  {
    id: 1,
    title: 'Introduction to Computer Science',
    description: 'A beginner-friendly introduction to computer science concepts.',
    bannerImageUrl: 'https://via.placeholder.com/800x200?text=Computer+Science',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'Advanced Mathematics',
    description: 'Explore advanced mathematical concepts and their applications.',
    bannerImageUrl: 'https://via.placeholder.com/800x200?text=Mathematics',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
    bannerImageUrl: 'https://via.placeholder.com/800x200?text=Web+Development',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
];

// Use real API data
const MOCK_API = false;

const courseService = {
  getCourses: async (page = 0, size = 10) => {
    if (MOCK_API) {
      // Paginate
      const start = page * size;
      const end = start + size;
      const paginatedCourses = MOCK_COURSES.slice(start, end);

      return {
        content: paginatedCourses,
        totalElements: MOCK_COURSES.length,
        totalPages: Math.ceil(MOCK_COURSES.length / size),
        size,
        number: page,
      };
    } else {
      try {
        // Build query params
        const params = {
          page: page,
          page_size: size,
          sort: '-created_at'  // Default sort by created_at descending
        };

        console.log('API request params for courses:', params);

        const response = await apiClient.get('/course', { params });

        // Log the raw API response for debugging
        console.log('Raw API response for courses:', response.data);

        // Check if the response has the expected format
        if (response.data && response.data.courses) {
          // Transform the API response to match our expected format
          return {
            content: response.data.courses,
            totalElements: response.data.courses.length,
            totalPages: Math.ceil(response.data.courses.length / size),
            size: size,
            number: page,
          };
        }

        return response.data;
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
    }
  },

  getCourseById: async (id) => {
    if (MOCK_API) {
      const course = MOCK_COURSES.find(c => c.id === parseInt(id));
      if (!course) throw new Error('Course not found');
      return course;
    } else {
      const response = await apiClient.get(`/course/${id}`);
      return response.data;
    }
  },

  createCourse: async (courseData) => {
    if (MOCK_API) {
      // Generate a new ID
      const newId = Math.max(...MOCK_COURSES.map(c => c.id)) + 1;

      // Create new course
      const newCourse = {
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...courseData,
      };

      // Add to mock data
      MOCK_COURSES.push(newCourse);

      return newCourse;
    } else {
      // If courseData is FormData, it's coming from the modal with image
      if (courseData instanceof FormData) {
        const response = await apiClient.post('/course/with-image', courseData);
        return response.data;
      } else {
        // Regular course creation without image
        const response = await apiClient.post('/course', courseData);
        return response.data;
      }
    }
  },

  updateCourse: async (id, courseData) => {
    if (MOCK_API) {
      const index = MOCK_COURSES.findIndex(c => c.id === parseInt(id));
      if (index === -1) throw new Error('Course not found');

      // Update course
      const updatedCourse = {
        ...MOCK_COURSES[index],
        ...courseData,
        updatedAt: new Date().toISOString(),
      };

      // Replace in mock data
      MOCK_COURSES[index] = updatedCourse;

      return updatedCourse;
    } else {
      const response = await apiClient.put(`/course/${id}`, courseData);
      return response.data;
    }
  },

  deleteCourse: async (id) => {
    if (MOCK_API) {
      const index = MOCK_COURSES.findIndex(c => c.id === parseInt(id));
      if (index === -1) throw new Error('Course not found');

      // Remove from mock data
      MOCK_COURSES.splice(index, 1);

      return { success: true };
    } else {
      const response = await apiClient.delete(`/course/${id}`);
      return response.data;
    }
  },

  uploadBanner: async (id, file) => {
    if (MOCK_API) {
      // In mock mode, we'll just return a placeholder URL
      const placeholderUrl = `https://via.placeholder.com/800x200?text=Course+${id}+Banner`;

      // Update the course banner
      const index = MOCK_COURSES.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        MOCK_COURSES[index].bannerImageUrl = placeholderUrl;
      }

      return { url: placeholderUrl };
    } else {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(`/course/${id}/banner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    }
  },
};

export default courseService;
