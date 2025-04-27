import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sportService } from '../../services/api';

// Async thunks
export const fetchSportTypes = createAsyncThunk(
  'sportTypes/fetchSportTypes',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await sportService.getSportTypes(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch sport types');
    }
  }
);

export const fetchSportTypeById = createAsyncThunk(
  'sportTypes/fetchSportTypeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await sportService.getSportTypeById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch sport type');
    }
  }
);

export const createSportType = createAsyncThunk(
  'sportTypes/createSportType',
  async (sportTypeData, { rejectWithValue }) => {
    try {
      const response = await sportService.createSportType(sportTypeData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create sport type');
    }
  }
);

export const updateSportType = createAsyncThunk(
  'sportTypes/updateSportType',
  async ({ id, sportTypeData }, { rejectWithValue }) => {
    try {
      const response = await sportService.updateSportType(id, sportTypeData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update sport type');
    }
  }
);

export const deleteSportType = createAsyncThunk(
  'sportTypes/deleteSportType',
  async (id, { rejectWithValue }) => {
    try {
      await sportService.deleteSportType(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete sport type');
    }
  }
);

// Initial state
const initialState = {
  sportTypes: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  selectedSportType: null,
  loading: false,
  error: null,
};

// Slice
const sportTypeSlice = createSlice({
  name: 'sportTypes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSportType: (state) => {
      state.selectedSportType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sport types
      .addCase(fetchSportTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSportTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.sportTypes = action.payload.data || [];
        state.totalElements = action.payload.meta?.total || 0;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
        state.currentPage = action.payload.meta?.page || 1;
        state.pageSize = action.payload.meta?.page_size || 10;
      })
      .addCase(fetchSportTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch sport type by ID
      .addCase(fetchSportTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSportTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSportType = action.payload;
      })
      .addCase(fetchSportTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create sport type
      .addCase(createSportType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSportType.fulfilled, (state, action) => {
        state.loading = false;
        state.sportTypes.push(action.payload);
        state.totalElements += 1;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
      })
      .addCase(createSportType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update sport type
      .addCase(updateSportType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSportType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sportTypes.findIndex(st => st.id === action.payload.id);
        if (index !== -1) {
          state.sportTypes[index] = action.payload;
        }
        if (state.selectedSportType && state.selectedSportType.id === action.payload.id) {
          state.selectedSportType = action.payload;
        }
      })
      .addCase(updateSportType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete sport type
      .addCase(deleteSportType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSportType.fulfilled, (state, action) => {
        state.loading = false;
        state.sportTypes = state.sportTypes.filter(st => st.id !== action.payload);
        state.totalElements -= 1;
        state.totalPages = Math.ceil(state.totalElements / state.pageSize);
        if (state.selectedSportType && state.selectedSportType.id === action.payload) {
          state.selectedSportType = null;
        }
      })
      .addCase(deleteSportType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedSportType } = sportTypeSlice.actions;

export default sportTypeSlice.reducer;
