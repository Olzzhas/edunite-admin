import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transcriptService } from '../../services/api';

// Async thunks
export const createTranscript = createAsyncThunk(
  'transcripts/createTranscript',
  async (transcriptData, { rejectWithValue }) => {
    try {
      console.log('Creating transcript in thunk:', transcriptData);
      const response = await transcriptService.createTranscript(transcriptData);
      console.log('Create transcript response:', response);
      return response;
    } catch (error) {
      console.error('Error in createTranscript thunk:', error);
      return rejectWithValue(error.message || 'Failed to create transcript');
    }
  }
);

export const fetchStudentTranscript = createAsyncThunk(
  'transcripts/fetchStudentTranscript',
  async ({ userId, degreeId }, { rejectWithValue }) => {
    try {
      console.log(`Fetching transcript for user ${userId}, degree ${degreeId}...`);
      const response = await transcriptService.getStudentTranscript(userId, degreeId);
      console.log(`Student ${userId} transcript response:`, response);
      return response;
    } catch (error) {
      console.error(`Error in fetchStudentTranscript thunk for user ${userId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch student transcript');
    }
  }
);

export const addTranscriptEntry = createAsyncThunk(
  'transcripts/addTranscriptEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      console.log('Adding transcript entry in thunk:', entryData);
      const response = await transcriptService.addTranscriptEntry(entryData);
      console.log('Add transcript entry response:', response);
      return response;
    } catch (error) {
      console.error('Error in addTranscriptEntry thunk:', error);
      return rejectWithValue(error.message || 'Failed to add transcript entry');
    }
  }
);

export const fetchTranscriptEntries = createAsyncThunk(
  'transcripts/fetchTranscriptEntries',
  async ({ transcriptId, semesterId }, { rejectWithValue }) => {
    try {
      console.log(`Fetching entries for transcript ${transcriptId}, semester ${semesterId}...`);
      const response = await transcriptService.getTranscriptEntries(transcriptId, semesterId);
      console.log(`Transcript ${transcriptId} entries response:`, response);
      return response;
    } catch (error) {
      console.error(`Error in fetchTranscriptEntries thunk for transcript ${transcriptId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch transcript entries');
    }
  }
);

export const updateGPA = createAsyncThunk(
  'transcripts/updateGPA',
  async (transcriptId, { rejectWithValue }) => {
    try {
      console.log(`Updating GPA for transcript ${transcriptId}...`);
      const response = await transcriptService.updateGPA(transcriptId);
      console.log(`Update GPA response:`, response);
      return response;
    } catch (error) {
      console.error(`Error in updateGPA thunk for transcript ${transcriptId}:`, error);
      return rejectWithValue(error.message || 'Failed to update GPA');
    }
  }
);

export const generateTranscriptReport = createAsyncThunk(
  'transcripts/generateTranscriptReport',
  async ({ userId, degreeId, options }, { rejectWithValue }) => {
    try {
      console.log(`Generating transcript report for user ${userId}, degree ${degreeId}...`);
      const response = await transcriptService.generateTranscriptReport(userId, degreeId, options);
      console.log(`Transcript report response:`, response);
      return response;
    } catch (error) {
      console.error(`Error in generateTranscriptReport thunk for user ${userId}:`, error);
      return rejectWithValue(error.message || 'Failed to generate transcript report');
    }
  }
);

export const updateTranscriptEntry = createAsyncThunk(
  'transcripts/updateTranscriptEntry',
  async ({ entryId, entryData }, { rejectWithValue }) => {
    try {
      console.log('Updating transcript entry in thunk:', entryId, entryData);
      const response = await transcriptService.updateTranscriptEntry(entryId, entryData);
      console.log('Update transcript entry response:', response);
      return response;
    } catch (error) {
      console.error('Error in updateTranscriptEntry thunk:', error);
      return rejectWithValue(error.message || 'Failed to update transcript entry');
    }
  }
);

export const deleteTranscriptEntry = createAsyncThunk(
  'transcripts/deleteTranscriptEntry',
  async (entryId, { rejectWithValue }) => {
    try {
      console.log('Deleting transcript entry in thunk:', entryId);
      const response = await transcriptService.deleteTranscriptEntry(entryId);
      console.log('Delete transcript entry response:', response);
      return { entryId, ...response };
    } catch (error) {
      console.error('Error in deleteTranscriptEntry thunk:', error);
      return rejectWithValue(error.message || 'Failed to delete transcript entry');
    }
  }
);

// Initial state
const initialState = {
  currentTranscript: null,
  transcriptEntries: [],
  transcriptReport: null,
  loading: false,
  entriesLoading: false,
  reportLoading: false,
  error: null,
  selectedEntry: null,
};

// Slice
const transcriptSlice = createSlice({
  name: 'transcripts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTranscript: (state) => {
      state.currentTranscript = null;
      state.transcriptEntries = [];
    },
    clearTranscriptReport: (state) => {
      state.transcriptReport = null;
    },
    setSelectedEntry: (state, action) => {
      state.selectedEntry = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create transcript
      .addCase(createTranscript.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTranscript.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTranscript = action.payload.transcript || action.payload;
      })
      .addCase(createTranscript.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch student transcript
      .addCase(fetchStudentTranscript.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentTranscript.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTranscript = action.payload.transcript || action.payload;
      })
      .addCase(fetchStudentTranscript.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentTranscript = null;
      })

      // Add transcript entry
      .addCase(addTranscriptEntry.pending, (state) => {
        state.entriesLoading = true;
        state.error = null;
      })
      .addCase(addTranscriptEntry.fulfilled, (state, action) => {
        state.entriesLoading = false;
        const newEntry = action.payload.entry || action.payload;
        state.transcriptEntries.unshift(newEntry);
      })
      .addCase(addTranscriptEntry.rejected, (state, action) => {
        state.entriesLoading = false;
        state.error = action.payload;
      })

      // Fetch transcript entries
      .addCase(fetchTranscriptEntries.pending, (state) => {
        state.entriesLoading = true;
        state.error = null;
      })
      .addCase(fetchTranscriptEntries.fulfilled, (state, action) => {
        state.entriesLoading = false;
        state.transcriptEntries = Array.isArray(action.payload.entries) ? action.payload.entries : [];
      })
      .addCase(fetchTranscriptEntries.rejected, (state, action) => {
        state.entriesLoading = false;
        state.error = action.payload;
        state.transcriptEntries = [];
      })

      // Update GPA
      .addCase(updateGPA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGPA.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTranscript = action.payload.transcript || action.payload;
        if (state.currentTranscript) {
          state.currentTranscript = { ...state.currentTranscript, ...updatedTranscript };
        }
      })
      .addCase(updateGPA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate transcript report
      .addCase(generateTranscriptReport.pending, (state) => {
        state.reportLoading = true;
        state.error = null;
      })
      .addCase(generateTranscriptReport.fulfilled, (state, action) => {
        state.reportLoading = false;
        state.transcriptReport = action.payload.report || action.payload;
      })
      .addCase(generateTranscriptReport.rejected, (state, action) => {
        state.reportLoading = false;
        state.error = action.payload;
      })

      // Update transcript entry
      .addCase(updateTranscriptEntry.pending, (state) => {
        state.entriesLoading = true;
        state.error = null;
      })
      .addCase(updateTranscriptEntry.fulfilled, (state, action) => {
        state.entriesLoading = false;
        const updatedEntry = action.payload.entry || action.payload;
        const index = state.transcriptEntries.findIndex(entry => entry.id === updatedEntry.id);
        if (index !== -1) {
          state.transcriptEntries[index] = updatedEntry;
        }
      })
      .addCase(updateTranscriptEntry.rejected, (state, action) => {
        state.entriesLoading = false;
        state.error = action.payload;
      })

      // Delete transcript entry
      .addCase(deleteTranscriptEntry.pending, (state) => {
        state.entriesLoading = true;
        state.error = null;
      })
      .addCase(deleteTranscriptEntry.fulfilled, (state, action) => {
        state.entriesLoading = false;
        state.transcriptEntries = state.transcriptEntries.filter(entry => entry.id !== action.payload.entryId);
      })
      .addCase(deleteTranscriptEntry.rejected, (state, action) => {
        state.entriesLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentTranscript, 
  clearTranscriptReport, 
  setSelectedEntry 
} = transcriptSlice.actions;

export default transcriptSlice.reducer;
