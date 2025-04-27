import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sportService } from '../../services/api';

// Async thunks
export const fetchAvailableSportTypes = createAsyncThunk(
  'physicalEducation/fetchAvailableSportTypes',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await sportService.getAvailableSportTypes(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch available sport types');
    }
  }
);

export const fetchAvailableFacilities = createAsyncThunk(
  'physicalEducation/fetchAvailableFacilities',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await sportService.getAvailableFacilities(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch available facilities');
    }
  }
);

export const bookSession = createAsyncThunk(
  'physicalEducation/bookSession',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await sportService.bookSession(bookingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to book session');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'physicalEducation/cancelBooking',
  async (id, { rejectWithValue }) => {
    try {
      await sportService.cancelBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel booking');
    }
  }
);

export const fetchSchedules = createAsyncThunk(
  'physicalEducation/fetchSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sportService.getSchedules();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch schedules');
    }
  }
);

export const createWeeklySchedule = createAsyncThunk(
  'physicalEducation/createWeeklySchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await sportService.createWeeklySchedule(scheduleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create weekly schedule');
    }
  }
);

export const createSportPatterns = createAsyncThunk(
  'physicalEducation/createSportPatterns',
  async (patternsData, { rejectWithValue }) => {
    try {
      const response = await sportService.createSportPatterns(patternsData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create sport patterns');
    }
  }
);

// Initial state
const initialState = {
  availableSportTypes: [],
  availableFacilities: [],
  schedules: [],
  bookings: [],
  totalSportTypes: 0,
  totalFacilities: 0,
  currentSportTypesPage: 1,
  currentFacilitiesPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

// Slice
const physicalEducationSlice = createSlice({
  name: 'physicalEducation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch available sport types
      .addCase(fetchAvailableSportTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSportTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSportTypes = action.payload.data || [];
        state.totalSportTypes = action.payload.meta?.total || 0;
        state.currentSportTypesPage = action.payload.meta?.page || 1;
      })
      .addCase(fetchAvailableSportTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch available facilities
      .addCase(fetchAvailableFacilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableFacilities.fulfilled, (state, action) => {
        state.loading = false;
        state.availableFacilities = action.payload.data || [];
        state.totalFacilities = action.payload.meta?.total || 0;
        state.currentFacilitiesPage = action.payload.meta?.page || 1;
      })
      .addCase(fetchAvailableFacilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Book session
      .addCase(bookSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookSession.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(bookSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(b => b.id !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create weekly schedule
      .addCase(createWeeklySchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWeeklySchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules.push(action.payload);
      })
      .addCase(createWeeklySchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create sport patterns
      .addCase(createSportPatterns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSportPatterns.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = [...state.schedules, ...action.payload];
      })
      .addCase(createSportPatterns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = physicalEducationSlice.actions;

export default physicalEducationSlice.reducer;
