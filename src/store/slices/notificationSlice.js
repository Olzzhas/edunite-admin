import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/api';

// Async thunks
export const createNotification = createAsyncThunk(
  'notifications/create',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await notificationService.createNotification(notificationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTeacherNotification = createAsyncThunk(
  'notifications/createTeacher',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await notificationService.createTeacherNotification(notificationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAllNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await notificationService.getAllNotifications(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserNotifications = createAsyncThunk(
  'notifications/fetchUser',
  async ({ userId, params }, { rejectWithValue }) => {
    try {
      const response = await notificationService.getUserNotifications(userId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      return { notificationId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      return { notificationId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserNotificationStats = createAsyncThunk(
  'notifications/fetchStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await notificationService.getUserNotificationStats(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  notifications: [],
  userNotifications: [],
  stats: null,
  totalCount: 0,
  unreadCount: 0,
  loading: false,
  creating: false,
  error: null,
  success: false,
  message: '',
};

// Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create notification
      .addCase(createNotification.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.creating = false;
        state.success = true;
        state.message = action.payload.message || 'Notification created successfully';
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || 'Failed to create notification';
      })
      
      // Create teacher notification
      .addCase(createTeacherNotification.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTeacherNotification.fulfilled, (state, action) => {
        state.creating = false;
        state.success = true;
        state.message = action.payload.message || 'Notification created successfully';
      })
      .addCase(createTeacherNotification.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || 'Failed to create notification';
      })
      
      // Fetch all notifications
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
        state.totalCount = action.payload.total_count || 0;
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })
      
      // Fetch user notifications
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.userNotifications = action.payload.notifications || [];
        state.totalCount = action.payload.total_count || 0;
        state.unreadCount = action.payload.unread_count || 0;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user notifications';
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        state.userNotifications = state.userNotifications.map(item => {
          if (item.recipient.notification_id === notificationId) {
            return {
              ...item,
              recipient: {
                ...item.recipient,
                is_read: true,
                read_at: new Date().toISOString(),
              }
            };
          }
          return item;
        });
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        state.notifications = state.notifications.filter(n => n.id !== notificationId);
        state.userNotifications = state.userNotifications.filter(
          item => item.notification.id !== notificationId
        );
        state.totalCount = Math.max(0, state.totalCount - 1);
      })
      
      // Fetch notification stats
      .addCase(fetchUserNotificationStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { resetNotificationState } = notificationSlice.actions;

export default notificationSlice.reducer;
