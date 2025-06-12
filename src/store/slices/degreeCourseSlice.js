import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { degreeCourseService } from '../../services/api';

// Async thunks
export const addCourseToDegree = createAsyncThunk(
  'degreeCourses/addCourseToDegree',
  async (degreeCourseData, { rejectWithValue }) => {
    try {
      console.log('Adding course to degree with data:', degreeCourseData);
      const response = await degreeCourseService.addCourseToDegreе(degreeCourseData);
      console.log('Add course to degree response in thunk:', response);
      return response;
    } catch (error) {
      console.error('Error in addCourseToDegree thunk:', error);
      return rejectWithValue(error.message || 'Failed to add course to degree');
    }
  }
);

export const fetchDegreeCourses = createAsyncThunk(
  'degreeCourses/fetchDegreeCourses',
  async (degreeId, { rejectWithValue }) => {
    try {
      console.log('Fetching courses for degree:', degreeId);
      const response = await degreeCourseService.getDegreeCoursеs(degreeId);
      console.log('Degree courses response in thunk:', response);
      return { degreeId, courses: response.courses || [] };
    } catch (error) {
      console.error('Error in fetchDegreeCourses thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch degree courses');
    }
  }
);

export const removeCourseFromDegree = createAsyncThunk(
  'degreeCourses/removeCourseFromDegree',
  async ({ degreeId, courseId }, { rejectWithValue }) => {
    try {
      console.log('Removing course from degree:', { degreeId, courseId });
      const response = await degreeCourseService.removeCourseFromDegree(degreeId, courseId);
      console.log('Remove course from degree response in thunk:', response);
      return { degreeId, courseId };
    } catch (error) {
      console.error('Error in removeCourseFromDegree thunk:', error);
      return rejectWithValue(error.message || 'Failed to remove course from degree');
    }
  }
);

export const fetchStudentAvailableCourses = createAsyncThunk(
  'degreeCourses/fetchStudentAvailableCourses',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('Fetching available courses for student:', userId);
      const response = await degreeCourseService.getStudentAvailableCourses(userId);
      console.log('Student available courses response in thunk:', response);
      return response.courses || [];
    } catch (error) {
      console.error('Error in fetchStudentAvailableCourses thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch student available courses');
    }
  }
);

const degreeCourseSlice = createSlice({
  name: 'degreeCourses',
  initialState: {
    degreeCoursesMap: {}, // { degreeId: [courses] }
    studentAvailableCourses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDegreeCoursesMap: (state) => {
      state.degreeCoursesMap = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Add course to degree
      .addCase(addCourseToDegree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourseToDegree.fulfilled, (state, action) => {
        state.loading = false;
        // The course will be refetched, so we don't need to update the state here
      })
      .addCase(addCourseToDegree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch degree courses
      .addCase(fetchDegreeCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDegreeCourses.fulfilled, (state, action) => {
        state.loading = false;
        const { degreeId, courses } = action.payload;
        state.degreeCoursesMap[degreeId] = courses;
      })
      .addCase(fetchDegreeCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove course from degree
      .addCase(removeCourseFromDegree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCourseFromDegree.fulfilled, (state, action) => {
        state.loading = false;
        const { degreeId, courseId } = action.payload;
        if (state.degreeCoursesMap[degreeId]) {
          state.degreeCoursesMap[degreeId] = state.degreeCoursesMap[degreeId].filter(
            course => course.id !== courseId
          );
        }
      })
      .addCase(removeCourseFromDegree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch student available courses
      .addCase(fetchStudentAvailableCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAvailableCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAvailableCourses = action.payload;
      })
      .addCase(fetchStudentAvailableCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearDegreeCoursesMap } = degreeCourseSlice.actions;
export default degreeCourseSlice.reducer;
