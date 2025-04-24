import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';
import semesterReducer from './slices/semesterSlice';
import threadReducer from './slices/threadSlice';
import assignmentReducer from './slices/assignmentSlice';
import storageReducer from './slices/storageSlice';
import attendanceReducer from './slices/attendanceSlice';

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
