import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, size = 10, filters = {} }, { rejectWithValue }) => {
    try {
      console.log('fetchUsers thunk called with filters:', filters);
      const response = await userService.getUsers(page, size, filters);

      // Handle the specific API response format
      if (response && response.users) {
        console.log('Received API response:', response);

        let filteredUsers = [...response.users];

        // Apply client-side role filtering if needed
        if (filters.role && filters.role !== '') {
          console.log('Applying client-side role filtering for:', filters.role);
          filteredUsers = filteredUsers.filter(user =>
            user.role && user.role.toLowerCase() === filters.role.toLowerCase()
          );
        }

        // Transform the API response to match our expected format with client-side filtered users
        console.log('Original API pagination data:', {
          current_page: response.current_page,
          page_size: response.page_size,
          first_page: response.first_page,
          last_page: response.last_page,
          total_records: response.total_records
        });

        // If we're doing client-side filtering, we need to adjust the pagination
        if (filters.role && filters.role !== '') {
          return {
            content: filteredUsers,
            totalElements: filteredUsers.length, // Update count based on filtered results
            totalPages: Math.ceil(filteredUsers.length / size),
            size: response.page_size,
            number: response.current_page,
          };
        } else {
          // If no client-side filtering, use the server's pagination data
          // Make sure we have valid pagination data
          const totalRecords = response.total_records || 0;
          const lastPage = response.last_page || 1;
          const pageSize = response.page_size || 10;
          const currentPage = response.current_page || 1;

          console.log('Using server pagination data:', {
            totalRecords,
            lastPage,
            pageSize,
            currentPage
          });

          return {
            content: filteredUsers,
            totalElements: totalRecords,
            totalPages: lastPage,
            size: pageSize,
            number: currentPage,
          };
        }
      }

      // Ensure we have a valid response with required fields
      if (!response || (!response.content && !response.users)) {
        console.warn('Invalid response format from API, creating default response');
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size,
          number: page,
        };
      }

      // If we have content instead of users, apply client-side filtering
      if (response.content) {
        let filteredContent = [...response.content];

        // Apply client-side role filtering if needed
        if (filters.role && filters.role !== '') {
          console.log('Applying client-side role filtering for:', filters.role);
          filteredContent = filteredContent.filter(user =>
            user.role && user.role.toLowerCase() === filters.role.toLowerCase()
          );
        }

        // Update the response with filtered content
        return {
          ...response,
          content: filteredContent,
          totalElements: filteredContent.length,
          totalPages: Math.ceil(filteredContent.length / size)
        };
      }

      return response;
    } catch (error) {
      console.error('Error fetching users:', error);

      // Return a default empty response instead of rejecting
      // This prevents the UI from showing an error message when there are no users
      if (error.response && error.response.status === 404) {
        console.warn('No users found (404), returning empty list');
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size,
          number: page,
        };
      }

      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

// Initial state
const initialState = {
  users: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  selectedUser: null,
  loading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;

        console.log('Redux state updated with pagination:', {
          totalElements: state.totalElements,
          totalPages: state.totalPages,
          currentPage: state.currentPage,
          pageSize: state.pageSize
        });
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.totalElements += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalElements -= 1;
        if (state.selectedUser && state.selectedUser.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedUser } = userSlice.actions;

export default userSlice.reducer;
