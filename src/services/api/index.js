import apiClient from './apiClient';
import authService from './authService';
import userService from './userService';
import courseService from './courseService';
import semesterService from './semesterService';
import threadService from './threadService';
import assignmentService from './assignmentService';
import storageService from './storageService';
import attendanceService from './attendanceService';

export {
  apiClient,
  authService,
  userService,
  courseService,
  semesterService,
  threadService,
  assignmentService,
  storageService,
  attendanceService,
};

// Export mock data for development
export * from './mockData';
