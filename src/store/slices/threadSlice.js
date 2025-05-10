import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { threadService } from '../../services/api';

// Async thunks
export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await threadService.getThreads(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch threads');
    }
  }
);

export const fetchThreadById = createAsyncThunk(
  'threads/fetchThreadById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await threadService.getThreadById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch thread');
    }
  }
);

export const updateThread = createAsyncThunk(
  'threads/updateThread',
  async ({ id, threadData }, { rejectWithValue }) => {
    try {
      console.log('Updating thread in thunk:', { id, threadData });
      const response = await threadService.updateThread(id, threadData);
      console.log('Update thread response:', response);
      return response;
    } catch (error) {
      console.error('Error in updateThread thunk:', error);
      return rejectWithValue(error.message || 'Failed to update thread');
    }
  }
);

export const fetchThreadsByCourse = createAsyncThunk(
  'threads/fetchThreadsByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await threadService.getThreadsByCourse(courseId);
      return { courseId, threads: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch threads by course');
    }
  }
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async (threadData, { rejectWithValue }) => {
    try {
      const response = await threadService.createThread(threadData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create thread');
    }
  }
);

export const createThreadWithSchedule = createAsyncThunk(
  'threads/createThreadWithSchedule',
  async (threadData, { rejectWithValue }) => {
    try {
      const response = await threadService.createThreadWithSchedule(threadData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create thread with schedule');
    }
  }
);

export const deleteThread = createAsyncThunk(
  'threads/deleteThread',
  async (id, { rejectWithValue }) => {
    try {
      await threadService.deleteThread(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete thread');
    }
  }
);

export const addStudentToThread = createAsyncThunk(
  'threads/addStudentToThread',
  async ({ threadId, studentId }, { rejectWithValue }) => {
    try {
      const response = await threadService.addStudentToThread(threadId, studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add student to thread');
    }
  }
);

export const removeStudentFromThread = createAsyncThunk(
  'threads/removeStudentFromThread',
  async ({ threadId, studentId }, { rejectWithValue }) => {
    try {
      const response = await threadService.removeStudentFromThread(threadId, studentId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove student from thread');
    }
  }
);

export const addScheduleToThread = createAsyncThunk(
  'threads/addScheduleToThread',
  async ({ threadId, scheduleData }, { rejectWithValue }) => {
    try {
      const response = await threadService.addScheduleToThread(threadId, scheduleData);
      return { threadId, schedule: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add schedule to thread');
    }
  }
);

export const removeScheduleFromThread = createAsyncThunk(
  'threads/removeScheduleFromThread',
  async ({ threadId, scheduleId }, { rejectWithValue }) => {
    try {
      const response = await threadService.removeScheduleFromThread(threadId, scheduleId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove schedule from thread');
    }
  }
);

// Initial state
const initialState = {
  threads: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  selectedThread: null,
  threadsByCourse: {},
  loading: false,
  error: null,
};

// Slice
const threadSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedThread: (state) => {
      state.selectedThread = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch threads
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch thread by ID
      .addCase(fetchThreadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedThread = action.payload;
      })
      .addCase(fetchThreadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch threads by course
      .addCase(fetchThreadsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        const { courseId, threads } = action.payload;
        state.threadsByCourse[courseId] = threads;
      })
      .addCase(fetchThreadsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create thread
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.push(action.payload);
        state.totalElements += 1;

        // Update threadsByCourse if it exists
        const courseId = action.payload.courseId;
        if (state.threadsByCourse[courseId]) {
          state.threadsByCourse[courseId].push(action.payload);
        }
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create thread with schedule
      .addCase(createThreadWithSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThreadWithSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.push(action.payload);
        state.totalElements += 1;

        // Update threadsByCourse if it exists
        const courseId = action.payload.courseId || action.payload.course_id;
        if (state.threadsByCourse[courseId]) {
          state.threadsByCourse[courseId].push(action.payload);
        }
      })
      .addCase(createThreadWithSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update thread
      .addCase(updateThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateThread.fulfilled, (state, action) => {
        state.loading = false;
        const updatedThread = action.payload;

        // Update in threads array
        const threadIndex = state.threads.findIndex(thread => thread.id === updatedThread.id);
        if (threadIndex !== -1) {
          state.threads[threadIndex] = updatedThread;
        }

        // Update in selectedThread
        if (state.selectedThread && state.selectedThread.id === updatedThread.id) {
          state.selectedThread = updatedThread;
        }

        // Update in threadsByCourse
        if (updatedThread.course_id) {
          const courseId = updatedThread.course_id;
          if (state.threadsByCourse[courseId]) {
            const courseThreadIndex = state.threadsByCourse[courseId].findIndex(
              thread => thread.id === updatedThread.id
            );
            if (courseThreadIndex !== -1) {
              state.threadsByCourse[courseId][courseThreadIndex] = updatedThread;
            }
          }
        }
      })
      .addCase(updateThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete thread
      .addCase(deleteThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.loading = false;
        const deletedThread = state.threads.find(thread => thread.id === action.payload);

        state.threads = state.threads.filter(thread => thread.id !== action.payload);
        state.totalElements -= 1;

        if (state.selectedThread && state.selectedThread.id === action.payload) {
          state.selectedThread = null;
        }

        // Update threadsByCourse if it exists
        if (deletedThread) {
          const courseId = deletedThread.courseId;
          if (state.threadsByCourse[courseId]) {
            state.threadsByCourse[courseId] = state.threadsByCourse[courseId].filter(
              thread => thread.id !== action.payload
            );
          }
        }
      })
      .addCase(deleteThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add student to thread
      .addCase(addStudentToThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudentToThread.fulfilled, (state, action) => {
        state.loading = false;
        const updatedThread = action.payload;

        // Update in threads array
        const threadIndex = state.threads.findIndex(thread => thread.id === updatedThread.id);
        if (threadIndex !== -1) {
          state.threads[threadIndex] = updatedThread;
        }

        // Update in selectedThread
        if (state.selectedThread && state.selectedThread.id === updatedThread.id) {
          state.selectedThread = updatedThread;
        }

        // Update in threadsByCourse
        const courseId = updatedThread.courseId;
        if (state.threadsByCourse[courseId]) {
          const courseThreadIndex = state.threadsByCourse[courseId].findIndex(
            thread => thread.id === updatedThread.id
          );
          if (courseThreadIndex !== -1) {
            state.threadsByCourse[courseId][courseThreadIndex] = updatedThread;
          }
        }
      })
      .addCase(addStudentToThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove student from thread
      .addCase(removeStudentFromThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeStudentFromThread.fulfilled, (state, action) => {
        state.loading = false;
        const updatedThread = action.payload;

        // Update in threads array
        const threadIndex = state.threads.findIndex(thread => thread.id === updatedThread.id);
        if (threadIndex !== -1) {
          state.threads[threadIndex] = updatedThread;
        }

        // Update in selectedThread
        if (state.selectedThread && state.selectedThread.id === updatedThread.id) {
          state.selectedThread = updatedThread;
        }

        // Update in threadsByCourse
        const courseId = updatedThread.courseId;
        if (state.threadsByCourse[courseId]) {
          const courseThreadIndex = state.threadsByCourse[courseId].findIndex(
            thread => thread.id === updatedThread.id
          );
          if (courseThreadIndex !== -1) {
            state.threadsByCourse[courseId][courseThreadIndex] = updatedThread;
          }
        }
      })
      .addCase(removeStudentFromThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add schedule to thread
      .addCase(addScheduleToThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScheduleToThread.fulfilled, (state, action) => {
        state.loading = false;
        const { threadId, schedule } = action.payload;

        // Update in threads array
        const threadIndex = state.threads.findIndex(thread => thread.id === threadId);
        if (threadIndex !== -1) {
          state.threads[threadIndex].schedule.push(schedule);
        }

        // Update in selectedThread
        if (state.selectedThread && state.selectedThread.id === threadId) {
          state.selectedThread.schedule.push(schedule);
        }

        // Update in threadsByCourse
        for (const courseId in state.threadsByCourse) {
          const courseThreadIndex = state.threadsByCourse[courseId].findIndex(
            thread => thread.id === threadId
          );
          if (courseThreadIndex !== -1) {
            state.threadsByCourse[courseId][courseThreadIndex].schedule.push(schedule);
            break;
          }
        }
      })
      .addCase(addScheduleToThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove schedule from thread
      .addCase(removeScheduleFromThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeScheduleFromThread.fulfilled, (state, action) => {
        state.loading = false;
        const updatedThread = action.payload;

        // Update in threads array
        const threadIndex = state.threads.findIndex(thread => thread.id === updatedThread.id);
        if (threadIndex !== -1) {
          state.threads[threadIndex] = updatedThread;
        }

        // Update in selectedThread
        if (state.selectedThread && state.selectedThread.id === updatedThread.id) {
          state.selectedThread = updatedThread;
        }

        // Update in threadsByCourse
        const courseId = updatedThread.courseId;
        if (state.threadsByCourse[courseId]) {
          const courseThreadIndex = state.threadsByCourse[courseId].findIndex(
            thread => thread.id === updatedThread.id
          );
          if (courseThreadIndex !== -1) {
            state.threadsByCourse[courseId][courseThreadIndex] = updatedThread;
          }
        }
      })
      .addCase(removeScheduleFromThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedThread } = threadSlice.actions;

export default threadSlice.reducer;
