import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sportService } from '../../services/api';

// Async thunks
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sportService.getSchedules();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch schedules');
    }
  }
);

export const fetchFilteredSchedules = createAsyncThunk(
  'schedules/fetchFilteredSchedules',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await sportService.getFilteredSchedules(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch filtered schedules');
    }
  }
);

// Initial state
const initialState = {
  schedules: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 20,
  loading: false,
  error: null,
  filters: {
    facility_id: '',
    teacher_id: '',
    semester_id: '',
    start_date: '',
    end_date: ''
  }
};

// Slice
const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearFilters: (state) => {
      state.filters = {
        facility_id: '',
        teacher_id: '',
        semester_id: '',
        start_date: '',
        end_date: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.data || [];
        state.totalElements = action.payload.meta?.total || 0;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
        state.currentPage = action.payload.meta?.page || 1;
        state.pageSize = action.payload.meta?.page_size || 20;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch filtered schedules
      .addCase(fetchFilteredSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload.data || [];
        state.totalElements = action.payload.meta?.total || 0;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
        state.currentPage = action.payload.meta?.page || 1;
        state.pageSize = action.payload.meta?.page_size || 20;
      })
      .addCase(fetchFilteredSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearFilters } = scheduleSlice.actions;

export default scheduleSlice.reducer;
