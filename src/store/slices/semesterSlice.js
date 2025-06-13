import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { semesterService } from '../../services/api';

// Async thunks
export const fetchSemesters = createAsyncThunk(
  'semesters/fetchSemesters',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching semesters...');
      const response = await semesterService.getSemesters();
      console.log('Semesters response in thunk:', response);

      // If response is an array, return it directly
      if (Array.isArray(response)) {
        return response;
      }

      // If response is an object with a semesters property, return that
      if (response && response.semesters) {
        return response.semesters;
      }

      // Otherwise, return the response as is
      return response;
    } catch (error) {
      console.error('Error in fetchSemesters thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch semesters');
    }
  }
);

export const fetchSemesterById = createAsyncThunk(
  'semesters/fetchSemesterById',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`Fetching semester with ID ${id}...`);
      const response = await semesterService.getSemesterById(id);
      console.log(`Semester ${id} response in thunk:`, response);

      // If response is an object with a semester property, return that
      if (response && response.semester) {
        return response.semester;
      }

      // Otherwise, return the response as is
      return response;
    } catch (error) {
      console.error(`Error in fetchSemesterById thunk for ID ${id}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch semester');
    }
  }
);

export const createSemester = createAsyncThunk(
  'semester/createSemester',
  async (semesterData, { rejectWithValue }) => {
    try {
      console.log('Creating semester in thunk:', semesterData);
      const response = await semesterService.createSemester(semesterData);
      console.log('Create semester response:', response);
      return response;
    } catch (error) {
      console.error('Error in createSemester thunk:', error);
      return rejectWithValue(error.message || 'Failed to create semester');
    }
  }
);

export const updateSemester = createAsyncThunk(
  'semester/updateSemester',
  async ({ id, semesterData }, { rejectWithValue }) => {
    try {
      const response = await semesterService.updateSemester(id, semesterData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update semester');
    }
  }
);

export const deleteSemester = createAsyncThunk(
  'semester/deleteSemester',
  async (id, { rejectWithValue }) => {
    try {
      await semesterService.deleteSemester(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete semester');
    }
  }
);

export const addSemesterBreak = createAsyncThunk(
  'semester/addSemesterBreak',
  async ({ semesterId, breakData }, { rejectWithValue }) => {
    try {
      console.log('Adding semester break in thunk:', { semesterId, breakData });
      const response = await semesterService.addBreak(semesterId, breakData);
      console.log('Add semester break response:', response);

      // Return the response in a format that the reducer expects
      return {
        semesterId,
        break: response
      };
    } catch (error) {
      console.error('Error in addSemesterBreak thunk:', error);
      return rejectWithValue(error.message || 'Failed to add semester break');
    }
  }
);

export const updateSemesterBreak = createAsyncThunk(
  'semester/updateSemesterBreak',
  async ({ semesterId, breakId, breakData }, { rejectWithValue }) => {
    try {
      const response = await semesterService.updateBreak(semesterId, breakId, breakData);
      return { semesterId, break: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update semester break');
    }
  }
);

export const deleteSemesterBreak = createAsyncThunk(
  'semester/deleteSemesterBreak',
  async ({ semesterId, breakId }, { rejectWithValue }) => {
    try {
      await semesterService.deleteBreak(semesterId, breakId);
      return { semesterId, breakId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete semester break');
    }
  }
);

// Initial state
const initialState = {
  semesters: [],
  selectedSemester: null,
  loading: false,
  error: null,
};

// Slice
const semesterSlice = createSlice({
  name: 'semesters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSemester: (state) => {
      state.selectedSemester = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch semesters
      .addCase(fetchSemesters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesters.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSemesters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.semesters = []; // Ensure semesters is always an array
      })

      // Fetch semester by ID
      .addCase(fetchSemesterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesterById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSemester = action.payload;
      })
      .addCase(fetchSemesterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create semester
      .addCase(createSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSemester.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters.push(action.payload);
      })
      .addCase(createSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update semester
      .addCase(updateSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSemester.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.semesters.findIndex(semester => semester.id === action.payload.id);
        if (index !== -1) {
          state.semesters[index] = action.payload;
        }
        if (state.selectedSemester && state.selectedSemester.id === action.payload.id) {
          state.selectedSemester = action.payload;
        }
      })
      .addCase(updateSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete semester
      .addCase(deleteSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSemester.fulfilled, (state, action) => {
        state.loading = false;
        state.semesters = state.semesters.filter(semester => semester.id !== action.payload);
        if (state.selectedSemester && state.selectedSemester.id === action.payload) {
          state.selectedSemester = null;
        }
      })
      .addCase(deleteSemester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add semester break
      .addCase(addSemesterBreak.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSemesterBreak.fulfilled, (state, action) => {
        state.loading = false;
        const { semesterId, break: newBreak } = action.payload;

        const semesterIndex = state.semesters.findIndex(semester => semester.id === semesterId);
        if (semesterIndex !== -1) {
          state.semesters[semesterIndex].breaks.push(newBreak);
        }

        if (state.selectedSemester && state.selectedSemester.id === semesterId) {
          state.selectedSemester.breaks.push(newBreak);
        }
      })
      .addCase(addSemesterBreak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update semester break
      .addCase(updateSemesterBreak.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSemesterBreak.fulfilled, (state, action) => {
        state.loading = false;
        const { semesterId, break: updatedBreak } = action.payload;

        const semesterIndex = state.semesters.findIndex(semester => semester.id === semesterId);
        if (semesterIndex !== -1) {
          const breakIndex = state.semesters[semesterIndex].breaks.findIndex(
            b => b.id === updatedBreak.id
          );
          if (breakIndex !== -1) {
            state.semesters[semesterIndex].breaks[breakIndex] = updatedBreak;
          }
        }

        if (state.selectedSemester && state.selectedSemester.id === semesterId) {
          const breakIndex = state.selectedSemester.breaks.findIndex(
            b => b.id === updatedBreak.id
          );
          if (breakIndex !== -1) {
            state.selectedSemester.breaks[breakIndex] = updatedBreak;
          }
        }
      })
      .addCase(updateSemesterBreak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete semester break
      .addCase(deleteSemesterBreak.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSemesterBreak.fulfilled, (state, action) => {
        state.loading = false;
        const { semesterId, breakId } = action.payload;

        const semesterIndex = state.semesters.findIndex(semester => semester.id === semesterId);
        if (semesterIndex !== -1) {
          state.semesters[semesterIndex].breaks = state.semesters[semesterIndex].breaks.filter(
            b => b.id !== breakId
          );
        }

        if (state.selectedSemester && state.selectedSemester.id === semesterId) {
          state.selectedSemester.breaks = state.selectedSemester.breaks.filter(
            b => b.id !== breakId
          );
        }
      })
      .addCase(deleteSemesterBreak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedSemester } = semesterSlice.actions;

export default semesterSlice.reducer;
