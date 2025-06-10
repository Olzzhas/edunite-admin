import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { degreeService } from '../../services/api';

// Async thunks
export const fetchDegrees = createAsyncThunk(
  'degrees/fetchDegrees',
  async ({ page = 1, pageSize = 10, level = '' }, { rejectWithValue }) => {
    try {
      console.log('Fetching degrees with page:', page, 'pageSize:', pageSize, 'level:', level);
      const response = await degreeService.getDegrees(page, pageSize, level);
      console.log('Degrees response in thunk:', response);
      return response;
    } catch (error) {
      console.error('Error in fetchDegrees thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch degrees');
    }
  }
);

export const fetchDegreeById = createAsyncThunk(
  'degrees/fetchDegreeById',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`Fetching degree with ID ${id}...`);
      const response = await degreeService.getDegreeById(id);
      console.log(`Degree ${id} response in thunk:`, response);
      return response;
    } catch (error) {
      console.error(`Error in fetchDegreeById thunk for ID ${id}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch degree');
    }
  }
);

export const createDegree = createAsyncThunk(
  'degrees/createDegree',
  async (degreeData, { rejectWithValue }) => {
    try {
      console.log('Creating degree in thunk:', degreeData);
      const response = await degreeService.createDegree(degreeData);
      console.log('Create degree response:', response);
      return response;
    } catch (error) {
      console.error('Error in createDegree thunk:', error);
      return rejectWithValue(error.message || 'Failed to create degree');
    }
  }
);

export const updateDegree = createAsyncThunk(
  'degrees/updateDegree',
  async ({ id, degreeData }, { rejectWithValue }) => {
    try {
      console.log('Updating degree in thunk:', id, degreeData);
      const response = await degreeService.updateDegree(id, degreeData);
      console.log('Update degree response:', response);
      return response;
    } catch (error) {
      console.error('Error in updateDegree thunk:', error);
      return rejectWithValue(error.message || 'Failed to update degree');
    }
  }
);

export const deleteDegree = createAsyncThunk(
  'degrees/deleteDegree',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Deleting degree in thunk:', id);
      const response = await degreeService.deleteDegree(id);
      console.log('Delete degree response:', response);
      return { id, ...response };
    } catch (error) {
      console.error('Error in deleteDegree thunk:', error);
      return rejectWithValue(error.message || 'Failed to delete degree');
    }
  }
);

// Initial state
const initialState = {
  degrees: [],
  selectedDegree: null,
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

// Slice
const degreeSlice = createSlice({
  name: 'degrees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedDegree: (state) => {
      state.selectedDegree = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch degrees
      .addCase(fetchDegrees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDegrees.fulfilled, (state, action) => {
        state.loading = false;
        state.degrees = Array.isArray(action.payload.degrees) ? action.payload.degrees : [];
        state.totalCount = action.payload.total_count || 0;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchDegrees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.degrees = [];
      })

      // Fetch degree by ID
      .addCase(fetchDegreeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDegreeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDegree = action.payload.degree || action.payload;
      })
      .addCase(fetchDegreeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create degree
      .addCase(createDegree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDegree.fulfilled, (state, action) => {
        state.loading = false;
        const newDegree = action.payload.degree || action.payload;
        state.degrees.unshift(newDegree);
        state.totalCount += 1;
      })
      .addCase(createDegree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update degree
      .addCase(updateDegree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDegree.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDegree = action.payload.degree || action.payload;
        const index = state.degrees.findIndex(degree => degree.id === updatedDegree.id);
        if (index !== -1) {
          state.degrees[index] = updatedDegree;
        }
        if (state.selectedDegree && state.selectedDegree.id === updatedDegree.id) {
          state.selectedDegree = updatedDegree;
        }
      })
      .addCase(updateDegree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete degree
      .addCase(deleteDegree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDegree.fulfilled, (state, action) => {
        state.loading = false;
        state.degrees = state.degrees.filter(degree => degree.id !== action.payload.id);
        state.totalCount -= 1;
        if (state.selectedDegree && state.selectedDegree.id === action.payload.id) {
          state.selectedDegree = null;
        }
      })
      .addCase(deleteDegree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedDegree, setCurrentPage } = degreeSlice.actions;
export default degreeSlice.reducer;
