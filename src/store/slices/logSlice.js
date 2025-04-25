import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import logService from '../../services/api/logService';

// Async thunks
export const fetchLogs = createAsyncThunk(
  'logs/fetchLogs',
  async (params, { rejectWithValue }) => {
    try {
      return await logService.getLogs(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch logs');
    }
  }
);

export const fetchLogById = createAsyncThunk(
  'logs/fetchLogById',
  async (id, { rejectWithValue }) => {
    try {
      return await logService.getLogById(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch log details');
    }
  }
);

export const countLogs = createAsyncThunk(
  'logs/countLogs',
  async (params, { rejectWithValue }) => {
    try {
      return await logService.countLogs(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to count logs');
    }
  }
);

export const fetchLogLevels = createAsyncThunk(
  'logs/fetchLogLevels',
  async (_, { rejectWithValue }) => {
    try {
      return await logService.getLogLevels();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch log levels');
    }
  }
);

export const fetchLogServices = createAsyncThunk(
  'logs/fetchLogServices',
  async (_, { rejectWithValue }) => {
    try {
      return await logService.getLogServices();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch log services');
    }
  }
);

// Initial state
const initialState = {
  logs: [],
  selectedLog: null,
  totalCount: 0,
  logLevels: [],
  logServices: [],
  loading: false,
  detailLoading: false,
  error: null,
  filters: {
    level: '',
    service: '',
    start_date: '',
    end_date: '',
    limit: 20,
    skip: 0
  }
};

// Slice
const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
    },
    clearSelectedLog: (state) => {
      state.selectedLog = null;
    },
    selectLog: (state, action) => {
      state.selectedLog = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch logs
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we always have an array of logs
        state.logs = Array.isArray(action.payload) ? action.payload : [];
        console.log('Logs fetched:', state.logs);
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch log by ID
      .addCase(fetchLogById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchLogById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedLog = action.payload;
      })
      .addCase(fetchLogById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      // Count logs
      .addCase(countLogs.fulfilled, (state, action) => {
        state.totalCount = action.payload;
      })

      // Fetch log levels
      .addCase(fetchLogLevels.fulfilled, (state, action) => {
        // Handle the nested response structure { levels: [...] }
        const levels = action.payload?.levels || action.payload;
        // If API returns null or undefined, use default values
        state.logLevels = Array.isArray(levels) ? levels : ['error', 'warn', 'info', 'debug', 'trace'];
        console.log('Log levels fetched:', state.logLevels);
      })

      // Fetch log services
      .addCase(fetchLogServices.fulfilled, (state, action) => {
        // Handle the nested response structure { services: [...] }
        const services = action.payload?.services || action.payload;
        // If API returns null or undefined, use default values
        state.logServices = Array.isArray(services) ? services : ['user', 'thread', 'course', 'semester', 'keycloak'];
        console.log('Log services fetched:', state.logServices);
      });
  }
});

export const { setFilters, resetFilters, clearSelectedLog, selectLog } = logSlice.actions;

export default logSlice.reducer;
