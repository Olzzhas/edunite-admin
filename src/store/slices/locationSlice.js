import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { locationService } from '../../services/api';

// Async thunks
export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await locationService.getLocations(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch locations');
    }
  }
);

export const fetchLocationById = createAsyncThunk(
  'locations/fetchLocationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await locationService.getLocationById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch location');
    }
  }
);

export const createLocation = createAsyncThunk(
  'locations/createLocation',
  async (locationData, { rejectWithValue }) => {
    try {
      const response = await locationService.createLocation(locationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create location');
    }
  }
);

export const updateLocation = createAsyncThunk(
  'locations/updateLocation',
  async ({ id, locationData }, { rejectWithValue }) => {
    try {
      const response = await locationService.updateLocation(id, locationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update location');
    }
  }
);

export const deleteLocation = createAsyncThunk(
  'locations/deleteLocation',
  async (id, { rejectWithValue }) => {
    try {
      await locationService.deleteLocation(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete location');
    }
  }
);

export const checkLocationAvailability = createAsyncThunk(
  'locations/checkLocationAvailability',
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await locationService.checkLocationAvailability(availabilityData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to check location availability');
    }
  }
);

// Initial state
const initialState = {
  locations: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  selectedLocation: null,
  loading: false,
  error: null,
  availabilityResult: null,
  availabilityLoading: false,
  availabilityError: null,
};

// Slice
const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = null;
    },
    clearAvailabilityResult: (state) => {
      state.availabilityResult = null;
      state.availabilityError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch locations
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.locations || action.payload.data || [];
        state.totalElements = action.payload.total || action.payload.meta?.total || 0;
        state.totalPages = action.payload.total_pages || Math.ceil(state.totalElements / state.pageSize);
        state.currentPage = action.payload.page || action.payload.meta?.page || 1;
        state.pageSize = action.payload.page_size || action.payload.meta?.page_size || 10;

        console.log('Locations loaded:', state.locations);
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch location by ID
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLocation = action.payload;
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create location
      .addCase(createLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.locations.push(action.payload);
        state.totalElements += 1;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
      })
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update location
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.locations.findIndex(location => location.id === action.payload.id);
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
        if (state.selectedLocation && state.selectedLocation.id === action.payload.id) {
          state.selectedLocation = action.payload;
        }
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete location
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = state.locations.filter(location => location.id !== action.payload);
        state.totalElements -= 1;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
        if (state.selectedLocation && state.selectedLocation.id === action.payload) {
          state.selectedLocation = null;
        }
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check location availability
      .addCase(checkLocationAvailability.pending, (state) => {
        state.availabilityLoading = true;
        state.availabilityError = null;
      })
      .addCase(checkLocationAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.availabilityResult = action.payload;
      })
      .addCase(checkLocationAvailability.rejected, (state, action) => {
        state.availabilityLoading = false;
        state.availabilityError = action.payload;
      });
  },
});

export const { clearError, clearSelectedLocation, clearAvailabilityResult } = locationSlice.actions;

export default locationSlice.reducer;
