import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentDegreeService } from '../../services/api';

// Async thunks
export const createStudentDegree = createAsyncThunk(
  'studentDegrees/createStudentDegree',
  async (studentDegreeData, { rejectWithValue }) => {
    try {
      console.log('Creating student degree in thunk:', studentDegreeData);
      const response = await studentDegreeService.createStudentDegree(studentDegreeData);
      console.log('Create student degree response:', response);
      return response;
    } catch (error) {
      console.error('Error in createStudentDegree thunk:', error);
      return rejectWithValue(error.message || 'Failed to create student degree');
    }
  }
);

export const fetchStudentDegrees = createAsyncThunk(
  'studentDegrees/fetchStudentDegrees',
  async (userId, { rejectWithValue }) => {
    try {
      console.log(`Fetching degrees for user ${userId}...`);
      const response = await studentDegreeService.getStudentDegrees(userId);
      console.log(`Student ${userId} degrees response:`, response);
      return response;
    } catch (error) {
      console.error(`Error in fetchStudentDegrees thunk for user ${userId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch student degrees');
    }
  }
);

export const fetchAllStudentDegrees = createAsyncThunk(
  'studentDegrees/fetchAllStudentDegrees',
  async ({ page = 1, pageSize = 10, filters = {} }, { rejectWithValue }) => {
    try {
      console.log('Fetching all student degrees with page:', page, 'pageSize:', pageSize, 'filters:', filters);
      const response = await studentDegreeService.getAllStudentDegrees(page, pageSize, filters);
      console.log('All student degrees response:', response);
      return response;
    } catch (error) {
      console.error('Error in fetchAllStudentDegrees thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch all student degrees');
    }
  }
);

export const updateStudentDegreeStatus = createAsyncThunk(
  'studentDegrees/updateStudentDegreeStatus',
  async ({ studentDegreeId, statusData }, { rejectWithValue }) => {
    try {
      console.log('Updating student degree status in thunk:', studentDegreeId, statusData);
      const response = await studentDegreeService.updateStudentDegreeStatus(studentDegreeId, statusData);
      console.log('Update student degree status response:', response);
      return response;
    } catch (error) {
      console.error('Error in updateStudentDegreeStatus thunk:', error);
      return rejectWithValue(error.message || 'Failed to update student degree status');
    }
  }
);

export const updateStudentDegree = createAsyncThunk(
  'studentDegrees/updateStudentDegree',
  async ({ studentDegreeId, studentDegreeData }, { rejectWithValue }) => {
    try {
      console.log('Updating student degree in thunk:', studentDegreeId, studentDegreeData);
      const response = await studentDegreeService.updateStudentDegree(studentDegreeId, studentDegreeData);
      console.log('Update student degree response:', response);
      return response;
    } catch (error) {
      console.error('Error in updateStudentDegree thunk:', error);
      return rejectWithValue(error.message || 'Failed to update student degree');
    }
  }
);

export const deleteStudentDegree = createAsyncThunk(
  'studentDegrees/deleteStudentDegree',
  async (studentDegreeId, { rejectWithValue }) => {
    try {
      console.log('Deleting student degree in thunk:', studentDegreeId);
      const response = await studentDegreeService.deleteStudentDegree(studentDegreeId);
      console.log('Delete student degree response:', response);
      return { studentDegreeId, ...response };
    } catch (error) {
      console.error('Error in deleteStudentDegree thunk:', error);
      return rejectWithValue(error.message || 'Failed to delete student degree');
    }
  }
);

export const fetchStudentDegreeById = createAsyncThunk(
  'studentDegrees/fetchStudentDegreeById',
  async (studentDegreeId, { rejectWithValue }) => {
    try {
      console.log(`Fetching student degree ${studentDegreeId}...`);
      const response = await studentDegreeService.getStudentDegreeById(studentDegreeId);
      console.log(`Student degree ${studentDegreeId} response:`, response);
      return response;
    } catch (error) {
      console.error(`Error in fetchStudentDegreeById thunk for ID ${studentDegreeId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch student degree');
    }
  }
);

// Initial state
const initialState = {
  studentDegrees: [],
  allStudentDegrees: [],
  selectedStudentDegree: null,
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {},
};

// Slice
const studentDegreeSlice = createSlice({
  name: 'studentDegrees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedStudentDegree: (state) => {
      state.selectedStudentDegree = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Create student degree
      .addCase(createStudentDegree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudentDegree.fulfilled, (state, action) => {
        state.loading = false;
        const newStudentDegree = action.payload.student_degree || action.payload;
        state.allStudentDegrees.unshift(newStudentDegree);
        state.totalCount += 1;
      })
      .addCase(createStudentDegree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch student degrees (for specific user)
      .addCase(fetchStudentDegrees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDegrees.fulfilled, (state, action) => {
        state.loading = false;
        state.studentDegrees = Array.isArray(action.payload.student_degrees) ? action.payload.student_degrees : [];
      })
      .addCase(fetchStudentDegrees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.studentDegrees = [];
      })

      // Fetch all student degrees
      .addCase(fetchAllStudentDegrees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudentDegrees.fulfilled, (state, action) => {
        state.loading = false;
        state.allStudentDegrees = Array.isArray(action.payload.student_degrees) ? action.payload.student_degrees : [];
        state.totalCount = action.payload.total_count || 0;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchAllStudentDegrees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.allStudentDegrees = [];
      })

      // Update student degree status
      .addCase(updateStudentDegreeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentDegreeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStudentDegree = action.payload.student_degree || action.payload;
        
        // Update in allStudentDegrees
        const allIndex = state.allStudentDegrees.findIndex(sd => sd.id === updatedStudentDegree.id);
        if (allIndex !== -1) {
          state.allStudentDegrees[allIndex] = updatedStudentDegree;
        }
        
        // Update in studentDegrees
        const index = state.studentDegrees.findIndex(sd => sd.id === updatedStudentDegree.id);
        if (index !== -1) {
          state.studentDegrees[index] = updatedStudentDegree;
        }
        
        // Update selected if it matches
        if (state.selectedStudentDegree && state.selectedStudentDegree.id === updatedStudentDegree.id) {
          state.selectedStudentDegree = updatedStudentDegree;
        }
      })
      .addCase(updateStudentDegreeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update student degree
      .addCase(updateStudentDegree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentDegree.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStudentDegree = action.payload.student_degree || action.payload;
        
        // Update in allStudentDegrees
        const allIndex = state.allStudentDegrees.findIndex(sd => sd.id === updatedStudentDegree.id);
        if (allIndex !== -1) {
          state.allStudentDegrees[allIndex] = updatedStudentDegree;
        }
        
        // Update in studentDegrees
        const index = state.studentDegrees.findIndex(sd => sd.id === updatedStudentDegree.id);
        if (index !== -1) {
          state.studentDegrees[index] = updatedStudentDegree;
        }
        
        // Update selected if it matches
        if (state.selectedStudentDegree && state.selectedStudentDegree.id === updatedStudentDegree.id) {
          state.selectedStudentDegree = updatedStudentDegree;
        }
      })
      .addCase(updateStudentDegree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete student degree
      .addCase(deleteStudentDegree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentDegree.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.studentDegreeId;
        
        state.allStudentDegrees = state.allStudentDegrees.filter(sd => sd.id !== deletedId);
        state.studentDegrees = state.studentDegrees.filter(sd => sd.id !== deletedId);
        state.totalCount -= 1;
        
        if (state.selectedStudentDegree && state.selectedStudentDegree.id === deletedId) {
          state.selectedStudentDegree = null;
        }
      })
      .addCase(deleteStudentDegree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch student degree by ID
      .addCase(fetchStudentDegreeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDegreeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudentDegree = action.payload.student_degree || action.payload;
      })
      .addCase(fetchStudentDegreeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSelectedStudentDegree, 
  setCurrentPage, 
  setFilters, 
  clearFilters 
} = studentDegreeSlice.actions;

export default studentDegreeSlice.reducer;
