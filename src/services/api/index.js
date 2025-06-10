import apiClient from './apiClient';
import sportApiClient from './sportApiClient';
import authService from './authService';
import userService from './userService';
import courseService from './courseService';
import semesterService from './semesterService';
import threadService from './threadService';
import assignmentService from './assignmentService';
import storageService from './storageService';
import attendanceService from './attendanceService';
import sportService from './sportService';
import registerService from './registerService';
import locationService from './locationService';
import degreeService from './degreeService';
import transcriptService from './transcriptService';
import studentDegreeService from './studentDegreeService';

export {
  apiClient,
  sportApiClient,
  authService,
  userService,
  courseService,
  semesterService,
  threadService,
  assignmentService,
  storageService,
  attendanceService,
  sportService,
  registerService,
  locationService,
  degreeService,
  transcriptService,
  studentDegreeService,
};

// Export mock data for development
export * from './mockData';
