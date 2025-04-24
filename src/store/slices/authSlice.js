import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await authService.login(email, password);

      // пускаем только admin / moderator
      if (res.user && (res.user.role === 'admin' || res.user.role === 'moderator')) {
        return res;
      }

      // просто отклоняем: НИКАКИХ logout() и перезагрузок
      return rejectWithValue('Unauthorized: admin or moderator access required');
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    authService.logout();
    return null;
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

// Initial state
const initialState = {
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;   // <<< сбрасываем сразу
        state.user = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        // чтобы токены не остались висеть
        authService.logout();
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })

      // Refresh token
      .addCase(refreshToken.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, setError } = authSlice.actions;

export default authSlice.reducer;
