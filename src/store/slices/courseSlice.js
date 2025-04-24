import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from '../../services/api';

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      console.log('Fetching courses with page:', page, 'size:', size);
      const response = await courseService.getCourses(page, size);

      console.log('Courses response in thunk:', response);

      // Ensure we have a valid response
      if (!response) {
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size,
          number: page,
        };
      }

      return response;
    } catch (error) {
      console.error('Error in fetchCourses thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourseById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await courseService.createCourse(courseData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const response = await courseService.updateCourse(id, courseData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await courseService.deleteCourse(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete course');
    }
  }
);

export const uploadCourseBanner = createAsyncThunk(
  'courses/uploadCourseBanner',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const response = await courseService.uploadBanner(id, file);
      return { id, bannerImageUrl: response.url };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload banner');
    }
  }
);

// Initial state
const initialState = {
  courses: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  selectedCourse: null,
  loading: false,
  error: null,
};

// Slice
const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
        state.totalElements += 1;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.selectedCourse && state.selectedCourse.id === action.payload.id) {
          state.selectedCourse = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(course => course.id !== action.payload);
        state.totalElements -= 1;
        if (state.selectedCourse && state.selectedCourse.id === action.payload) {
          state.selectedCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload course banner
      .addCase(uploadCourseBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadCourseBanner.fulfilled, (state, action) => {
        state.loading = false;
        const { id, bannerImageUrl } = action.payload;

        const index = state.courses.findIndex(course => course.id === id);
        if (index !== -1) {
          state.courses[index].bannerImageUrl = bannerImageUrl;
        }

        if (state.selectedCourse && state.selectedCourse.id === id) {
          state.selectedCourse.bannerImageUrl = bannerImageUrl;
        }
      })
      .addCase(uploadCourseBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedCourse } = courseSlice.actions;

export default courseSlice.reducer;
