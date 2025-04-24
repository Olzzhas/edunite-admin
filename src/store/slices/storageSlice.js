import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService } from '../../services/api';

// Async thunks
export const fetchFiles = createAsyncThunk(
  'storage/fetchFiles',
  async (bucket, { rejectWithValue }) => {
    try {
      const response = await storageService.getFiles(bucket);
      return { bucket, files: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch files');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'storage/uploadFile',
  async ({ file, bucket }, { rejectWithValue }) => {
    try {
      const response = await storageService.uploadFile(file, bucket);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload file');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'storage/deleteFile',
  async ({ bucket, object }, { rejectWithValue }) => {
    try {
      await storageService.deleteFile(bucket, object);
      return { bucket, object };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete file');
    }
  }
);

export const fetchStorageStats = createAsyncThunk(
  'storage/fetchStorageStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storageService.getStorageStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch storage stats');
    }
  }
);

// Initial state
const initialState = {
  files: [],
  filesByBucket: {},
  stats: null,
  loading: false,
  error: null,
};

// Slice
const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        const { bucket, files } = action.payload;
        
        state.files = files;
        
        if (bucket) {
          state.filesByBucket[bucket] = files;
        }
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        const newFile = action.payload;
        
        state.files.push(newFile);
        
        const bucket = newFile.bucket;
        if (state.filesByBucket[bucket]) {
          state.filesByBucket[bucket].push(newFile);
        }
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        const { bucket, object } = action.payload;
        
        state.files = state.files.filter(
          file => !(file.bucket === bucket && file.object === object)
        );
        
        if (state.filesByBucket[bucket]) {
          state.filesByBucket[bucket] = state.filesByBucket[bucket].filter(
            file => file.object !== object
          );
        }
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch storage stats
      .addCase(fetchStorageStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStorageStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStorageStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = storageSlice.actions;

export default storageSlice.reducer;
