import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceService } from '../../services/api';

// Async thunks
export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchAttendanceRecords',
  async ({ threadId, date }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAttendanceRecords(threadId, date);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch attendance records');
    }
  }
);

export const createAttendanceRecord = createAsyncThunk(
  'attendance/createAttendanceRecord',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await attendanceService.createAttendanceRecord(attendanceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create attendance record');
    }
  }
);

export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateAttendanceRecord',
  async ({ id, attendanceData }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.updateAttendanceRecord(id, attendanceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update attendance record');
    }
  }
);

export const deleteAttendanceRecord = createAsyncThunk(
  'attendance/deleteAttendanceRecord',
  async (id, { rejectWithValue }) => {
    try {
      await attendanceService.deleteAttendanceRecord(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete attendance record');
    }
  }
);

export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchAttendanceStats',
  async (threadId, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAttendanceStats(threadId);
      return { threadId, stats: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch attendance stats');
    }
  }
);

// Initial state
const initialState = {
  records: [],
  statsByThread: {},
  loading: false,
  error: null,
};

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance records
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create attendance record
      .addCase(createAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(createAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update attendance record
      .addCase(updateAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRecord = action.payload;
        
        const recordIndex = state.records.findIndex(record => record.id === updatedRecord.id);
        if (recordIndex !== -1) {
          state.records[recordIndex] = updatedRecord;
        }
      })
      .addCase(updateAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete attendance record
      .addCase(deleteAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(record => record.id !== action.payload);
      })
      .addCase(deleteAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch attendance stats
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        const { threadId, stats } = action.payload;
        state.statsByThread[threadId] = stats;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = attendanceSlice.actions;

export default attendanceSlice.reducer;
