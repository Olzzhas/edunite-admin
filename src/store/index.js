import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';
import semesterReducer from './slices/semesterSlice';
import threadReducer from './slices/threadSlice';
import assignmentReducer from './slices/assignmentSlice';
import storageReducer from './slices/storageSlice';
import attendanceReducer from './slices/attendanceSlice';
import logReducer from './slices/logSlice';
import sportTypeReducer from './slices/sportTypeSlice';
import facilityReducer from './slices/facilitySlice';
import physicalEducationReducer from './slices/physicalEducationSlice';
import scheduleReducer from './slices/scheduleSlice';
import locationReducer from './slices/locationSlice';
import degreeReducer from './slices/degreeSlice';
import transcriptReducer from './slices/transcriptSlice';
import studentDegreeReducer from './slices/studentDegreeSlice';
import degreeCourseReducer from './slices/degreeCourseSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    courses: courseReducer,
    semesters: semesterReducer,
    threads: threadReducer,
    assignments: assignmentReducer,
    storage: storageReducer,
    attendance: attendanceReducer,
    logs: logReducer,
    sportTypes: sportTypeReducer,
    facilities: facilityReducer,
    physicalEducation: physicalEducationReducer,
    schedules: scheduleReducer,
    locations: locationReducer,
    degrees: degreeReducer,
    transcripts: transcriptReducer,
    studentDegrees: studentDegreeReducer,
    degreeCourses: degreeCourseReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
