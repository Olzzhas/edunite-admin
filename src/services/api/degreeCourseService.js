import apiClient from './apiClient';

const degreeCourseService = {
  // Добавить курс к программе
  addCourseToDegreе: async (degreeCourseData) => {
    try {
      console.log('Adding course to degree with data:', degreeCourseData);
      const response = await apiClient.post('/degree-courses', degreeCourseData);
      console.log('Add course to degree response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding course to degree:', error);
      throw error;
    }
  },

  // Получить курсы программы
  getDegreeCoursеs: async (degreeId) => {
    try {
      console.log(`Fetching courses for degree ${degreeId}`);
      const response = await apiClient.get(`/degree-courses/degree/${degreeId}/courses`);
      console.log(`Degree ${degreeId} courses response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for degree ${degreeId}:`, error);
      throw error;
    }
  },

  // Удалить курс из программы
  removeCourseFromDegree: async (degreeId, courseId) => {
    try {
      console.log(`Removing course ${courseId} from degree ${degreeId}`);
      const response = await apiClient.delete(`/degree-courses/degree/${degreeId}/course/${courseId}`);
      console.log('Remove course from degree response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error removing course ${courseId} from degree ${degreeId}:`, error);
      throw error;
    }
  },

  // Получить доступные курсы для студента
  getStudentAvailableCourses: async (userId) => {
    try {
      console.log(`Fetching available courses for student ${userId}`);
      const response = await apiClient.get(`/students/${userId}/available-courses`);
      console.log(`Student ${userId} available courses response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching available courses for student ${userId}:`, error);
      throw error;
    }
  },
};

export default degreeCourseService;
