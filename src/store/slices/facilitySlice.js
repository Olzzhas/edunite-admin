import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sportService } from '../../services/api';

// Async thunks
export const fetchFacilities = createAsyncThunk(
  'facilities/fetchFacilities',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await sportService.getFacilities(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch facilities');
    }
  }
);

export const fetchFacilityById = createAsyncThunk(
  'facilities/fetchFacilityById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await sportService.getFacilityById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch facility');
    }
  }
);

export const createFacility = createAsyncThunk(
  'facilities/createFacility',
  async (facilityData, { rejectWithValue }) => {
    try {
      const response = await sportService.createFacility(facilityData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create facility');
    }
  }
);

export const updateFacility = createAsyncThunk(
  'facilities/updateFacility',
  async ({ id, facilityData }, { rejectWithValue }) => {
    try {
      const response = await sportService.updateFacility(id, facilityData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update facility');
    }
  }
);

export const deleteFacility = createAsyncThunk(
  'facilities/deleteFacility',
  async (id, { rejectWithValue }) => {
    try {
      await sportService.deleteFacility(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete facility');
    }
  }
);

// Initial state
const initialState = {
  facilities: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  selectedFacility: null,
  loading: false,
  error: null,
};

// Slice
const facilitySlice = createSlice({
  name: 'facilities',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedFacility: (state) => {
      state.selectedFacility = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch facilities
      .addCase(fetchFacilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacilities.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities = action.payload.data || [];
        state.totalElements = action.payload.meta?.total || 0;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
        state.currentPage = action.payload.meta?.page || 1;
        state.pageSize = action.payload.meta?.page_size || 10;
      })
      .addCase(fetchFacilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch facility by ID
      .addCase(fetchFacilityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacilityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFacility = action.payload;
      })
      .addCase(fetchFacilityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create facility
      .addCase(createFacility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFacility.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities.push(action.payload);
        state.totalElements += 1;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
      })
      .addCase(createFacility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update facility
      .addCase(updateFacility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFacility.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.facilities.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.facilities[index] = action.payload;
        }
        if (state.selectedFacility && state.selectedFacility.id === action.payload.id) {
          state.selectedFacility = action.payload;
        }
      })
      .addCase(updateFacility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete facility
      .addCase(deleteFacility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFacility.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities = state.facilities.filter(f => f.id !== action.payload);
        state.totalElements -= 1;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
        if (state.selectedFacility && state.selectedFacility.id === action.payload) {
          state.selectedFacility = null;
        }
      })
      .addCase(deleteFacility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedFacility } = facilitySlice.actions;

export default facilitySlice.reducer;
